import React from "react";
import { createItemSmartLink, createElementSmartLink } from "../../utils/smartlink";

type LinkedInPreviewProps = Readonly<{
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt: string;
  componentId: string;

}>;

const LinkedInPreview: React.FC<LinkedInPreviewProps> = React.memo(({
  title,
  description,
  imageSrc,
  imageAlt,
  componentId,

}) => {
  // Truncate description for LinkedIn post format (around 1300 characters)
  const truncatedDescription = description.length > 200 
    ? description.substring(0, 200) + "..." 
    : description;

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* LinkedIn Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">KH</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">Karma Health</div>
            <div className="text-sm text-gray-500">Healthcare Innovation • Sponsored</div>
          </div>
        </div>
      </div>

      {/* LinkedIn Post Content */}
      <div 
        className="p-4"
        {...createItemSmartLink(componentId)}
      >
        <div className="mb-4">
          <h2 
            className="text-lg font-semibold text-gray-900 mb-2 leading-tight"
            {...createElementSmartLink("headline")}
          >
            {title}
          </h2>
          <p 
            className="text-gray-700 text-sm leading-relaxed"
            {...createElementSmartLink("subheadline")}
          >
            {truncatedDescription}
          </p>
        </div>

        {/* LinkedIn Post Image */}
        {imageSrc && (
          <div className="mb-4">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-64 object-cover rounded-md"
              {...createElementSmartLink("image")}
            />
          </div>
        )}

        {/* LinkedIn Call to Action Card */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="p-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-1">karma-health.com</div>
            <div className="font-medium text-gray-900 mb-1">{title}</div>
            <div className="text-sm text-gray-600">{truncatedDescription}</div>
          </div>
        </div>

        {/* LinkedIn Engagement Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex space-x-6">
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Like this post"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-sm">Like</span>
            </button>
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Comment on this post"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Comment</span>
            </button>
            <button 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Share this post"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
          <button 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="More options"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* LinkedIn Preview Label */}
      <div className="bg-blue-50 px-4 py-2 border-t border-blue-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">in</span>
          </div>
          <span className="text-sm text-blue-700 font-medium">LinkedIn Post Preview</span>
        </div>
      </div>
    </div>
  );
});

export default LinkedInPreview;
