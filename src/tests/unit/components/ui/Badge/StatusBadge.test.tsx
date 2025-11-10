/**
 * Unit tests for StatusBadge component
 * Tests animations (pulsing for Processing/Pending) and smooth transitions
 * Task T080: [US2] Unit test for StatusBadge animations
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { DocumentStatus } from '@/types';

describe('StatusBadge', () => {
  describe('Rendering', () => {
    it('should render status badge with correct label', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should render all status types correctly', () => {
      const statuses = [
        { status: DocumentStatus.Pending, label: 'Pending' },
        { status: DocumentStatus.Classified, label: 'Classified' },
        { status: DocumentStatus.Failed, label: 'Failed' },
        { status: DocumentStatus.Routed, label: 'Routed' },
      ];

      statuses.forEach(({ status, label }) => {
        const { unmount } = render(<StatusBadge status={status} />);
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      });
    });

    it('should render with icon by default', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('⏳');
    });

    it('should hide icon when showIcon is false', () => {
      render(<StatusBadge status={DocumentStatus.Pending} showIcon={false} />);
      const badge = screen.getByRole('status');
      expect(badge).not.toHaveTextContent('⏳');
      expect(badge).toHaveTextContent('Pending');
    });

    it('should apply different sizes correctly', () => {
      const { rerender } = render(<StatusBadge status={DocumentStatus.Pending} size="sm" />);
      let badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-xs', 'px-2', 'py-0.5');

      rerender(<StatusBadge status={DocumentStatus.Pending} size="md" />);
      badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-sm', 'px-2.5', 'py-1');

      rerender(<StatusBadge status={DocumentStatus.Pending} size="lg" />);
      badge = screen.getByRole('status');
      expect(badge).toHaveClass('text-base', 'px-3', 'py-1.5');
    });

    it('should apply custom className', () => {
      render(<StatusBadge status={DocumentStatus.Pending} className="custom-class" />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Animations', () => {
    it('should have pulsing animation for Pending status (FR-007)', () => {
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

    it('should have smooth transition animation for all status changes (FR-006)', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Color Coding', () => {
    it('should apply Pending colors (blue)', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(
        'bg-status-pending-light',
        'text-status-pending-dark',
        'border-status-pending-dark'
      );
    });

    it('should apply Classified colors (green)', () => {
      render(<StatusBadge status={DocumentStatus.Classified} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(
        'bg-status-classified-light',
        'text-status-classified-dark',
        'border-status-classified-dark'
      );
    });

    it('should apply Failed colors (red)', () => {
      render(<StatusBadge status={DocumentStatus.Failed} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(
        'bg-status-failed-light',
        'text-status-failed-dark',
        'border-status-failed-dark'
      );
    });

    it('should apply Routed colors (purple)', () => {
      render(<StatusBadge status={DocumentStatus.Routed} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass(
        'bg-status-routed-light',
        'text-status-routed-dark',
        'border-status-routed-dark'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label with status description', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: Pending');
    });

    it('should mark icon as decorative with aria-hidden', () => {
      render(<StatusBadge status={DocumentStatus.Pending} />);
      const icon = screen.getByText('⏳');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
