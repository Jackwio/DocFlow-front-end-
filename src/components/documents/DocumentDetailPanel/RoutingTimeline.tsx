/**
 * RoutingTimeline component
 * Displays routing history with visual nodes and connecting lines (FR-020)
 */

import { RoutingHistoryDto } from '@/types';
import { formatDate } from '@/utils/formatting';
import clsx from 'clsx';

export interface RoutingTimelineProps {
  history: RoutingHistoryDto[];
}

export function RoutingTimeline({ history }: RoutingTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <section className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Routing History
        </h3>
        <p className="text-sm text-gray-500 italic">
          No routing history available yet.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Routing History
      </h3>

      <div className="relative">
        {/* Timeline items */}
        {history.map((item, index) => {
          const isLast = index === history.length - 1;
          const isFirst = index === 0;

          return (
            <div key={`routing-${index}`} className="relative pb-8 last:pb-0">
              {/* Connecting line */}
              {!isLast && (
                <div 
                  className="absolute left-4 top-8 bottom-0 w-0.5 bg-blue-200"
                  aria-hidden="true"
                />
              )}

              {/* Timeline node */}
              <div className="relative flex items-start gap-4">
                {/* Node circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className={clsx(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      'border-2 bg-white',
                      isFirst 
                        ? 'border-green-500 text-green-500' 
                        : 'border-blue-500 text-blue-500'
                    )}
                  >
                    {isFirst ? (
                      // Upload icon for first item
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                      </svg>
                    ) : (
                      // Arrow icon for subsequent items
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="space-y-2">
                    {/* From Queue (if exists) */}
                    {item.fromQueueId && (
                      <div className="flex items-start text-sm">
                        <span className="text-gray-500 font-medium min-w-[60px]">From:</span>
                        <div className="flex-1">
                          <span className="text-gray-900 font-medium">
                            {item.fromQueueName || item.fromQueueId}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* To Queue */}
                    <div className="flex items-start text-sm">
                      <span className="text-gray-500 font-medium min-w-[60px]">To:</span>
                      <div className="flex-1">
                        <span className="text-gray-900 font-semibold">
                          {item.toQueueName || item.toQueueId}
                        </span>
                      </div>
                    </div>

                    {/* Routed By */}
                    <div className="flex items-start text-sm">
                      <span className="text-gray-500 font-medium min-w-[60px]">By:</span>
                      <div className="flex-1">
                        <span className="text-gray-700">
                          {item.routedBy}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
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
                      {formatDate(item.routedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* End marker */}
        {history.length > 0 && (
          <div className="relative flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-300 bg-white text-gray-400"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 pt-1">
              <span className="text-sm text-gray-500">Current status</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
