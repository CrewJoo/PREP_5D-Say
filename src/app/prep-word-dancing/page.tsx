"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, Music, CheckCircle2, ListOrdered, Sparkles,
    Shuffle, Leaf, Sprout, TreeDeciduous, TreePine, Mountain,
    ArrowRightLeft, AlertCircle, RotateCcw, BookOpen, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillDashboard } from "@/components/prep/skill-dashboard";
import { useWordDancingStore, getNextTierInfo } from "@/lib/word-dancing-store";
import { WORD_DANCING_DATA } from "@/lib/word-dancing-data";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { useHistoryStore } from "@/lib/history-store";
import { QUESTIONS_INTERVIEW, QUESTIONS_STUDENT, PrepQuestion } from "@/lib/constants";
import { ModeSelection } from "@/components/prep/mode-selection";
import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPoint } from "@/components/wizard/step-point";
import { StepReason } from "@/components/wizard/step-reason";
import { StepExample } from "@/components/wizard/step-example";
import { StepPointRe } from "@/components/wizard/step-point-re";
import { FeedbackView } from "@/components/feedback/feedback-view";

// ─── 변환기 스키마 ───────────────────────────────────────────────
const prepSchema = z.object({
    point1: z.string(),
    reason: z.string(),
    example: z.string(),
    point2: z.string(),
    advice: z.string(),
    evaluation: z.object({
        is_relevant: z.boolean(),
        is_structured: z.boolean(),
        is_sufficient: z.boolean(),
    }).optional(),
});

