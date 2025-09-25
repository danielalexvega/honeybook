import { DeliveryError } from "@kontent-ai/delivery-sdk";

// import HeroImage from "../components/HeroImage";
import PageContent from "../components/PageContent";
import PageSection from "../components/PageSection";
import VideoFromCloudinary from "../components/VideoFromCloudinary";
import "../index.css";
import { LanguageCodenames, type LandingPage } from "../model";
import { createClient } from "../utils/client";
import { FC, useCallback, useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Replace } from "../utils/types";
// import FeaturedContent from "../components/landingPage/FeaturedContent";
import { useSearchParams } from "react-router-dom";
import { useCustomRefresh, useLivePreview } from "../context/SmartLinkContext";
import { IRefreshMessageData, IRefreshMessageMetadata, IUpdateMessageData, applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";

const useLandingPage = (isPreview: boolean, lang: string | null) => {
  const { environmentId, apiKey, collection } = useAppContext();
  const [landingPage, setLandingPage] = useState<Replace<LandingPage, { elements: Partial<LandingPage["elements"]> }> | null>(null);

  const handleLiveUpdate = useCallback((data: IUpdateMessageData) => {
    if (landingPage) {
      // Use applyUpdateOnItemAndLoadLinkedItems to ensure all linked content is updated
      applyUpdateOnItemAndLoadLinkedItems(
        landingPage,
        data,
        codenamesToFetch => createClient(environmentId, apiKey, isPreview)
          .items()
          .inFilter("system.codename", [...codenamesToFetch])
          .toPromise()
          .then(res => res.data.items)
      ).then((updatedItem) => {
        if (updatedItem) {
          setLandingPage(updatedItem as Replace<LandingPage, { elements: Partial<LandingPage["elements"]> }>);
        }
      });
    }
  }, [landingPage, environmentId, apiKey, isPreview]);

  useEffect(() => {
    createClient(environmentId, apiKey, isPreview)
      .items()
      .type("landing_page")
      .limitParameter(1)
      .depthParameter(3)
      .equalsFilter("system.collection", collection ?? "patient_resources")
      .languageParameter((lang ?? "default") as LanguageCodenames)
      .toPromise()
      .then(res => {
        const item = res.data.items[0] as Replace<LandingPage, { elements: Partial<LandingPage["elements"]> }> | undefined;
        if (item) {
          setLandingPage(item);
        } else {
          setLandingPage(null);
        }
      })
      .catch((err) => {
        if (err instanceof DeliveryError) {
          setLandingPage(null);
        } else {
          throw err;
        }
      });
  }, [environmentId, apiKey, isPreview, lang]);

  useLivePreview(handleLiveUpdate);

  return landingPage;
};

const LandingPage: FC = () => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const lang = searchParams.get("lang");

  const landingPage = useLandingPage(isPreview, lang);
  console.log(landingPage);

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        // The useLandingPage hook handles its own data fetching, so we don't need to refetch here
        // The live preview system will handle updates automatically
      }
    },
    [],
  );

  useCustomRefresh(onRefresh);

  if (!landingPage || !Object.entries(landingPage.elements).length) {
    return <div className="flex-grow" />;
  }

  return (
    <div className="flex-grow">
      {landingPage.elements.cloudinary_video?.linkedItems[0]?.elements.video_from_cloudinary && (
        <VideoFromCloudinary
          cloudinaryAsset={landingPage.elements.cloudinary_video.linkedItems[0]}
          componentId={landingPage.system.id}
          shouldAutoplay={true}
        />
      )}

      <PageSection color="bg-white">
        <PageContent body={landingPage.elements.body_copy!} itemId={landingPage.system.id} elementName="body_copy" />
      </PageSection>
    </div>
  );
};

export default LandingPage;
