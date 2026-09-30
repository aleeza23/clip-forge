export type MediaType = "video" | "image";
export type ClipJobStatus =
  | "uploading"
  | "uploaded"
  | "transcribing"
  | "captioning"
  | "analyzing"
  | "processing"
  | "completed"
  | "failed";

export interface MediaFile {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: MediaType;
  mimeType: string;
  url: string;
  duration?: number; // in seconds for videos
  dimensions?: {
    width: number;
    height: number;
  };
  thumbnailUrl?: string;
  cloudinaryPublicId?: string;
  rawFile?: File;
  uploadedAt: Date;
  status: ClipJobStatus;
  transcript?: string;
}

export interface ViralHook {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
  score: number; // 0 - 100
  reason: string;
  tag: string;
  captionText?: string;
}

export type AspectRatioType = "9:16" | "1:1" | "16:9";
export type ClipLengthType = "auto" | "under30" | "30to60" | "60to90";
export type CaptionStyleType =
  | "red-glow"
  | "hormozi"
  | "minimal"
  | "bold-strike";

export interface ClipGenerationSettings {
  aspectRatio: AspectRatioType;
  clipLength: ClipLengthType;
  captionStyle: CaptionStyleType;
  prompt: string;
  removeFillerWords: boolean;
  autoFaceTracking: boolean;
  clipCount: number;
}

export interface CaptionSegment {
  text: string;
  start: number;
  end: number;
}

export interface GeneratedClip {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  viralScore: number;
  startTime: number;
  endTime: number;
  thumbnail: string;
  transcriptSample: string;
  captions?: CaptionSegment[];
  transcript?: string;

  captionText: string;
  aspectRatio: AspectRatioType;
  viewsEstimate: string;
  tags: string[];
  cloudinaryUrl: string;
  cloudinaryPublicId?: string;
}

export type JobStatus =
  | "uploading"
  | "analyzing"
  | "processing"
  | "completed"
  | "failed";

export interface ClipJob {
  id: string;
  progress: number;
  currentStepMessage: string;
  originalVideoUrl: string;
  originalPublicId: string;
  fileName: string;
  duration: number;
  clips: GeneratedClip[];
  error?: string;
  createdAt: string;
  updatedAt: string;
  status: ClipJobStatus;
  captions?: { text: string; start: number; end: number }[];

  transcript?: string;
}
