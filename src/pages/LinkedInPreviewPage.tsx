import { FC, useCallback } from "react";
import { AppContextComponent } from "../context/AppContext";
import { useParams, useSearchParams } from "react-router-dom";
import { useCustomRefresh, SmartLinkContextComponent } from "../context/SmartLinkContext";
import { IRefreshMessageData, IRefreshMessageMetadata } from "@kontent-ai/smart-link";
import LinkedInPreview from "../components/previews/LinkedInPreview";
import { useBanner } from "../hooks/useBanner";


const LinkedInPreviewPageContent: FC = () => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const { slug } = useParams();
  const lang = searchParams.get("lang");

  const { banner, isLoading, error } = useBanner(isPreview, lang, slug ?? null);

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        originalRefresh();
      }
    },
    [],
  );

  useCustomRefresh(onRefresh);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading banner content...</div>
        </div>
      </div>
    );
  }

  if (error || !banner || !Object.entries(banner.elements).length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">{error || 'No banner content found'}</div>
          <div className="text-sm text-gray-500 mt-2">Check your slug parameter</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-center min-h-screen">
        <LinkedInPreview
          title={banner.elements.headline?.value ?? ""}
          description={banner.elements.subheadline?.value ?? ""}
          imageSrc={banner.elements.image?.value?.[0]?.url}
          imageAlt={banner.elements.image?.value?.[0]?.description ?? "Banner image"}
          componentId={banner.system.id}
        />
      </div>
    </div>
  );
};

const LinkedInPreviewPage: FC = () => (
  <AppContextComponent>
    <SmartLinkContextComponent>
      <LinkedInPreviewPageContent />
    </SmartLinkContextComponent>
  </AppContextComponent>
);

export default LinkedInPreviewPage;
