"use client";

import Image from "next/image";
import { AudioPlayer } from "@/components/AudioPlayer";
import type { PassageContentType } from "@/lib/types";

interface ContentPanelLezenProps {
  type: "lezen";
  content: string;
  contentType?: PassageContentType;
  instruction?: string;
}

interface ContentPanelLuisterenProps {
  type: "luisteren";
  transcript: string;
  audioFile?: string;
  image?: string;
}

interface ContentPanelKNMProps {
  type: "knm";
  questionText?: string;
  image?: string;
  audioFile?: string;
}

type ContentPanelProps = ContentPanelLezenProps | ContentPanelLuisterenProps | ContentPanelKNMProps;

function renderListContent(content: string) {
  const lines = content.split("\n").filter((line) => line.trim());
  const title = lines[0];
  const intro = lines.slice(1).find((line) => !line.match(/^\d+\./));
  const listItems = lines.filter((line) => line.match(/^\d+\./));

  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-bold text-[var(--landing-navy)]">{title}</h2>
      )}
      {intro && (
        <p className="text-[var(--landing-navy)]/80">{intro}</p>
      )}
      <ol className="list-decimal list-outside ml-5 space-y-3">
        {listItems.map((item, idx) => {
          const text = item.replace(/^\d+\.\s*/, "");
          return (
            <li key={idx} className="text-[var(--landing-navy)] pl-2">
              {text}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function renderLetterContent(content: string) {
  const lines = content.split("\n");
  return (
    <div className="space-y-4 font-serif">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-4" />;
        if (line.match(/^(Geachte|Beste|Met vriendelijke groet|Hoogachtend)/)) {
          return (
            <p key={idx} className="text-[var(--landing-navy)]">
              {line}
            </p>
          );
        }
        return (
          <p key={idx} className="text-[var(--landing-navy)]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

function renderNoticeContent(content: string) {
  const lines = content.split("\n").filter((line) => line.trim());
  const title = lines[0];
  const body = lines.slice(1);

  return (
    <div className="space-y-4 p-4 border-2 border-[var(--landing-navy)]/20 rounded-lg bg-white">
      {title && (
        <h2 className="text-xl font-bold text-[var(--landing-navy)] text-center border-b border-[var(--landing-navy)]/10 pb-3">
          {title}
        </h2>
      )}
      <div className="space-y-2">
        {body.map((line, idx) => (
          <p key={idx} className="text-[var(--landing-navy)]">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ContentPanel(props: ContentPanelProps) {
  if (props.type === "lezen") {
    return (
      <div className="space-y-4">
        {/* Instruction text */}
        {props.instruction && (
          <div className="p-4 bg-[var(--landing-navy)]/5 rounded-lg">
            <p className="text-sm text-[var(--landing-navy)]/80 whitespace-pre-line">
              {props.instruction}
            </p>
          </div>
        )}

        {/* Content based on type */}
        <div className="landing-card p-4 sm:p-6">
          {props.contentType === "list" && renderListContent(props.content)}
          {props.contentType === "letter" && renderLetterContent(props.content)}
          {props.contentType === "notice" && renderNoticeContent(props.content)}
          {(!props.contentType || props.contentType === "text") && (
            <p className="text-base leading-relaxed whitespace-pre-wrap text-[var(--landing-navy)]">
              {props.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (props.type === "luisteren") {
    return (
      <div className="space-y-4">
        {props.image && (
          <div className="landing-card overflow-hidden relative aspect-video">
            <Image
              src={props.image}
              alt="Listening exercise illustration"
              fill
              className="object-cover"
            />
          </div>
        )}
        <AudioPlayer
          audioSrc={props.audioFile}
          fallbackText={props.transcript}
        />
      </div>
    );
  }

  // KNM: show image and audio if available
  return (
    <div className="space-y-4">
      {props.image && (
        <div className="landing-card overflow-hidden relative aspect-video">
          <Image
            src={props.image}
            alt="KNM question illustration"
            fill
            className="object-cover"
          />
        </div>
      )}

      {props.audioFile && (
        <AudioPlayer
          audioSrc={props.audioFile}
          fallbackText={props.questionText}
        />
      )}

      {!props.image && !props.audioFile && (
        <div className="landing-card p-4 sm:p-6">
          <p className="text-[var(--landing-navy)]/60 text-sm">
            Beantwoord de vragen aan de rechterkant.
          </p>
        </div>
      )}
    </div>
  );
}
