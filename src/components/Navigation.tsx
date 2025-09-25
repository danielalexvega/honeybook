import { FC } from "react";
import { NavLink, useSearchParams } from "react-router";
import { createClient } from "../utils/client";
import { CollectionCodenames, type Navigation, LanguageCodenames, isLink, isPage, isLandingPage } from "../model";
import { DeliveryError } from "@kontent-ai/delivery-sdk";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import { createPreviewLink } from "../utils/link";

const Navigation: FC = () => {
  const { environmentId, apiKey, collection } = useAppContext();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";

  const lang = searchParams.get("lang");
  const collectionParam = searchParams.get("collection")
  const collectionFilter = collectionParam ?? collection ?? "patient_resources";

  const { data: navigationData, isLoading, error } = useQuery({
    queryKey: ["navigation", lang, collectionFilter, isPreview],
    queryFn: () =>
      createClient(environmentId, apiKey, isPreview)
        .items<Navigation>()
        .type("_navigation")
        .limitParameter(1)
        .languageParameter((lang ?? "default") as LanguageCodenames)
        .collections([collectionFilter as CollectionCodenames])
        .toPromise()
        .then(res => res.data.items[0]?.elements.header_navigation.linkedItems.map(item => {
          if (isLink(item)) {
            return {
              name: item.elements.display_text?.value || "Untitled",
              link: item.elements.link_url?.value || "#",
            };
          } else if (isPage(item)) {
            return {
              name: item.elements.headline?.value || "Untitled",
              link: item.elements.url?.value || "#",
            };
          } else if (isLandingPage(item)) {
            return {
              name: "Landing Page",
              link: "/",
            };
          }
          return {
            name: "Untitled",
            link: "#",
          };
        }))
        .catch((err) => {
          if (err instanceof DeliveryError) {
            return [];
          }
          throw err;
        }),
  });

  const createMenuLink = (name: string, link: string) => (
    <li key={name}>
      <NavLink 
        to={createPreviewLink(link, isPreview)} 
        className="text-sm text-gray-600 hover:text-gray-900 border-b-2 border-white hover:border-gray-300 transition-colors"
        style={{ 
          fontSize: '14px', 
          padding: '16px 10px 14px 10px' 
        }}
      >
        {name}
      </NavLink>
    </li>
  );

  // Handle loading state
  if (isLoading) {
    return (
      <nav>
        <menu className="flex items-center list-none ml-[15px]">
          {createMenuLink("Home", "/")}
          <li className="animate-pulse bg-gray-200 h-4 w-16 rounded mr-6"></li>
          <li className="animate-pulse bg-gray-200 h-4 w-20 rounded mr-6"></li>
          <li className="animate-pulse bg-gray-200 h-4 w-14 rounded"></li>
        </menu>
      </nav>
    );
  }

  // Handle error state
  if (error) {
    console.error("Navigation error:", error);
    return (
      <nav>
        <menu className="flex items-center list-none">
          {createMenuLink("Home", "/")}
          {/* Show only Home link on error to prevent layout issues */}
        </menu>
      </nav>
    );
  }

  return (
    <nav>
      <menu className="flex items-center list-none ml-[15px]">
        {createMenuLink("Home", "/")}
        {
          navigationData?.map(({ name, link }) => createMenuLink(name, link))
        }
      </menu>
    </nav>
  );
};

export default Navigation;
