import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { IssueType, Status, Severity } from '../../types';
import { ISSUE_TYPES, STATUSES, SEVERITIES } from '../../data/constants';

// Parse URL params to filter arrays
function parseArrayParam(param: string | null): string[] {
  return param ? param.split(',').filter(Boolean) : [];
}

// Convert filter arrays to URL params
function buildURLParams(filters: {
  searchText: string;
  types: IssueType[];
  statuses: Status[];
  severities: Severity[];
}): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.searchText.trim()) {
    params.set('search', filters.searchText.trim());
  }
  if (filters.types.length > 0) {
    params.set('types', filters.types.join(','));
  }
  if (filters.statuses.length > 0) {
    params.set('statuses', filters.statuses.join(','));
  }
  if (filters.severities.length > 0) {
    params.set('severities', filters.severities.join(','));
  }

  return params;
}

interface MultiSelectDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

function MultiSelectDropdown({ label, options, selectedValues, onToggle }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selectedValues.length;
  const displayLabel = selectedCount > 0 ? `${label} (${selectedCount})` : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50 transition-colors ${
          selectedCount > 0 ? 'border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'
        }`}
      >
        {displayLabel}
        <span className="ml-1">▾</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[180px]">
          <div className="py-1 max-h-64 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => onToggle(option.value)}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current filters from URL
  const searchText = searchParams.get('search') || '';
  const selectedTypes = parseArrayParam(searchParams.get('types')) as IssueType[];
  const selectedStatuses = parseArrayParam(searchParams.get('statuses')) as Status[];
  const selectedSeverities = parseArrayParam(searchParams.get('severities')) as Severity[];

  const hasActiveFilters =
    searchText.trim().length > 0 ||
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedSeverities.length > 0;

  // Update search text
  const handleSearchChange = (value: string) => {
    const newParams = buildURLParams({
      searchText: value,
      types: selectedTypes,
      statuses: selectedStatuses,
      severities: selectedSeverities,
    });
    setSearchParams(newParams);
  };

  // Toggle type filter
  const handleToggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type as IssueType)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type as IssueType];

    const newParams = buildURLParams({
      searchText,
      types: newTypes,
      statuses: selectedStatuses,
      severities: selectedSeverities,
    });
    setSearchParams(newParams);
  };

  // Toggle status filter
  const handleToggleStatus = (status: string) => {
    const newStatuses = selectedStatuses.includes(status as Status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status as Status];

    const newParams = buildURLParams({
      searchText,
      types: selectedTypes,
      statuses: newStatuses,
      severities: selectedSeverities,
    });
    setSearchParams(newParams);
  };

  // Toggle severity filter
  const handleToggleSeverity = (severity: string) => {
    const newSeverities = selectedSeverities.includes(severity as Severity)
      ? selectedSeverities.filter((s) => s !== severity)
      : [...selectedSeverities, severity as Severity];

    const newParams = buildURLParams({
      searchText,
      types: selectedTypes,
      statuses: selectedStatuses,
      severities: newSeverities,
    });
    setSearchParams(newParams);
  };

  // Clear all filters
  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by ID or description..."
          value={searchText}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Type filter */}
        <MultiSelectDropdown
          label="Type"
          options={ISSUE_TYPES}
          selectedValues={selectedTypes}
          onToggle={handleToggleType}
        />

        {/* Status filter */}
        <MultiSelectDropdown
          label="Status"
          options={STATUSES}
          selectedValues={selectedStatuses}
          onToggle={handleToggleStatus}
        />

        {/* Severity filter */}
        <MultiSelectDropdown
          label="Severity"
          options={SEVERITIES}
          selectedValues={selectedSeverities}
          onToggle={handleToggleSeverity}
        />

        {/* Clear all button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
