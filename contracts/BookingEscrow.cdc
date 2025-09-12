import FungibleToken from 0x9a0766d93b6608b7
import StationRegistry from 0xDeployer
import ReputationNFT from 0xDeployer

pub contract BookingEscrow {

    pub struct BookingInfo {
        pub let id: UInt64
        pub let stationId: UInt64
        pub let driver: Address
        pub let owner: Address
        pub let amount: UFix64
        pub var completed: Bool
        pub var driverRated: Bool
        pub var ownerRated: Bool

        init(
            id: UInt64,
            stationId: UInt64,
            driver: Address,
            owner: Address,
            amount: UFix64
        ) {
            self.id = id
            self.stationId = stationId
            self.driver = driver
            self.owner = owner
            self.amount = amount
            self.completed = false
            self.driverRated = false
            self.ownerRated = false
        }
    }

    access(self) var nextBookingId: UInt64
    access(self) var bookings: {UInt64: BookingInfo}
    access(self) var vaults: {UInt64: @FungibleToken.Vault}

    access(self) var treasury: Address
    access(self) var feeBps: UFix64

    pub event FundsLocked(bookingId: UInt64, stationId: UInt64, driver: Address, owner: Address, amount: UFix64)
    pub event SessionCompleted(bookingId: UInt64, stationId: UInt64, driver: Address, owner: Address, payout: UFix64, fee: UFix64)
    pub event Refunded(bookingId: UInt64, to: Address, amount: UFix64)

    pub resource Admin {
        pub fun setTreasury(addr: Address) {
            BookingEscrow.treasury = addr
        }
        pub fun setFeeBps(bps: UFix64) {
            BookingEscrow.feeBps = bps
        }
    }

    pub fun borrowAdmin(): &Admin { return &self.account.storage.borrow<&Admin>(from: /storage/BookingEscrowAdmin)!
    }

    pub resource interface IEscrowPublic {
        pub fun getBooking(id: UInt64): BookingInfo?
    }

    pub fun getBooking(id: UInt64): BookingInfo? {
        return self.bookings[id]
    }

    pub fun getFeeBps(): UFix64 { return self.feeBps }
    pub fun getTreasury(): Address { return self.treasury }

    pub fun lockFunds(stationId: UInt64, <- vault: @FungibleToken.Vault): UInt64 {
        let station = StationRegistry.getStation(id: stationId)
            ?? panic("Station not found")
        if !station.available { panic("Station not available") }

        let id = self.nextBookingId
        self.nextBookingId = self.nextBookingId + 1 as UInt64

        let amount = vault.balance
        let driver = self.account.address
        let info = BookingInfo(
            id: id,
            stationId: stationId,
            driver: driver,
            owner: station.owner,
            amount: amount
        )

        self.vaults[id] <- vault
        self.bookings[id] = info
        emit FundsLocked(bookingId: id, stationId: stationId, driver: driver, owner: station.owner, amount: amount)
        return id
    }

    pub fun completeSession(bookingId: UInt64, ownerReceiver: &{FungibleToken.Receiver}) {
        let booking = self.bookings[bookingId] ?? panic("Booking not found")
        if booking.completed { panic("Already completed") }
        if booking.owner != self.account.address {
            panic("Only station owner may complete session")
        }

        let held <- self.vaults.remove(key: bookingId) ?? panic("Escrow vault missing")
        let fee = held.balance * self.feeBps / 10000.0
        let payout = held.balance - fee

        let feeVault <- held.withdraw(amount: fee)
        let payoutVault <- held.withdraw(amount: payout)

        ownerReceiver.deposit(from: <- payoutVault)

        let treasuryReceiver = getAccount(self.treasury)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Treasury receiver not set/capability missing")
        treasuryReceiver.deposit(from: <- feeVault)

        destroy held

        booking.completed = true
        self.bookings[bookingId] = booking

        emit SessionCompleted(bookingId: bookingId, stationId: booking.stationId, driver: booking.driver, owner: booking.owner, payout: payout, fee: fee)
    }

    pub fun refundDriver(bookingId: UInt64, driverReceiver: &{FungibleToken.Receiver}) {
        let booking = self.bookings[bookingId] ?? panic("Booking not found")
        if booking.completed { panic("Already completed") }
        if booking.owner != self.account.address {
            panic("Only owner can refund")
        }
        let vault <- self.vaults.remove(key: bookingId) ?? panic("No funds held")
        let amount = vault.balance
        driverReceiver.deposit(from: <- vault)
        self.bookings.remove(key: bookingId)
        emit Refunded(bookingId: bookingId, to: booking.driver, amount: amount)
    }

    pub fun submitDriverRating(bookingId: UInt64, rating: UInt8) {
        let booking = self.bookings[bookingId] ?? panic("Booking not found")
        if !booking.completed { panic("Not completed") }
        if booking.driver != self.account.address { panic("Only driver") }
        if booking.driverRated { panic("Already rated") }
        ReputationNFT.mintRatingToken(
            to: booking.owner,
            rater: booking.driver,
            rating: rating,
            role: "owner",
            stationId: booking.stationId,
            bookingId: bookingId
        )
        booking.driverRated = true
        self.bookings[bookingId] = booking
    }

    pub fun submitOwnerRating(bookingId: UInt64, rating: UInt8) {
        let booking = self.bookings[bookingId] ?? panic("Booking not found")
        if !booking.completed { panic("Not completed") }
        if booking.owner != self.account.address { panic("Only owner") }
        if booking.ownerRated { panic("Already rated") }
        ReputationNFT.mintRatingToken(
            to: booking.driver,
            rater: booking.owner,
            rating: rating,
            role: "driver",
            stationId: booking.stationId,
            bookingId: bookingId
        )
        booking.ownerRated = true
        self.bookings[bookingId] = booking
    }

    init() {
        self.nextBookingId = 1
        self.bookings = {}
        self.vaults <- {}
        self.treasury = self.account.address
        self.feeBps = 100.0 // 1%

        self.account.storage.save(<- create Admin(), to: /storage/BookingEscrowAdmin)
    }

    destroy() {
        destroy self.vaults
    }
}


