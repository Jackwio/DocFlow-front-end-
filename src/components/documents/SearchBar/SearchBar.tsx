/**
 * SearchBar component for instant document filtering
 * Provides search input with debounced filtering as user types
 */

import { useCallback } from 'react';
import { SearchInput } from '@/components/ui/Input';

export interface SearchBarProps {
  /**
   * Current search query value
   */
  value?: string;
  /**
   * Callback when search query changes (after debounce)
   */
  onSearch: (query: string) => void;
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export const SearchBar = ({
  value = '',
  onSearch,
  placeholder = 'Search documents...',
  debounceMs = 300,
  className,
}: SearchBarProps) => {
  const handleSearchChange = useCallback(
    (searchValue: string) => {
      onSearch(searchValue);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    onSearch('');
  }, [onSearch]);

  return (
    <div className={className}>
      <SearchInput
        defaultValue={value}
        onChange={handleSearchChange}
        onClear={handleClear}
        placeholder={placeholder}
        debounceMs={debounceMs}
        aria-label="Search documents"
      />
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
