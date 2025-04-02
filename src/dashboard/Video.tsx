import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { useRef, useEffect } from "react";

export const VideoStream = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      const clickable = wrapperRef.current?.querySelector(
        ".lty-playbtn"
      ) as HTMLElement | null;
      if (clickable) {
        clickable.click();
      }
    }
  }, []);

  return (
    <div className="relative rounded border overflow-hidden" ref={wrapperRef}>
      <LiteYouTubeEmbed
        id="8sy2XXk_UwQ"
        title="Check current station status"
        muted
      />
    </div>
  );
};
