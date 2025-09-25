export const createItemSmartLink = (itemId: string | undefined, disableHighlight = false, languageCodename?: string, projectId?: string) => {
  if (!itemId) return {};
  
  const attributes: Record<string, string> = {
    "data-kontent-item-id": itemId,
  };
  
  if (languageCodename) {
    attributes["data-kontent-language-codename"] = languageCodename;
  }
  
  if (projectId) {
    attributes["data-kontent-project-id"] = projectId;
  }
  
  return withDisable(disableHighlight, attributes);
};

export const createElementSmartLink = (elementCodename: string, disableHighlight: boolean = false, languageCodename?: string, projectId?: string) => {
  const attributes: Record<string, string> = {
    "data-kontent-element-codename": elementCodename
  };
  
  if (languageCodename) {
    attributes["data-kontent-language-codename"] = languageCodename;
  }
  
  if (projectId) {
    attributes["data-kontent-project-id"] = projectId;
  }
  
  return withDisable(disableHighlight, attributes);
};

export const createComponentSmartLink = (componentId: string | undefined, disableHighlight = false) => {
  if (!componentId) return {};
  
  return withDisable(disableHighlight, {
    "data-kontent-component-id": componentId,
  });
};

export const createFixedAddSmartLink = (position: "start" | "end", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
});

export const createRelativeAddSmartLink = (position: "before" | "after", renderPosition?: RenderPosition) => ({
  "data-kontent-add-button": true,
  "data-kontent-add-button-insert-position": position,
  "data-kontent-add-button-render-position": renderPosition,
});

type RenderPosition = "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end" | "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end";

const withDisable = (disable: boolean, attrs: Readonly<Record<string, string | undefined>>) => disable
  ? { ...attrs, ...disableAttribute }
  : attrs;

const disableAttribute = {
  "data-kontent-disable-features": "highlight",
};

// Helper function to get current language and project ID from context
export const getSmartLinkContext = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentLang = urlParams.get("lang") || "default";
  const projectId = import.meta.env.VITE_ENVIRONMENT_ID;
  
  return {
    languageCodename: currentLang,
    projectId: projectId,
  };
};

// Convenience function that automatically includes context
export const createSmartItemLink = (itemId: string | undefined, disableHighlight = false) => {
  const context = getSmartLinkContext();
  return createItemSmartLink(itemId, disableHighlight, context.languageCodename, context.projectId);
};

export const createSmartElementLink = (elementCodename: string, disableHighlight = false) => {
  const context = getSmartLinkContext();
  return createElementSmartLink(elementCodename, disableHighlight, context.languageCodename, context.projectId);
};