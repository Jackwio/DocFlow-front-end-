import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AIFeatures from './AIFeatures';

describe('AIFeatures Component', () => {
  test('renders page title', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('AI Features')).toBeInTheDocument();
  });

  test('renders AI status indicator', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('✅ AI Features Enabled')).toBeInTheDocument();
  });

  test('renders document analysis section', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('AI-Powered Document Analysis')).toBeInTheDocument();
  });

  test('renders AI suggestions with confidence scores', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('📄 Invoice_2024_Jan.pdf')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 95%')).toBeInTheDocument();
  });

  test('renders suggested tags', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    const suggestedTagsElements = screen.getAllByText('🏷️ Suggested Tags');
    expect(suggestedTagsElements.length).toBeGreaterThan(0);
  });

  test('renders AI-generated summaries', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    const summaryElements = screen.getAllByText('📝 AI-Generated Summary');
    expect(summaryElements.length).toBeGreaterThan(0);
  });

  test('renders AI capabilities section', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('🤖 AI Capabilities')).toBeInTheDocument();
    expect(screen.getByText('🏷️ Auto-Tagging')).toBeInTheDocument();
    expect(screen.getByText('📝 Summarization')).toBeInTheDocument();
  });

  test('renders AI statistics', () => {
    render(
      <BrowserRouter>
        <AIFeatures />
      </BrowserRouter>
    );
    expect(screen.getByText('Documents Analyzed')).toBeInTheDocument();
    expect(screen.getByText('Avg. Confidence')).toBeInTheDocument();
  });
});
