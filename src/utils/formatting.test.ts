/**
 * Tests for formatting utilities
 */

import { describe, it, expect } from 'vitest';

import { formatFileSize, formatDate, truncateText, getFileExtension, stringToColor } from './formatting';

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512.00 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('handles decimal values', () => {
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.50 MB');
  });
});

describe('formatDate', () => {
  const testDate = '2024-11-10T10:30:00Z';

  it('formats short date', () => {
    const result = formatDate(testDate, 'short');
    expect(result).toContain('Nov');
    expect(result).toContain('10');
    expect(result).toContain('2024');
  });

  it('formats long date', () => {
    const result = formatDate(testDate, 'long');
    expect(result).toContain('November');
    expect(result).toContain('10');
    expect(result).toContain('2024');
  });

  it('formats relative date', () => {
    const result = formatDate(testDate, 'relative');
    expect(result).toContain('ago');
  });
});

describe('truncateText', () => {
  it('truncates long text', () => {
    const longText = 'This is a very long text that should be truncated';
    expect(truncateText(longText, 20)).toBe('This is a very lo...');
  });

  it('does not truncate short text', () => {
    const shortText = 'Short text';
    expect(truncateText(shortText, 20)).toBe('Short text');
  });

  it('handles edge case at exact length', () => {
    const text = 'Exactly twenty chars';
    expect(truncateText(text, 20)).toBe('Exactly twenty chars');
  });
});

describe('getFileExtension', () => {
  it('extracts file extension', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf');
    expect(getFileExtension('invoice.PDF')).toBe('pdf');
    expect(getFileExtension('contract.docx')).toBe('docx');
  });

  it('handles files without extension', () => {
    expect(getFileExtension('README')).toBe('');
  });

  it('handles multiple dots', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
  });
});

describe('stringToColor', () => {
  it('generates consistent colors for same string', () => {
    const color1 = stringToColor('Invoice');
    const color2 = stringToColor('Invoice');
    expect(color1).toBe(color2);
  });

  it('generates different colors for different strings', () => {
    const color1 = stringToColor('Invoice');
    const color2 = stringToColor('Contract');
    expect(color1).not.toBe(color2);
  });

  it('returns HSL color format', () => {
    const color = stringToColor('Test');
    expect(color).toMatch(/^hsl\(\d+, 70%, 85%\)$/);
  });
});
