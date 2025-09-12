import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract ReputationNFT: NonFungibleToken {

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub struct Metadata {
        pub let rating: UInt8
        pub let counterparty: Address
        pub let role: String
        pub let stationId: UInt64
        pub let bookingId: UInt64
        pub let timestamp: UFix64
        init(rating: UInt8, counterparty: Address, role: String, stationId: UInt64, bookingId: UInt64, timestamp: UFix64) {
            self.rating = rating
            self.counterparty = counterparty
            self.role = role
            self.stationId = stationId
            self.bookingId = bookingId
            self.timestamp = timestamp
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let metadata: Metadata
        init(initID: UInt64, metadata: Metadata) {
            self.id = initID
            self.metadata = metadata
        }
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT { panic("Soulbound: non-transferable") }
        pub fun deposit(token: @NonFungibleToken.NFT) { destroy token }
    }

    pub resource interface ICollectionPublic {
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NFT
    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, ICollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT { panic("Soulbound: non-transferable") }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            destroy token
        }

        pub fun getIDs(): [UInt64] { return self.ownedNFTs.keys }
        pub fun borrowNFT(id: UInt64): &NFT { return (&self.ownedNFTs[id] as &NonFungibleToken.NFT as! &NFT) }
    }

    access(self) var totalSupply: UInt64

    pub resource Minter {
        pub fun mint(to: &{NonFungibleToken.CollectionPublic}, metadata: Metadata): UInt64 {
            self.account
            ReputationNFT.totalSupply = ReputationNFT.totalSupply + 1 as UInt64
            let newId = ReputationNFT.totalSupply
            let nft <- create NFT(initID: newId, metadata: metadata)
            // Since SBT, do not actually store; use event-only or mirror minimal store
            // For hackathon simplicity, we destroy the resource after emitting event and rely on metadata in events
            destroy nft
            emit Minted(id: newId, to: to.owner?.address ?? 0x0, rating: metadata.rating, counterparty: metadata.counterparty, role: metadata.role, stationId: metadata.stationId, bookingId: metadata.bookingId)
            return newId
        }
    }

    pub event Minted(id: UInt64, to: Address, rating: UInt8, counterparty: Address, role: String, stationId: UInt64, bookingId: UInt64)

    pub fun createEmptyCollection(): @Collection { return <- create Collection() }

    pub fun mintRatingToken(to: Address, rater: Address, rating: UInt8, role: String, stationId: UInt64, bookingId: UInt64) {
        pre { rating >= 1 && rating <= 5: "Invalid rating" }
        let acct = getAccount(to)
        let colRef = acct.getCapability(self.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Recipient collection not set up")
        let metadata = Metadata(rating: rating, counterparty: rater, role: role, stationId: stationId, bookingId: bookingId, timestamp: getCurrentBlock().timestamp)
        let minter = self.account.storage.borrow<&Minter>(from: self.MinterStoragePath) ?? panic("Minter missing")
        let _ = minter.mint(to: colRef, metadata: metadata)
    }

    init() {
        self.totalSupply = 0
        self.CollectionStoragePath = /storage/ChargeShareReputationCollection
        self.CollectionPublicPath = /public/ChargeShareReputationCollection
        self.MinterStoragePath = /storage/ChargeShareReputationMinter
        self.account.storage.save(<- create Minter(), to: self.MinterStoragePath)
    }
}


