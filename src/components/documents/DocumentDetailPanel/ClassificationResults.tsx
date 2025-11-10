/**
 * ClassificationResults component
 * Displays classification results with confidence bars (FR-019)
 */

import { ClassificationResultDto } from '@/types';
import { formatDate } from '@/utils/formatting';
import clsx from 'clsx';

export interface ClassificationResultsProps {
  results: ClassificationResultDto[];
}

/**
 * Get color class based on confidence score
 */
function getConfidenceColor(score: number): string {
  if (score >= 0.9) return 'bg-green-500';
  if (score >= 0.7) return 'bg-blue-500';
  if (score >= 0.5) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * Get text color class based on confidence score
 */
function getConfidenceTextColor(score: number): string {
  if (score >= 0.9) return 'text-green-700';
  if (score >= 0.7) return 'text-blue-700';
  if (score >= 0.5) return 'text-yellow-700';
  return 'text-red-700';
}

export function ClassificationResults({ results }: ClassificationResultsProps) {
  if (!results || results.length === 0) {
    return (
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Classification Results
        </h3>
        <p className="text-sm text-gray-500 italic">
          No classification results available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Classification Results
      </h3>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={`${result.ruleId}-${index}`}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            {/* Rule Info */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {result.ruleName}
                </h4>
                <p className="text-xs text-gray-500">
                  Rule ID: <span className="font-mono">{result.ruleId}</span>
                </p>
              </div>
              <span className="ml-3 px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-700 border border-gray-200">
                {result.tagName}
              </span>
            </div>

            {/* Confidence Score with Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">
                  Confidence Score
                </span>
                <span className={clsx(
                  'text-sm font-bold',
                  getConfidenceTextColor(result.confidenceScore)
                )}>
                  {(result.confidenceScore * 100).toFixed(1)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={clsx(
                    'h-2.5 rounded-full transition-all duration-500 ease-out',
                    getConfidenceColor(result.confidenceScore)
                  )}
                  style={{ width: `${result.confidenceScore * 100}%` }}
                  role="progressbar"
                  aria-valuenow={result.confidenceScore * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Confidence: ${(result.confidenceScore * 100).toFixed(1)}%`}
                />
              </div>
            </div>

            {/* Applied Time */}
            <div className="flex items-center text-xs text-gray-500">
              <svg 
                className="w-3.5 h-3.5 mr-1.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Applied {formatDate(result.appliedAt)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
