/**
 * MetadataSection component
 * Displays document metadata (fileName, fileSize, dates, description)
 */

import { DocumentDto } from '@/types';
import { formatFileSize, formatDate } from '@/utils/formatting';

export interface MetadataSectionProps {
  document: DocumentDto;
}

export function MetadataSection({ document }: MetadataSectionProps) {
  return (
    <section className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Document Information
      </h3>
      
      <div className="space-y-3 text-sm">
        {/* File Name */}
        <div className="flex justify-between items-start">
          <span className="text-gray-500 font-medium min-w-[100px]">File Name:</span>
          <span className="text-gray-900 font-medium flex-1 text-right break-all">
            {document.fileName}
          </span>
        </div>

        {/* File Size */}
        <div className="flex justify-between items-start">
          <span className="text-gray-500 font-medium min-w-[100px]">File Size:</span>
          <span className="text-gray-900 flex-1 text-right">
            {formatFileSize(document.fileSize)}
          </span>
        </div>

        {/* MIME Type */}
        <div className="flex justify-between items-start">
          <span className="text-gray-500 font-medium min-w-[100px]">Type:</span>
          <span className="text-gray-900 flex-1 text-right font-mono text-xs">
            {document.mimeType}
          </span>
        </div>

        {/* Uploaded At */}
        <div className="flex justify-between items-start">
          <span className="text-gray-500 font-medium min-w-[100px]">Uploaded:</span>
          <span className="text-gray-900 flex-1 text-right">
            {formatDate(document.uploadedAt)}
          </span>
        </div>

        {/* Classified At */}
        {document.classifiedAt && (
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium min-w-[100px]">Classified:</span>
            <span className="text-gray-900 flex-1 text-right">
              {formatDate(document.classifiedAt)}
            </span>
          </div>
        )}

        {/* Description */}
        {document.description && (
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
            <span className="text-gray-500 font-medium">Description:</span>
            <p className="text-gray-900 leading-relaxed">
              {document.description}
            </p>
          </div>
        )}

        {/* Blob URI (for download/preview) */}
        {document.blobUri && (
          <div className="flex justify-between items-start pt-2 border-t border-gray-100">
            <span className="text-gray-500 font-medium min-w-[100px]">Storage:</span>
            <a
              href={document.blobUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex-1 text-right text-xs underline truncate"
              title={document.blobUri}
            >
              View in storage
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
