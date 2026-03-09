"use client";

import { motion } from "framer-motion";
import { useTrackStore, InterviewTrack } from "@/store/use-track-store";
import { Clock, GraduationCap, Zap, Brain } from "lucide-react";

interface TrackCardProps {
    track: "A" | "B";
    onSelect: (track: InterviewTrack) => void;
}

const TRACK_INFO = {
    A: {
        label: "일반 서류 면접",
        badge: "A 코스",
        time: "5 ~ 10분 면접",
        target: "중경외시 · 수도권 · 지방대",
        desc: "생기부 핵심 내용을 짧고 조리 있게 요약 전달하는 것이 목표! 복잡한 논리보다 빠른 3문장 스피치 훈련",
        color: "emerald",
        icon: Zap,
        tags: ["1분 자기소개", "필수 질문 3개", "생기부 요약 스피치"],
    },
    B: {
        label: "자기발견 5D 문답법",
        badge: "B 코스",
        time: "10분 ~ 50분",
        target: "심층면접 · 산파술 · 역량발굴",
        desc: "AI 소크라테스와의 문답으로 Dream·Difficulty·Trend·Stand·Different 5가지 핵심 역량을 발굴하고 나만의 스토리를 완성합니다.",
        color: "violet",
        icon: Brain,
        tags: ["5D 역량 발굴", "AI 소크라테스", "자기발견 문답"],
    },
} as const;

function TrackCard({ track, onSelect }: TrackCardProps) {
    const { label, badge, time, target, desc, color, icon: Icon, tags } = TRACK_INFO[track];

    const colorMap = {
        emerald: {
            badge: "bg-emerald-100 text-emerald-700",
            border: "hover:border-emerald-300 hover:bg-emerald-50/50",
            icon: "bg-emerald-100 text-emerald-600",
            tag: "bg-emerald-50 text-emerald-600 border-emerald-100",
            button: "bg-emerald-500 hover:bg-emerald-600",
        },
        violet: {
            badge: "bg-violet-100 text-violet-700",
            border: "hover:border-violet-300 hover:bg-violet-50/50",
            icon: "bg-violet-100 text-violet-600",
            tag: "bg-violet-50 text-violet-600 border-violet-100",
            button: "bg-violet-500 hover:bg-violet-600",
        },
    };

    const c = colorMap[color];

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(track)}
            className={`group relative flex flex-col gap-4 text-left w-full p-6 bg-white border-2 border-slate-100 ${c.border} rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer`}
        >
            {/* 배지 + 시간 */}
            <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.badge}`}>{badge}</span>
                <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{time}</span>
                </div>
            </div>

            {/* 아이콘 + 타이틀 */}
            <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${c.icon}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-bold text-slate-800 text-base">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {target}
                    </p>
                </div>
            </div>

            {/* 설명 */}
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-md border ${c.tag}`}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* 선택하기 버튼 */}
            <div className={`mt-1 w-full py-2 rounded-xl text-white text-sm font-bold text-center ${c.button} transition-colors`}>
                이 코스로 시작하기 →
            </div>
        </motion.button>
    );
}

export function TrackSelector() {
    const { setTrack } = useTrackStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="mb-5 text-center">
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">STEP 0</p>
                <h2 className="text-lg font-black text-slate-800">내 면접 유형을 선택하세요</h2>
                <p className="text-sm text-slate-400 mt-1">선택한 코스에 맞게 훈련 과정이 자동으로 맞춰집니다</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TrackCard track="A" onSelect={setTrack} />
                <TrackCard track="B" onSelect={setTrack} />
            </div>
        </motion.div>
    );
}
