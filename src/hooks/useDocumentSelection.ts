/**
 * useDocumentSelection hook
 * Manages selection state for batch operations on documents
 */

import { useState, useCallback } from 'react';

export interface UseDocumentSelectionReturn {
  /**
   * Set of selected document IDs
   */
  selectedIds: Set<string>;
  
  /**
   * Check if a document is selected
   */
  isSelected: (id: string) => boolean;
  
  /**
   * Toggle selection of a single document
   */
  toggleSelection: (id: string) => void;
  
  /**
   * Select a single document
   */
  select: (id: string) => void;
  
  /**
   * Deselect a single document
   */
  deselect: (id: string) => void;
  
  /**
   * Select all documents from a list of IDs
   */
  selectAll: (ids: string[]) => void;
  
  /**
   * Clear all selections
   */
  clearSelection: () => void;
  
  /**
   * Get count of selected documents
   */
  selectedCount: number;
  
  /**
   * Check if all documents in the given list are selected
   */
  isAllSelected: (ids: string[]) => boolean;
  
  /**
   * Check if some (but not all) documents are selected
   */
  isSomeSelected: (ids: string[]) => boolean;
}

export function useDocumentSelection(): UseDocumentSelectionReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const select = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const deselect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isAllSelected = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return false;
      return ids.every((id) => selectedIds.has(id));
    },
    [selectedIds]
  );

  const isSomeSelected = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return false;
      const someSelected = ids.some((id) => selectedIds.has(id));
      const allSelected = ids.every((id) => selectedIds.has(id));
      return someSelected && !allSelected;
    },
    [selectedIds]
  );

  return {
    selectedIds,
    isSelected,
    toggleSelection,
    select,
    deselect,
    selectAll,
    clearSelection,
    selectedCount: selectedIds.size,
    isAllSelected,
    isSomeSelected,
  };
}
