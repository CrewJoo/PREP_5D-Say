import { create } from 'zustand';

export type InterviewTrack = 'A' | 'B' | null;
// A: 일반 서류 면접 (5~10분, 빠른 요약 스피치 중심)
// B: 심층/MMI 면접 (기존 딥다이브, 논리 중심)

interface TrackState {
    track: InterviewTrack;
    setTrack: (track: InterviewTrack) => void;
}

export const useTrackStore = create<TrackState>((set) => ({
    track: null,
    setTrack: (track) => set({ track }),
}));