// ─── PREP 변환기 인라인 컴포넌트 ─────────────────────────────────
function TransformSection() {
    const { mode, setMode, reset } = usePrepStore();
    const store = useHistoryStore();
    const addRecord = store.addRecord;
    const [input, setInput] = useState("");
    const [question, setQuestion] = useState<PrepQuestion | null>(null);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const savedRef = useRef(false);

    useEffect(() => { reset(); }, [reset]);

    useEffect(() => {
        if (mode) {
            const list = mode === "WORK" ? QUESTIONS_STUDENT : QUESTIONS_INTERVIEW;
            setQuestion(list[Math.floor(Math.random() * list.length)] ?? null);
        }
    }, [mode]);

    const { object, submit, isLoading, error } = useObject({ api: "/api/transform", schema: prepSchema });
    const parsedData = object;

    useEffect(() => {
        if (parsedData && !isLoading && !savedRef.current) {
            savedRef.current = true;
            addRecord({
                type: "prep-transform",
                createdAt: new Date().toISOString(),
                question: question?.q || "PREP 변환",
                data: { input, point1: parsedData.point1 || "", reason: parsedData.reason || "", example: parsedData.example || "", point2: parsedData.point2 || "" },
                feedback: parsedData.advice || undefined,
            });
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        }
    }, [parsedData, isLoading]);

    useEffect(() => { savedRef.current = false; }, [input]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        submit({ input, question: question?.q } as any);
    };

    if (!mode) {
        const transformInfo = store.getPracticeTierInfo('prep-transform');
        return (
            <div className="mt-8">
                <SkillDashboard
                    title="PREP 변환기"
                    subtitle="장황한 내 글을 깔끔한 PREP 구조로 세탁해 보세요!"
                    tierName={<span><span className="text-amber-600">PREP 변환기</span> 레벨</span>}
                    tierIndex={transformInfo.tierIndex}
                    tierIconNode={<TreePine className="w-8 h-8 text-amber-500" />}
                    currentScore={transformInfo.count}
                    scoreLabel="회"
                    remainingScore={transformInfo.remaining}
                    progressPercent={transformInfo.progress}
                    theme="amber"
                    href="#transform-mode"
                    actionLabel="변환하기"
                />
                <div id="transform-mode" className="mt-10">
                    <ModeSelection onSelect={(m) => setMode(m)} title="어떤 상황을 변환하시겠습니까?" theme="amber" />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            {showSavedToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-amber-500 text-white px-5 py-3 rounded-xl shadow-xl font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" /> 변환 기록이 저장되었습니다!
                </div>
            )}

            {/* 모드 리셋 */}
            <div className="flex justify-end mb-4">
                <button onClick={() => { reset(); setInput(""); savedRef.current = false; }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                    <RotateCcw className="w-3 h-3" /> 상황 다시 선택
                </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* 입력 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-700">나의 생각 (비구조화)</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="두서없이 떠오르는 생각을 그대로 적어보세요. AI가 PREP 구조로 정리해드립니다."
                            className="min-h-[240px] text-sm resize-none bg-white"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()} className="w-full bg-amber-500 text-white hover:bg-amber-600 py-6 font-bold rounded-xl">
                            {isLoading ? <span className="flex items-center gap-2"><Sparkles className="animate-spin h-4 w-4" /> 구조화 중...</span> : <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> PREP으로 변환하기</span>}
                        </Button>
                    </form>
                </div>

                {/* 결과 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[340px] flex flex-col">
                    <h3 className="text-base font-bold text-slate-700 mb-4">변환 결과 (PREP)</h3>
                    {error && <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-4 rounded-xl"><AlertCircle className="w-4 h-4 flex-shrink-0" /> 오류가 발생했습니다. 다시 시도해주세요.</div>}
                    {!parsedData && !isLoading && !error && (
                        <div className="flex flex-1 items-center justify-center text-slate-300 text-sm border-2 border-dashed border-slate-100 rounded-xl">왼쪽에 내용을 입력해 보세요.</div>
                    )}
                    {isLoading && !parsedData && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-trust-navy animate-pulse">
                            <Sparkles className="h-8 w-8" />
                            <p className="text-sm">논리 구조를 잡고 있습니다...</p>
                        </div>
                    )}
                    {parsedData && (
                        <div className="space-y-3 overflow-y-auto flex-1">
                            {parsedData.advice && (
                                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                    <p className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI 직설 코칭</p>
                                    <p className="text-sm text-slate-700 leading-relaxed">{parsedData.advice}</p>
                                </div>
                            )}
                            {[
                                { label: "Point (결론)", value: parsedData.point1, color: "amber" },
                                { label: "Reason (이유)", value: parsedData.reason, color: "slate" },
                                { label: "Example (사례)", value: parsedData.example, color: "slate" },
                                { label: "Point (요약)", value: parsedData.point2, color: "amber" },
                            ].map(({ label, value, color }) => value && (
                                <div key={label} className={`rounded-xl p-4 ${color === "amber" ? "bg-amber-50 border border-amber-100" : "bg-slate-50 border border-slate-100"}`}>
                                    <span className={`text-xs font-bold block mb-1 ${color === "amber" ? "text-amber-700" : "text-slate-500"}`}>{label}</span>
                                    <p className="text-sm text-slate-800 leading-relaxed">{value}</p>
                                </div>
                            ))}
                            <div className="flex justify-end pt-2">
                                <button onClick={() => { setInput(""); reset(); savedRef.current = false; }} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                                    <RotateCcw className="w-3 h-3" /> 새로운 내용 변환
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── PREP 트레이닝 인라인 컴포넌트 ───────────────────────────────
function TrainingSection() {
    const { currentStep, mode, setMode, reset } = usePrepStore();
    const store = useHistoryStore();

    useEffect(() => { reset(); }, [reset]);


    const getStepContent = () => {
        switch (currentStep) {
            case 1: return {
                title: "결론부터 말하세요 (Point)",
                description: "입학사정관의 뇌는 피로합니다. 두괄식으로 핵심을 꽂아주세요.",
                tipTitle: "두괄식으로 말하세요.",
                tipContent: <p>가장 하고 싶은 말을 명확한 한 문장으로 요약해서 제시하는 단계입니다.<br />질문에 대한 <strong>가장 직접적인 대답</strong>을 먼저 던지세요.</p>,
                component: <StepPoint />
            };
            case 2: return {
                title: "그 이유는 무엇인가요? (Reason)",
                description: "단순한 주장이 아닌, 타당한 인과관계를 제시해야 설득됩니다.",
                tipTitle: "주관적 감정보다는 '객관적 사실'을.",
                tipContent: <p>왜 그렇게 생각하시나요? <strong>상대방이 납득할 수 있는 구체적인 근거</strong>를 제시해 주세요.<br />수치, 데이터, 사실 기반의 이유일수록 설득력이 높아집니다.</p>,
                component: <StepReason />
            };
            case 3: return {
                title: "구체적인 증거는? (Example)",
                description: "주장을 가장 설득력 있게 뒷받침하는 증거를 제시하세요.",
                tipTitle: "주장을 가장 설득력 있게 뒷받침하는 증거를 선택하세요",
                tipContent: <ul className="space-y-1">
                    <li><span className="font-bold">📊 데이터/통계:</span> 수치와 출처로 객관성을 확보하세요.</li>
                    <li><span className="font-bold">🏢 객관적 사례:</span> 전공·학계의 구체적 사례로 논리를 증명하세요.</li>
                    <li><span className="font-bold">💬 전문가 의견:</span> 권위 있는 연구·인용으로 신뢰도를 높이세요.</li>
                    <li><span className="font-bold">🙋 개인 경험:</span> 본인의 구체적인 교내외 활동으로 진정성을 더하세요.</li>
                </ul>,
                component: <StepExample />
            };
            case 4: return {
                title: "마무리 제안 (Point)",
                description: "앞선 내용을 요약하고, 희망 학과에 기여할 점을 강조하세요.",
                tipTitle: "수미상관으로 완벽하게.",
                tipContent: <p>첫 문장(Point 1)의 핵심 메시지를 다시 안고하여 <strong>일관성과 완결성</strong>을 내세우세요.</p>,
                component: <StepPointRe />
            };
            case 5: return {
                title: "AI 입학사정관의 피드백",
                description: "당신의 답변을 분석했습니다.",
                tipTitle: undefined,
                tipContent: undefined,
                component: <FeedbackView />
            };
            default: return null;
        }
    };


    if (!mode) {
        const trainingInfo = store.getPracticeTierInfo('prep-training');
        return (
            <div className="mt-8">
                <SkillDashboard
                    title="PREP 트레이닝"
                    subtitle="핵심 주장을 구조화하는 기본기를 다지는 훈련입니다."
                    tierName={<span><span className="text-indigo-600">PREP 트레이닝</span> 레벨</span>}
                    tierIndex={trainingInfo.tierIndex}
                    tierIconNode={<BookOpen className="w-8 h-8 text-indigo-500" />}
                    currentScore={trainingInfo.count}
                    scoreLabel="회"
                    remainingScore={trainingInfo.remaining}
                    progressPercent={trainingInfo.progress}
                    theme="blue"
                    href="#training-mode"
                    actionLabel="연습하기"
                />
                <div id="training-mode" className="mt-10">
                    <ModeSelection onSelect={(m) => setMode(m)} title="어떤 상황을 연습하고 싶으신가요?" theme="blue" />
                </div>
            </div>
        );
    }

    const stepContent = getStepContent();
    if (!stepContent) return null;

    return (
        <WizardLayout title={stepContent.title} description={stepContent.description} theme="indigo" compact={true}
            pageTitle={<span className="flex items-center justify-center gap-3"><BookOpen className="w-8 h-8 text-white" /><span><span className="text-blue-300">PREP</span> 트레이닝</span></span>}
            pageDescription={<>4단계 위저드로 P→R→E→P 논리 구조를 직접 완성해보세요.</>}
            tipTitle={stepContent.tipTitle}
            tipContent={stepContent.tipContent}
        >
            {stepContent.component}
        </WizardLayout>
    );
}



// ─── 메인 페이지 ──────────────────────────────────────────────────
type Tab = "word-dancing" | "training" | "transform";

export default function WordDancingPage() {
    const wordDancing = useWordDancingStore();
    const { completedBunches } = wordDancing;
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("word-dancing");

    useEffect(() => { setMounted(true); }, []);

    const steps = [
        { id: 1, levelLabel: "Level 1", title: "P와 R 구분하기", desc: "직관적으로 결론(Point)과 이유(Reason)를 구분하는 감각을 익힙니다.", icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />, link: "/prep-training/step1", active: true },
        { id: 2, levelLabel: "Level 2", title: "P, R, E 연결하기", desc: "핵심 요소를 3가지 덩어리로 분류하는 기초 훈련입니다.", icon: <ListOrdered className="h-8 w-8 text-emerald-600" />, link: "/prep-training/step2", active: true },
        { id: 3, levelLabel: "Level 3", title: "논리(P-R-E) 확장하기", desc: "복잡한 문장에서 P-R-E 구조를 찾아내는 심화 훈련입니다.", icon: <Sparkles className="h-8 w-8 text-emerald-600" />, link: "/prep-training/step3", active: true },
        { id: 4, levelLabel: "Level 4", title: "완벽한 논리(PREP) 완성하기", desc: "완벽한 4단 논법으로 당신의 생각을 구조화해보세요.", icon: <Music className="h-8 w-8 text-emerald-600" />, link: "/prep-training/step4", active: true },
    ].map(step => {
        if (!mounted) return { ...step, progress: 0 };
        const levelData = WORD_DANCING_DATA.find(d => d.level === step.id);
        const total = levelData?.bunches.length || 1;
        const completed = completedBunches[step.id]?.length || 0;
        return { ...step, progress: Math.min(100, Math.round((completed / total) * 100)) };
    });

    const tabs = [
        { id: "word-dancing" as Tab, label: "워드댄싱", icon: Shuffle, desc: "게임형 문장 조립" },
        { id: "training" as Tab, label: "PREP 트레이닝", icon: BookOpen, desc: "4단계 위저드 훈련" },
        { id: "transform" as Tab, label: "PREP 변환기", icon: ArrowRightLeft, desc: "AI 논리 구조화" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 relative">
            <div className="max-w-6xl w-full pt-52 pb-20 px-6">

                {/* 3탭 네비게이션 - 최상위 */}
                <div className="flex rounded-2xl bg-white border border-slate-100 shadow-sm p-1.5 gap-1.5 mb-8">
                    {tabs.map(({ id, label, icon: Icon, desc }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl text-sm font-bold transition-all gap-0.5 ${activeTab === id
                                ? id === 'word-dancing'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : id === 'training'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-amber-500 text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-4 h-4 mb-0.5" />
                            <span>{label}</span>
                            <span className={`text-[10px] font-normal ${activeTab === id ? "text-white/70" : "text-slate-300"}`}>{desc}</span>
                        </button>
                    ))}
                </div>

                {/* 탭별 제목 + 설명 */}
                <AnimatePresence mode="wait">
                    {activeTab === "word-dancing" && (
                        <motion.div key="hd-wd" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-10">
                            <div className="inline-flex items-center gap-3 mb-6 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0"><Shuffle className="w-7 h-7 text-white" /></div>
                                <h1 className="text-3xl font-black text-slate-900 break-keep">PREP 워드댄싱</h1>
                            </div>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto break-keep leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
                                <span className="text-emerald-600 font-bold">워드 댄싱</span>은 흩어진 문장 조각들을 조립하며 PREP 논리 감각을 익히는 게임형 훈련입니다.<br className="hidden sm:block" />
                                레벨별 미션을 완수하며 자연스럽게 PREP 구조를 체득하세요.
                            </p>
                        </motion.div>
                    )}
                    {activeTab === "training" && (
                        <motion.div key="hd-tr" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-10">
                            <div className="inline-flex items-center gap-3 mb-6 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0"><BookOpen className="w-7 h-7 text-white" /></div>
                                <h1 className="text-3xl font-black text-slate-900 break-keep">PREP 트레이닝</h1>
                            </div>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto break-keep leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
                                <span className="text-blue-600 font-bold">PREP 트레이닝</span>은 당신의 생각을 가장 논리적인 구조로 다듬어주는 실전 훈련 파트너입니다.<br className="hidden sm:block" />
                                <span className="font-bold">4단계 가이드</span>를 따라 핵심 주장, 타당한 근거, 생생한 사례를 연결하다 보면 어느새 설득력 있는 답변이 완성됩니다.
                            </p>
                        </motion.div>
                    )}
                    {activeTab === "transform" && (
                        <motion.div key="hd-tf" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center mb-10">
                            <div className="inline-flex items-center gap-3 mb-6 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-200 shrink-0"><ArrowRightLeft className="w-7 h-7 text-white" /></div>
                                <h1 className="text-3xl font-black text-slate-900 break-keep">PREP 변환기</h1>
                            </div>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto break-keep leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-md">
                                <span className="text-amber-600 font-bold">PREP 변환기</span>는 당신의 파편화된 생각을 논리적인 PREP 구조로 자동 재조립해줍니다.<br className="hidden sm:block" />
                                복잡한 설명이나 장황한 아이디어를 입력하면, AI가 핵심(Point)을 추출하고 근거(Reason)와 사례(Example)를 보강하여 설득력 있는 답변으로 완성합니다.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 탭별 콘텐츠 */}
                <AnimatePresence mode="wait">
                    {activeTab === "word-dancing" && (
                        <motion.div key="wd" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            {/* 스킬 대시보드 */}
                            {(() => {
                                const wdTier = wordDancing.getTier();
                                const wdNext = getNextTierInfo(wordDancing.totalScore);
                                const WDIcons: Record<string, React.ComponentType<any>> = { Seed: Leaf, Sprout: Sprout, Branch: TreeDeciduous, Tree: TreePine, Forest: Mountain };
                                const wdIconComp = WDIcons[wdTier] || Leaf;
                                const wdColor = { Seed: "text-green-500", Sprout: "text-green-600", Branch: "text-green-700", Tree: "text-green-800", Forest: "text-green-900" }[wdTier] || "text-green-500";
                                const progress = !wdNext.next ? 100 : Math.min(100, Math.max(0, ((wdNext.total - wdNext.remaining) / wdNext.total) * 100));
                                return (
                                    <SkillDashboard
                                        title="PREP 워드댄싱" subtitle="레고처럼 즐겁게 문장을 조립하며 PREP의 감각을 익혀요!"
                                        tierName={<span><span className="text-emerald-600">PREP 워드댄싱</span> 레벨</span>}
                                        tierIndex={Object.keys(WDIcons).indexOf(wdTier) + 1}
                                        tierIconNode={React.createElement(wdIconComp, { className: `w-8 h-8 ${wdColor}` })}
                                        currentScore={wordDancing.totalScore} scoreLabel="XP"
                                        remainingScore={wdNext.remaining || null} progressPercent={progress}
                                        theme="green" href="#levels" actionLabel="도전하기"
                                    />
                                );
                            })()}

                            {/* Level 카드 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                {steps.map((step, idx) => (
                                    <motion.div key={step.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                        <Link href={step.active ? step.link : "#"} className={!step.active ? "cursor-not-allowed" : ""}>
                                            <div className={`bg-white p-8 h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-2 rounded-2xl ${step.active ? "border-transparent hover:border-emerald-200 cursor-pointer shadow-lg shadow-slate-200/50" : "opacity-40 border-slate-100 bg-slate-50"}`}>
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">{step.icon}</div>
                                                        <span className="text-xl font-bold text-slate-400 mr-2">{step.levelLabel}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className={`text-2xl font-bold mb-3 ${step.active ? "text-slate-800" : "text-slate-400"}`}>{step.title}</h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed mb-4">{step.desc}</p>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs font-bold text-slate-500">
                                                            <span>진행률</span>
                                                            <span>{Math.round(step.progress)}%</span>
                                                        </div>
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                            <div className={cn("h-full rounded-full transition-all duration-500", step.id === 1 && "bg-emerald-400", step.id === 2 && "bg-emerald-500", step.id === 3 && "bg-emerald-600", step.id === 4 && "bg-emerald-700")} style={{ width: `${step.progress}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-8 flex justify-end">
                                                    <div className={`p-2 rounded-full ${step.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                                        <ArrowRight className="h-6 w-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "training" && (
                        <motion.div key="training" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <TrainingSection />
                        </motion.div>
                    )}

                    {activeTab === "transform" && (
                        <motion.div key="transform" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <TransformSection />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
