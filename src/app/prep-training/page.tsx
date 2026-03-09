"use client";

import { Step1ReadingTrainer, Step2PointFirstTrainer, Step3DefenseTrainer } from "@/components/prep/skill-quest";
import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Zap, Shield } from "lucide-react";

export default function PrepTrainingPage() {
    const [activeQuest, setActiveQuest] = useState<1 | 2 | 3>(1);

    const tabs = [
        { step: 1 as const, label: "입 열기", sub: "40초 대본 읽기", icon: Volume2, color: "emerald" },
        { step: 2 as const, label: "두괄식", sub: "8초 결론 훈련", icon: Zap, color: "amber" },
        { step: 3 as const, label: "방어 훈련", sub: "1분 키워드 설명", icon: Shield, color: "violet" },
    ] as const;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
            <div className="max-w-2xl w-full pt-40 pb-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-50 text-amber-600 text-sm font-bold mb-3 border border-amber-100">
                        ⚡ A코스 · SKILL QUEST
                    </span>
                    <div className="flex justify-center mb-2">
                        <div className="inline-flex items-center gap-3 text-left">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200 shrink-0">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 break-keep">실전 스킬 3단계 훈련</h1>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">타이머와 함께 진짜 면접처럼 연습해보세요</p>

                </motion.div>

                {/* 단계 카드 안내 */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {tabs.map(({ step, label, sub, icon: Icon, color }) => {
                        const isActive = activeQuest === step;
                        const colorMap = {
                            emerald: { bg: isActive ? "bg-emerald-500" : "bg-white", text: isActive ? "text-white" : "text-emerald-600", border: "border-emerald-200", icon: "text-emerald-500" },
                            amber: { bg: isActive ? "bg-amber-400" : "bg-white", text: isActive ? "text-white" : "text-amber-600", border: "border-amber-200", icon: "text-amber-500" },
                            violet: { bg: isActive ? "bg-violet-500" : "bg-white", text: isActive ? "text-white" : "text-violet-600", border: "border-violet-200", icon: "text-violet-500" },
                        }[color];

                        return (
                            <button
                                key={step}
                                onClick={() => setActiveQuest(step)}
                                className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border-2 transition-all ${colorMap.bg} ${colorMap.border} shadow-sm`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : colorMap.icon}`} />
                                <span className={`text-xs font-black ${colorMap.text}`}>Step{step}</span>
                                <span className={`text-xs font-bold ${colorMap.text} opacity-90`}>{label}</span>
                                <span className={`text-[10px] ${isActive ? "text-white/70" : "text-slate-400"}`}>{sub}</span>
                            </button>
                        );
                    })}
                </div>

                {/* 훈련 컨텐츠 카드 */}
                <motion.div
                    key={activeQuest}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm"
                >
                    {activeQuest === 1 && <Step1ReadingTrainer />}
                    {activeQuest === 2 && <Step2PointFirstTrainer />}
                    {activeQuest === 3 && <Step3DefenseTrainer />}
                </motion.div>

                {/* 하단 안내 */}
                <p className="text-center text-xs text-slate-300 mt-8">
                    각 단계를 순서대로 연습하면 면접 기초 스킬이 빠르게 향상됩니다.
                </p>
            </div>
        </div>
    );
}
