/**
 * Hook for managing document selection state
 * Supports single, multiple, and select-all operations
 */

import { useState, useCallback } from 'react';

export interface UseDocumentSelectionReturn {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  selectedCount: number;
}

export function useDocumentSelection(): UseDocumentSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedCount = selectedIds.size;

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    selectedCount,
  };
}
