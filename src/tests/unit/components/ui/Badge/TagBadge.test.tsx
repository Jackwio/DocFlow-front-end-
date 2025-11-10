/**
 * Unit tests for TagBadge component
 * Tests tag name rendering, source indicator, and color consistency
 * Task T081: [US2] Unit test for TagBadge component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagBadge } from '@/components/ui/Badge/TagBadge';
import { TagSource } from '@/types';
import { stringToColor } from '@/utils/formatting';

describe('TagBadge', () => {
  const mockTag = {
    id: '1',
    name: 'Invoice',
    source: TagSource.Automatic,
    confidence: 0.95,
  };

  const manualTag = {
    id: '2',
    name: 'Urgent',
    source: TagSource.Manual,
  };

  describe('Rendering', () => {
    it('should render tag name', () => {
      render(<TagBadge tag={mockTag} />);
      expect(screen.getByText('Invoice')).toBeInTheDocument();
    });

    it('should render with correct role', () => {
      render(<TagBadge tag={mockTag} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label describing tag and source', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Tag: Invoice (Automatic)');
    });

    it('should apply different sizes correctly', () => {
      const { rerender } = render(<TagBadge tag={mockTag} size="sm" />);
      let badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-xs', 'px-2', 'py-0.5');

      rerender(<TagBadge tag={mockTag} size="md" />);
      badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-sm', 'px-2.5', 'py-1');

      rerender(<TagBadge tag={mockTag} size="lg" />);
      badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-base', 'px-3', 'py-1.5');
    });

    it('should apply custom className', () => {
      render(<TagBadge tag={mockTag} className="custom-class" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Source Indicator (FR-021, FR-024)', () => {
    it('should show manual indicator (✏️) for manual tags', () => {
      render(<TagBadge tag={manualTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('✏️');
    });

    it('should NOT show manual indicator for automatic tags', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).not.toHaveTextContent('✏️');
    });

    it('should have aria-label indicating manual source', () => {
      render(<TagBadge tag={manualTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Tag: Urgent (Manual)');
    });

    it('should mark manual icon as decorative', () => {
      render(<TagBadge tag={manualTag} />);
      const icon = screen.getByText('✏️');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Color Consistency (FR-024)', () => {
    it('should apply consistent color based on tag name', () => {
      const { rerender } = render(<TagBadge tag={mockTag} />);
      const badge1 = screen.getByRole('status');
      const color1 = stringToColor(mockTag.name);
      expect(badge1).toHaveStyle({ backgroundColor: color1 });

      // Re-render with same tag name - should have same color
      rerender(<TagBadge tag={{ ...mockTag, id: '999' }} />);
      const badge2 = screen.getByRole('status');
      expect(badge2).toHaveStyle({ backgroundColor: color1 });
    });

    it('should have white text color for contrast', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveStyle({ color: '#fff' });
    });

    it('should generate different colors for different tag names', () => {
      const { rerender } = render(<TagBadge tag={mockTag} />);
      const badge1 = screen.getByRole('status');
      const color1 = window.getComputedStyle(badge1).backgroundColor;

      const differentTag = { ...mockTag, name: 'Contract' };
      rerender(<TagBadge tag={differentTag} />);
      const badge2 = screen.getByRole('status');
      const color2 = window.getComputedStyle(badge2).backgroundColor;

      // Different tag names should have different colors
      expect(color1).not.toBe(color2);
    });

    it('should maintain color consistency across multiple renders of same tag', () => {
      const { unmount } = render(<TagBadge tag={mockTag} />);
      const badge1 = screen.getByRole('status');
      const color1 = stringToColor(mockTag.name);
      expect(badge1).toHaveStyle({ backgroundColor: color1 });
      unmount();

      // Render again
      render(<TagBadge tag={mockTag} />);
      const badge2 = screen.getByRole('status');
      expect(badge2).toHaveStyle({ backgroundColor: color1 });
    });
  });

  describe('Remove Action', () => {
    it('should render remove button when onRemove is provided', () => {
      const onRemove = vi.fn();
      render(<TagBadge tag={mockTag} onRemove={onRemove} />);
      expect(screen.getByRole('button', { name: /remove tag/i })).toBeInTheDocument();
    });

    it('should NOT render remove button when onRemove is not provided', () => {
      render(<TagBadge tag={mockTag} />);
      expect(screen.queryByRole('button', { name: /remove tag/i })).not.toBeInTheDocument();
    });

    it('should call onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const onRemove = vi.fn();
      render(<TagBadge tag={mockTag} onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button', { name: /remove tag/i });
      await user.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should have accessible label for remove button', () => {
      const onRemove = vi.fn();
      render(<TagBadge tag={mockTag} onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button');
      expect(removeButton).toHaveAttribute('aria-label', 'Remove tag Invoice');
    });
  });

  describe('Animations', () => {
    it('should have smooth transition animation', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('transition-all', 'duration-150');
    });
  });

  describe('Accessibility', () => {
    it('should have rounded pill shape', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have proper font styling', () => {
      render(<TagBadge tag={mockTag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('font-medium');
    });

    it('should have focus ring on remove button', () => {
      const onRemove = vi.fn();
      render(<TagBadge tag={mockTag} onRemove={onRemove} />);
      const removeButton = screen.getByRole('button');
      expect(removeButton).toHaveClass('focus:ring-1', 'focus:ring-white');
    });
  });
});
