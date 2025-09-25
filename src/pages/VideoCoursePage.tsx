import React, { useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { createClient } from "../utils/client";
import { useAppContext } from "../context/AppContext";
import { VideoCourse, LanguageCodenames } from "../model";
import { PortableText } from "@portabletext/react";
import { transformToPortableText } from "@kontent-ai/rich-text-resolver";
import { defaultPortableRichTextResolvers } from "../utils/richtext";
import PageSection from "../components/PageSection";
import Tags from "../components/Tags";
// import { NavLink } from "react-router";
// import { createPreviewLink } from "../utils/link";
import { IRefreshMessageData, IRefreshMessageMetadata, IUpdateMessageData, applyUpdateOnItemAndLoadLinkedItems } from "@kontent-ai/smart-link";
import { useCustomRefresh, useLivePreview } from "../context/SmartLinkContext";
import { createSmartElementLink, createSmartItemLink } from "../utils/smartlink";
import { useQuery } from "@tanstack/react-query";
import { DeliveryError } from "@kontent-ai/delivery-sdk";
import VideoFromCloudinary from "../components/VideoFromCloudinary";

const VideoCoursePage: React.FC = () => {
  const { environmentId, apiKey } = useAppContext();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const lang = searchParams.get("lang");

  const { data: videoCourse, refetch } = useQuery({
    queryKey: ["video-course-detail", slug, lang, isPreview],
    queryFn: async () => {
      try {
        console.log('Fetching video course with slug:', slug);
        console.log('Environment ID:', environmentId);
        console.log('Language:', lang);
        console.log('Is Preview:', isPreview);
        
        // Get the video course directly by codename (slug)
        const courseResponse = await createClient(environmentId, apiKey, isPreview)
          .items<VideoCourse>()
          .type("video_course")
          .equalsFilter("system.codename", slug ?? "")
          .languageParameter((lang ?? "default") as LanguageCodenames)
          .depthParameter(3)
          .toPromise();

        console.log('Course response:', courseResponse);
        
        if (courseResponse.data.items.length === 0) {
          console.log('No course found with codename, trying to fetch all courses...');
          // Fallback: try to get all video courses to see what's available
          const allCoursesResponse = await createClient(environmentId, apiKey, isPreview)
            .items<VideoCourse>()
            .type("video_course")
            .languageParameter((lang ?? "default") as LanguageCodenames)
            .toPromise();
          
          console.log('All available courses:', allCoursesResponse.data.items.map(course => ({
            codename: course.system.codename,
            title: course.elements.course_title?.value
          })));
        }
        
        return courseResponse.data.items[0] ?? null;
      } catch (err) {
        if (err instanceof DeliveryError) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!slug,
  });

  const handleLiveUpdate = useCallback((data: IUpdateMessageData) => {
    if (videoCourse) {
      applyUpdateOnItemAndLoadLinkedItems(
        videoCourse,
        data,
        (codenamesToFetch: readonly string[]) => createClient(environmentId, apiKey, isPreview)
          .items()
          .inFilter("system.codename", [...codenamesToFetch])
          .toPromise()
          .then(res => res.data.items)
      ).then((updatedItem) => {
        if (updatedItem) {
          // Update the query data
          // Note: You might need to use queryClient.setQueryData here
        }
      });
    }
  }, [videoCourse, environmentId, apiKey, isPreview]);

  useLivePreview(handleLiveUpdate);

  const onRefresh = useCallback(
    (_: IRefreshMessageData, metadata: IRefreshMessageMetadata, originalRefresh: () => void) => {
      if (metadata.manualRefresh) {
        originalRefresh();
      } else {
        refetch();
      }
    },
    [refetch],
  );

  useCustomRefresh(onRefresh);

  if (!videoCourse) {
    return <div className="flex-grow" />;
  }

  const author = videoCourse.elements.author?.linkedItems[0];
  const videoAsset = videoCourse.elements.video?.linkedItems[0];
  const courseLevel = videoCourse.elements.course_level?.value[0];
  const topics = videoCourse.elements.topics?.value || [];


  console.log(videoCourse);

  return (
    <div className="flex flex-col">
      {/* Full Width Video Section */}
      {videoAsset && (
        <div className="bg-black">
          <VideoFromCloudinary
            cloudinaryAsset={videoAsset}
            componentId={videoCourse.system.id}
            shouldAutoplay={false}
            showControls={true}
          />
        </div>
      )}

      {/* Course Header Section */}
      <PageSection color="bg-white">
        <div className="flex flex-col gap-4 pt-[40px] pb-[40px] max-w-[700px] mx-auto">
          <h1 
            className="text-[42px] leading-tight text-gray-900"
            {...createSmartItemLink(videoCourse.system.id)}
            {...createSmartElementLink("course_title")}
          >
            {videoCourse.elements.course_title?.value}
          </h1>

          {/* Author Name */}
          {author && (
            <p className="text-lg text-gray-600">
              {author.elements.first_name?.value} {author.elements.last_name?.value}
            </p>
          )}

          {/* Course Tags */}
          <div className="flex flex-wrap gap-2">
            {courseLevel && (
              <Tags
                tags={[courseLevel.name]}
                itemId={videoCourse.system.id}
                elementCodename="course_level"
              />
            )}
            {topics.length > 0 && (
              <Tags
                tags={topics.map(topic => topic.name)}
                itemId={videoCourse.system.id}
                elementCodename="topics"
              />
            )}
          </div>
        </div>
      </PageSection>

      {/* Course Content */}
      {videoCourse.elements.content?.value && (
        <PageSection color="bg-white">
          <div className="flex flex-col gap-12 mx-auto items-center max-w-4xl py-[104px]">
            <div 
              className="rich-text-body flex mx-auto flex-col gap-5 items-center max-w-full"
              {...createSmartItemLink(videoCourse.system.id)}
              {...createSmartElementLink("content")}
            >
              <PortableText
                value={transformToPortableText(videoCourse.elements.content.value)}
                components={defaultPortableRichTextResolvers}
              />
            </div>
          </div>
        </PageSection>
      )}

     
    </div>
  );
};

export default VideoCoursePage;
