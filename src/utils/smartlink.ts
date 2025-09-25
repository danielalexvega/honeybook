export const createItemSmartLink = (itemId: string | undefined, disableHighlight = false, languageCodename?: string) => {
  if (!itemId) return {};
  
  const attributes: Record<string, string> = {
    "data-kontent-item-id": itemId,
  };
  
  if (languageCodename) {
    attributes["data-kontent-language-codename"] = languageCodename;
  }
  
  return withDisable(disableHighlight, attributes);
};

export const createElementSmartLink = (elementCodename: string, disableHighlight: boolean = false, languageCodename?: string) => {
  const attributes: Record<string, string> = {
    "data-kontent-element-codename": elementCodename
  };
  
  if (languageCodename) {
    attributes["data-kontent-language-codename"] = languageCodename;
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
}