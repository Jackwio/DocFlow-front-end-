/**
 * TagBadge component tests
 * Testing tag rendering, colors, source indicators, and remove functionality
 */

import { describe, expect, it, vi } from 'vitest';

import { TagBadge } from '@/components/ui/Badge/TagBadge';
import { createMockTag } from '@/tests/utils/factories';
import { render, screen } from '@/tests/utils/render';
import { TagSource } from '@/types';

describe('TagBadge', () => {
  describe('Rendering', () => {
    it('should render tag name', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      expect(screen.getByText('Invoice')).toBeInTheDocument();
    });

    it('should render multiple different tags', () => {
      const tag1 = createMockTag('Invoice');
      const tag2 = createMockTag('Contract');
      const { unmount } = render(<TagBadge tag={tag1} />);
      expect(screen.getByText('Invoice')).toBeInTheDocument();
      unmount();

      render(<TagBadge tag={tag2} />);
      expect(screen.getByText('Contract')).toBeInTheDocument();
    });
  });

  describe('Source Indicator (FR-021, FR-024)', () => {
    it('should show manual icon (✏️) for manual tags', () => {
      const manualTag = createMockTag('Invoice', TagSource.Manual);
      render(<TagBadge tag={manualTag} />);
      const badge = screen.getByRole('status');
      expect(badge.textContent).toContain('✏️');
    });

    it('should NOT show manual icon for automatic tags', () => {
      const autoTag = createMockTag('Invoice', TagSource.Automatic);
      render(<TagBadge tag={autoTag} />);
      const badge = screen.getByRole('status');
      expect(badge.textContent).not.toContain('✏️');
    });

    it('should have aria-label indicating manual source', () => {
      const manualTag = createMockTag('Invoice', TagSource.Manual);
      render(<TagBadge tag={manualTag} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Tag: Invoice (Manual)'
      );
    });

    it('should have aria-label indicating automatic source', () => {
      const autoTag = createMockTag('Invoice', TagSource.Automatic);
      render(<TagBadge tag={autoTag} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Tag: Invoice (Automatic)'
      );
    });
  });

  describe('Color Consistency (FR-024)', () => {
    it('should apply consistent background color for same tag name', () => {
      const tag1 = createMockTag('Invoice');
      const { unmount, container: container1 } = render(<TagBadge tag={tag1} />);
      const badge1 = container1.querySelector('[role="status"]') as HTMLElement;
      const color1 = badge1.style.backgroundColor;
      unmount();

      const tag2 = createMockTag('Invoice');
      const { container: container2 } = render(<TagBadge tag={tag2} />);
      const badge2 = container2.querySelector('[role="status"]') as HTMLElement;
      const color2 = badge2.style.backgroundColor;

      expect(color1).toBe(color2);
      expect(color1).toBeTruthy();
    });

    it('should apply different colors for different tag names', () => {
      const tag1 = createMockTag('Invoice');
      const { unmount, container: container1 } = render(<TagBadge tag={tag1} />);
      const badge1 = container1.querySelector('[role="status"]') as HTMLElement;
      const color1 = badge1.style.backgroundColor;
      unmount();

      const tag2 = createMockTag('Contract');
      const { container: container2 } = render(<TagBadge tag={tag2} />);
      const badge2 = container2.querySelector('[role="status"]') as HTMLElement;
      const color2 = badge2.style.backgroundColor;

      expect(color1).not.toBe(color2);
    });

    it('should always use white text color for readability', () => {
      const tag = createMockTag('Invoice');
      const { container } = render(<TagBadge tag={tag} />);
      const badge = container.querySelector('[role="status"]') as HTMLElement;
      expect(badge.style.color).toBe('rgb(255, 255, 255)');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} size="sm" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-xs');
    });

    it('should apply medium size styles by default', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-sm');
    });

    it('should apply large size styles', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} size="lg" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('Remove Functionality', () => {
    it('should show remove button when onRemove is provided', () => {
      const tag = createMockTag('Invoice');
      const onRemove = vi.fn();
      render(<TagBadge tag={tag} onRemove={onRemove} />);
      expect(screen.getByLabelText('Remove tag Invoice')).toBeInTheDocument();
    });

    it('should NOT show remove button when onRemove is not provided', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      expect(screen.queryByLabelText('Remove tag Invoice')).not.toBeInTheDocument();
    });

    it('should call onRemove when remove button is clicked', async () => {
      const tag = createMockTag('Invoice');
      const onRemove = vi.fn();
      const { user } = render(<TagBadge tag={tag} onRemove={onRemove} />);
      
      const removeButton = screen.getByLabelText('Remove tag Invoice');
      await user.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should not call onRemove multiple times on single click', async () => {
      const tag = createMockTag('Invoice');
      const onRemove = vi.fn();
      const { user } = render(<TagBadge tag={tag} onRemove={onRemove} />);
      
      const removeButton = screen.getByLabelText('Remove tag Invoice');
      await user.click(removeButton);
      
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('should have accessible remove button with proper label', () => {
      const tag = createMockTag('Invoice');
      const onRemove = vi.fn();
      render(<TagBadge tag={tag} onRemove={onRemove} />);
      
      const removeButton = screen.getByRole('button', { name: 'Remove tag Invoice' });
      expect(removeButton).toBeInTheDocument();
      expect(removeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Styling', () => {
    it('should have pill shape (rounded-full)', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have smooth transition', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('transition-all', 'duration-150');
    });

    it('should apply custom className', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} className="custom-class" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom-class');
    });

    it('should have base badge styles', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      const tag = createMockTag('Invoice');
      render(<TagBadge tag={tag} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should mark icon as aria-hidden', () => {
      const manualTag = createMockTag('Invoice', TagSource.Manual);
      const { container } = render(<TagBadge tag={manualTag} />);
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon?.textContent).toBe('✏️');
    });

    it('should have focus styles on remove button', () => {
      const tag = createMockTag('Invoice');
      const onRemove = vi.fn();
      render(<TagBadge tag={tag} onRemove={onRemove} />);
      const removeButton = screen.getByLabelText('Remove tag Invoice');
      expect(removeButton).toHaveClass('focus:outline-none', 'focus:ring-1');
    });
  });
});
