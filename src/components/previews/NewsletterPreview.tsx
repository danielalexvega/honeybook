import React from "react";
import { createItemSmartLink, createElementSmartLink } from "../../utils/smartlink";

type NewsletterPreviewProps = Readonly<{
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageSrc?: string;
  imageAlt: string;
  componentId: string;
}>;

const NewsletterPreview: React.FC<NewsletterPreviewProps> = React.memo(({
  title,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  componentId,
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Email Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">KH</span>
            </div>
            <div>
              <div className="text-white font-semibold">Karma Health Newsletter</div>
              <div className="text-blue-100 text-sm">Your Weekly Health Insights</div>
            </div>
          </div>
          <div className="text-blue-100 text-sm">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Email Subject Line */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-1">Subject:</div>
        <div className="font-medium text-gray-900">{title}</div>
      </div>

      {/* Newsletter Content */}
      <div 
        className="p-6"
        {...createItemSmartLink(componentId)}
      >
        {/* Newsletter Hero Section */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold text-gray-900 mb-4 leading-tight"
            {...createElementSmartLink("headline")}
          >
            {title}
          </h1>
          
          {imageSrc && (
            <div className="mb-6">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-48 object-cover rounded-lg mx-auto"
                {...createElementSmartLink("image")}
              />
            </div>
          )}
          
          <p 
            className="text-gray-700 text-base leading-relaxed max-w-lg mx-auto"
            {...createElementSmartLink("subheadline")}
          >
            {description}
          </p>
        </div>

        {/* Newsletter CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Ready to take action?
          </h3>
          <p className="text-gray-600 mb-4">
            Don't miss out on this opportunity to improve your health journey.
          </p>
          
          {/* Email CTA Button */}
          <a
            href={buttonHref}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md"
            {...createElementSmartLink("button_link")}
            aria-label={`${buttonText} - Call to action button`}
          >
            <span {...createElementSmartLink("button_label")}>{buttonText}</span>
          </a>
        </div>

        {/* Newsletter Footer Content */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">This Week's Health Tips</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stay hydrated with 8 glasses of water daily</li>
                <li>• Take a 10-minute walk after meals</li>
                <li>• Practice deep breathing for stress relief</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm" aria-label="Visit our website">Website</a>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm" aria-label="Follow us on LinkedIn">LinkedIn</a>
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm" aria-label="Follow us on Twitter">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Footer */}
      <div className="bg-gray-100 px-6 py-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            Karma Health | Improving lives through innovative healthcare solutions
          </div>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700" aria-label="Unsubscribe from newsletter">Unsubscribe</a>
            <span aria-hidden="true">|</span>
            <a href="#" className="hover:text-gray-700" aria-label="Read privacy policy">Privacy Policy</a>
            <span aria-hidden="true">|</span>
            <a href="#" className="hover:text-gray-700" aria-label="Contact us">Contact Us</a>
          </div>
        </div>
      </div>

      {/* Newsletter Preview Label */}
      <div className="bg-green-50 px-4 py-2 border-t border-green-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✉</span>
          </div>
          <span className="text-sm text-green-700 font-medium">Newsletter Preview</span>
        </div>
      </div>
    </div>
  );
});

export default NewsletterPreview;
