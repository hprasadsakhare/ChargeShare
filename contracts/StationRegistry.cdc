pub contract StationRegistry {

    pub struct Station {
        pub let id: UInt64
        pub let owner: Address
        pub var location: String
        pub var chargerType: String
        pub var costPerKWh: UFix64
        pub var available: Bool

        init(
            id: UInt64,
            owner: Address,
            location: String,
            chargerType: String,
            costPerKWh: UFix64,
            available: Bool
        ) {
            self.id = id
            self.owner = owner
            self.location = location
            self.chargerType = chargerType
            self.costPerKWh = costPerKWh
            self.available = available
        }
    }

    access(self) var nextStationId: UInt64
    access(self) var stations: {UInt64: Station}

    pub event StationRegistered(id: UInt64, owner: Address, location: String, chargerType: String, costPerKWh: UFix64, available: Bool)
    pub event StationUpdated(id: UInt64, owner: Address, costPerKWh: UFix64, available: Bool)

    pub fun getStation(id: UInt64): Station? {
        return self.stations[id]
    }

    pub fun getAllStations(): [Station] {
        let result: [Station] = []
        for key in self.stations.keys {
            let s = self.stations[key]!
            result.append(s)
        }
        return result
    }

    pub fun getOwnerStations(owner: Address): [Station] {
        let result: [Station] = []
        for key in self.stations.keys {
            let s = self.stations[key]!
            if s.owner == owner {
                result.append(s)
            }
        }
        return result
    }

    pub fun registerStation(
        location: String,
        chargerType: String,
        costPerKWh: UFix64,
        available: Bool
    ): UInt64 {
        let id = self.nextStationId
        self.nextStationId = self.nextStationId + 1 as UInt64
        let station = Station(
            id: id,
            owner: self.account.address,
            location: location,
            chargerType: chargerType,
            costPerKWh: costPerKWh,
            available: available
        )
        self.stations[id] = station
        emit StationRegistered(id: id, owner: station.owner, location: location, chargerType: chargerType, costPerKWh: costPerKWh, available: available)
        return id
    }

    pub fun updateAvailability(id: UInt64, available: Bool) {
        let st = self.stations[id]
            ?? panic("Station not found")
        if st.owner != self.account.address {
            panic("Only owner can update station")
        }
        st.available = available
        self.stations[id] = st
        emit StationUpdated(id: id, owner: st.owner, costPerKWh: st.costPerKWh, available: available)
    }

    pub fun updatePrice(id: UInt64, newCostPerKWh: UFix64) {
        let st = self.stations[id]
            ?? panic("Station not found")
        if st.owner != self.account.address {
            panic("Only owner can update station")
        }
        st.costPerKWh = newCostPerKWh
        self.stations[id] = st
        emit StationUpdated(id: id, owner: st.owner, costPerKWh: newCostPerKWh, available: st.available)
    }

    init() {
        self.nextStationId = 1
        self.stations = {}
    }
}


