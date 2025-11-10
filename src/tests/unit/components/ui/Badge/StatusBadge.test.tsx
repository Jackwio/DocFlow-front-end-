/**
 * StatusBadge component tests
 * Testing rendering, animations, and accessibility
 */

import { describe, expect, it } from 'vitest';

import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { render, screen } from '@/tests/utils/render';
import { DocumentStatus } from '@/types';

describe('StatusBadge', () => {
  describe('Rendering', () => {
    it('should render Pending status with correct label', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render Classified status with correct label', () => {
      render(<StatusBadge status={DocumentStatus.Classified} />);
      expect(screen.getByText('Classified')).toBeInTheDocument();
    });

    it('should render Failed status with correct label', () => {
      render(<StatusBadge status={DocumentStatus.Failed} />);
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    it('should render Routed status with correct label', () => {
      render(<StatusBadge status={DocumentStatus.Routed} />);
      expect(screen.getByText('Routed')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should show icon by default', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge.textContent).toContain('⏳');
    });

    it('should hide icon when showIcon is false', () => {
      render(<StatusBadge status={DocumentStatus.Pending} showIcon={false} />);
      const badge = screen.getByRole('status');
      expect(badge.textContent).not.toContain('⏳');
      expect(badge.textContent).toBe('Pending');
    });

    it('should render correct icons for each status', () => {
      const { unmount: unmount1 } = render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByRole('status').textContent).toContain('⏳');
      unmount1();

      const { unmount: unmount2 } = render(<StatusBadge status={DocumentStatus.Classified} />);
      expect(screen.getByRole('status').textContent).toContain('✓');
      unmount2();

      const { unmount: unmount3 } = render(<StatusBadge status={DocumentStatus.Failed} />);
      expect(screen.getByRole('status').textContent).toContain('✗');
      unmount3();

      const { unmount: unmount4 } = render(<StatusBadge status={DocumentStatus.Routed} />);
      expect(screen.getByRole('status').textContent).toContain('→');
      unmount4();
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      render(<StatusBadge status={DocumentStatus.Pending} size="sm" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-xs');
    });

    it('should apply medium size styles by default', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-sm');
    });

    it('should apply large size styles', () => {
      render(<StatusBadge status={DocumentStatus.Pending} size="lg" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-base');
    });
  });

  describe('Animations (FR-007)', () => {
    it('should have pulsing animation for Pending status', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('animate-pulse-soft');
    });

    it('should NOT have pulsing animation for Classified status', () => {
      render(<StatusBadge status={DocumentStatus.Classified} />);
      const badge = screen.getByRole('status');
      expect(badge).not.toHaveClass('animate-pulse-soft');
    });

    it('should NOT have pulsing animation for Failed status', () => {
      render(<StatusBadge status={DocumentStatus.Failed} />);
      const badge = screen.getByRole('status');
      expect(badge).not.toHaveClass('animate-pulse-soft');
    });

    it('should NOT have pulsing animation for Routed status', () => {
      render(<StatusBadge status={DocumentStatus.Routed} />);
      const badge = screen.getByRole('status');
      expect(badge).not.toHaveClass('animate-pulse-soft');
    });

    it('should have smooth transition class (FR-006)', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Styling', () => {
    it('should apply correct color classes for Pending', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-status-pending-light');
      expect(badge).toHaveClass('text-status-pending-dark');
      expect(badge).toHaveClass('border-status-pending-dark');
    });

    it('should apply correct color classes for Classified', () => {
      render(<StatusBadge status={DocumentStatus.Classified} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-status-classified-light');
      expect(badge).toHaveClass('text-status-classified-dark');
      expect(badge).toHaveClass('border-status-classified-dark');
    });

    it('should apply correct color classes for Failed', () => {
      render(<StatusBadge status={DocumentStatus.Failed} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-status-failed-light');
      expect(badge).toHaveClass('text-status-failed-dark');
      expect(badge).toHaveClass('border-status-failed-dark');
    });

    it('should apply correct color classes for Routed', () => {
      render(<StatusBadge status={DocumentStatus.Routed} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-status-routed-light');
      expect(badge).toHaveClass('text-status-routed-dark');
      expect(badge).toHaveClass('border-status-routed-dark');
    });

    it('should apply custom className', () => {
      render(
        <StatusBadge status={DocumentStatus.Pending} className="custom-class" />
      );
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom-class');
    });

    it('should always have base badge styles', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('inline-flex', 'items-center', 'font-medium', 'rounded-full', 'border');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have descriptive aria-label for Pending', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Pending'
      );
    });

    it('should have descriptive aria-label for Classified', () => {
      render(<StatusBadge status={DocumentStatus.Classified} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Classified'
      );
    });

    it('should have descriptive aria-label for Failed', () => {
      render(<StatusBadge status={DocumentStatus.Failed} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Failed'
      );
    });

    it('should have descriptive aria-label for Routed', () => {
      render(<StatusBadge status={DocumentStatus.Routed} />);
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Routed'
      );
    });

    it('should mark icon as aria-hidden', () => {
      const { container } = render(<StatusBadge status={DocumentStatus.Pending} />);
      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
      expect(icon?.textContent).toBe('⏳');
    });
  });
});
