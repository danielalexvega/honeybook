import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import KontentSmartLink, {
  IRefreshMessageData,
  IRefreshMessageMetadata,
  IUpdateMessageData,
  KontentSmartLinkEvent,
} from "@kontent-ai/smart-link";
import { useAppContext } from "./AppContext";

interface SmartLinkContextValue {
  readonly smartLink?: KontentSmartLink | null;
}

const defaultContextValue: SmartLinkContextValue = {
  smartLink: undefined,
};

const SmartLinkContext = createContext<SmartLinkContextValue>(defaultContextValue);

export const SmartLinkContextComponent: FC<PropsWithChildren> = ({ children }) => {
  const { environmentId } = useAppContext();
  const [smartLink, setSmartLink] = useState<KontentSmartLink | null>(null);

  // Add global error handler for MutationObserver errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('MutationObserver') && event.message?.includes('parameter 1 is not of type')) {
        console.warn('Caught MutationObserver error, this is likely from Smart Link SDK:', event.message);
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    // Only initialize if we have an environment ID
    if (!environmentId) {
      console.warn('Smart Link: No environment ID provided');
      return;
    }

    // Get current language from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const currentLang = urlParams.get("lang") || "default";
    const isPreview = urlParams.get("preview") === "true";

    // Only initialize Smart Link in preview mode
    if (!isPreview) {
      console.log('Not in preview mode, skipping Smart Link initialization');
      setSmartLink(null);
      return;
    }

    // Add a small delay to ensure DOM is fully ready
    const timeoutId = setTimeout(() => {
      let instance: KontentSmartLink | null = null;

      try {
        // Ensure we have a valid root element
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          console.warn('Root element not found, skipping Smart Link initialization');
          setSmartLink(null);
          return;
        }

        console.log('Initializing Smart Link for preview mode');
        instance = KontentSmartLink.initialize({
          defaultDataAttributes: {
            projectId: environmentId,
            languageCodename: currentLang,
          },
        });

        setSmartLink(instance);
      } catch (error) {
        console.error('Failed to initialize Smart Link:', error);
        setSmartLink(null);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      try {
        if (smartLink) {
          smartLink.destroy();
        }
      } catch (error) {
        console.error('Error destroying Smart Link:', error);
      }
      setSmartLink(null);
    };
  }, [environmentId]);

  const value = useMemo(() => ({ smartLink }), [smartLink]);

  return <SmartLinkContext.Provider value={value}>{children}</SmartLinkContext.Provider>;
};

export const useSmartLink = (): KontentSmartLink | null => {
  const { smartLink } = useContext(SmartLinkContext);

  if (typeof smartLink === "undefined") {
    throw new Error("You need to place SmartLinkProvider to one of the parent components to use useSmartLink.");
  }

  return smartLink;
};

export const useCustomRefresh = (
  callback: (data: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => void,
): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Refresh, callback);

      return () => {
        smartLink.off(KontentSmartLinkEvent.Refresh, callback);
      };
    }

    return;
  }, [smartLink, callback]);
};

export const useLivePreview = (callback: (data: IUpdateMessageData) => void): void => {
  const smartLink = useSmartLink();

  useEffect(() => {
    if (smartLink) {
      smartLink.on(KontentSmartLinkEvent.Update, callback);

      return () => {
        smartLink.off(KontentSmartLinkEvent.Update, callback);
      };
    }

    return;
  }, [smartLink, callback]);
};
