"use client";

import { AudioPlayer } from "@/components/AudioPlayer";

interface ContentPanelLezenProps {
  type: "lezen";
  content: string;
}

interface ContentPanelLuisterenProps {
  type: "luisteren";
  transcript: string;
}

interface ContentPanelKNMProps {
  type: "knm";
}

type ContentPanelProps = ContentPanelLezenProps | ContentPanelLuisterenProps | ContentPanelKNMProps;

export function ContentPanel(props: ContentPanelProps) {
  if (props.type === "lezen") {
    return (
      <div className="landing-card p-4 sm:p-6">
        <p className="text-base leading-relaxed whitespace-pre-wrap text-[var(--landing-navy)]">{props.content}</p>
      </div>
    );
  }

  if (props.type === "luisteren") {
    return (
      <div className="space-y-4">
        <AudioPlayer text={props.transcript} />
      </div>
    );
  }

  // KNM: minimal display
  return (
    <div className="landing-card p-4 sm:p-6">
      <p className="text-[var(--landing-navy)]/60 text-sm">
        Beantwoord de vragen aan de rechterkant.
      </p>
    </div>
  );
}
