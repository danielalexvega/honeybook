import { FC } from "react";
import { CloudinaryAsset } from "../model";
import { Replace } from "../utils/types";
import { createItemSmartLink } from "../utils/smartlink";

type VideoFromCloudinaryProps = {
    cloudinaryAsset: Replace<CloudinaryAsset, { elements: Partial<CloudinaryAsset["elements"]> }>;
    componentId: string;
    shouldAutoplay?: boolean;
};

type CloudinaryVideoData = {
    title?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    caption?: string;
    secure_url?: string;
    url?: string;
    public_id?: string;
};

const VideoFromCloudinary: FC<VideoFromCloudinaryProps> = ({
    cloudinaryAsset,
    componentId,
    shouldAutoplay: propShouldAutoplay
}) => {
    // Extract the video URL from the custom element
    const videoUrl = cloudinaryAsset.elements.video_from_cloudinary?.value;

    // Parse the custom element value if it's a JSON string
    let parsedVideoData: CloudinaryVideoData | null = null;
    try {
        const parsed = typeof videoUrl === 'string' ? JSON.parse(videoUrl) : videoUrl;
        parsedVideoData = (parsed as CloudinaryVideoData[])?.[0] || (parsed as CloudinaryVideoData) || null;
    } catch (error) {
        console.warn('Failed to parse Cloudinary video data:', error);
    }

    // Extract video information from the parsed data
    const videoTitle = String(parsedVideoData?.title || parsedVideoData?.alt || "Cloudinary Video");
    const videoWidth = String(parsedVideoData?.width || "100%");
    const videoHeight = Number(parsedVideoData?.height) || 590;
    const shouldAutoplay = propShouldAutoplay !== undefined ? propShouldAutoplay : (Boolean(parsedVideoData?.autoplay) || true);
    const shouldMute = Boolean(parsedVideoData?.mute) || true;
    const shouldLoop = Boolean(parsedVideoData?.loop) || true;


    // Get the final video URL
    const getFinalVideoUrl = () => {
        // If we have a secure_url, use it directly
        if (parsedVideoData?.secure_url) {
            return parsedVideoData.secure_url;
        }

        // If we have a regular url, use it
        if (parsedVideoData?.url) {
            return parsedVideoData.url;
        }

        // If we have a public_id, build the URL
        if (parsedVideoData?.public_id) {
            const transformations = [];
            if (videoWidth) transformations.push(`w_${videoWidth}`);
            if (videoHeight) transformations.push(`h_${videoHeight}`);
            if (shouldAutoplay) transformations.push('so_auto');
            if (shouldMute) transformations.push('so_mute');
            if (shouldLoop) transformations.push('so_loop');

            const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
            // Use the cloud name from the existing URL or fallback to environment variable
            const cloudName = parsedVideoData?.url?.match(/res\.cloudinary\.com\/([^\/]+)/)?.[1] ||
                import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
                'your-cloud-name';
            return `https://res.cloudinary.com/${cloudName}/video/upload/${transformString}${parsedVideoData.public_id}`;
        }

        // If it's a direct URL string, use it
        if (typeof videoUrl === 'string' && videoUrl.startsWith('http')) {
            return videoUrl;
        }

        return null;
    };

    const finalVideoUrl = getFinalVideoUrl();

    return (
        <div className="flex flex-col items-center"
            {...createItemSmartLink(componentId)}>

            {finalVideoUrl ? (
                <figure className="w-full">
                    <video
                        autoPlay={shouldAutoplay}
                        className="m-auto w-full"
                        title={videoTitle}
                        width={videoWidth}
                        height={videoHeight}
                        controls={false}
                        muted={shouldMute}
                        loop={shouldLoop}
                        playsInline
                    >
                        <source src={finalVideoUrl || ""} type="video/mp4" />
                        <source src={finalVideoUrl || ""} type="video/webm" />
                        <source src={finalVideoUrl || ""} type="video/ogg" />
                        Your browser does not support the video tag.
                    </video>
                    {parsedVideoData?.caption && (
                        <figcaption className="text-gray-light block m-auto w-fit text-xl pt-6">
                            {parsedVideoData.caption}
                        </figcaption>
                    )}
                </figure>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>No video URL provided</p>
                </div>
            )}
        </div>
    );
};

export default VideoFromCloudinary;
