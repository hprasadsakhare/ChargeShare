"use client";
import { useState } from "react";

type SearchFilters = {
  searchTerm: string;
  chargerType: string;
  maxPrice: number;
  minRating: number;
  availability: boolean;
  sortBy: string;
};

type StationSearchProps = {
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
};

export default function StationSearch({ onFiltersChange, onSearch, initialFilters = {} }: StationSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    chargerType: "all",
    maxPrice: 1.0,
    minRating: 0,
    availability: true,
    sortBy: "price",
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      searchTerm: "",
      chargerType: "all",
      maxPrice: 1.0,
      minRating: 0,
      availability: true,
      sortBy: "price"
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Stations
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location, station ID, or charger type..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Charger Type
            </label>
            <select
              value={filters.chargerType}
              onChange={(e) => handleFilterChange('chargerType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="AC">AC</option>
              <option value="DC">DC</option>
              <option value="Type2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            Advanced Filters
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 text-white rounded-lg hover:from-emerald-700 hover:to-indigo-700 transition-all duration-200 font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹/kWh)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={0}>Any Rating</option>
                <option value={1}>1+ Stars</option>
                <option value={2}>2+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={5}>5 Stars Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="distance">Distance (Nearest First)</option>
                <option value="type">Charger Type</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                Available Only
              </label>
            </div>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Quick filters:</span>
          {[
            { label: "Under ₹0.5/kWh", filters: { maxPrice: 0.5 } },
            { label: "DC Fast Charging", filters: { chargerType: "DC" } },
            { label: "4+ Star Rating", filters: { minRating: 4 } },
            { label: "AC Charging", filters: { chargerType: "AC" } }
          ].map((chip, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                const newFilters = { ...filters, ...chip.filters };
                setFilters(newFilters);
                onFiltersChange(newFilters);
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
