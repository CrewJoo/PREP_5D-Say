"use client";

import { useElenchusStore } from "@/lib/elenchus-store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { ElenchusSelection } from "@/components/elenchus/elenchus-selection";
import { ElenchusStep } from "@/components/elenchus/elenchus-step";
import { ElenchusResult } from "@/components/elenchus/elenchus-result";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Landmark } from "lucide-react";

export default function ElenchusPage() {
    const { currentStep, reset, category } = useElenchusStore();

    useEffect(() => {
        reset();
    }, [reset]);

    // Selection Mode - 산파술 선택 화면 + 하단에 모의면접 통합
    if (currentStep === 0) {
        return (
            <div className="min-h-screen bg-slate-50 relative pb-20 p-6">
                <div className="max-w-6xl mx-auto px-6 pt-40">
                    {/* ── B코스 헤더 (A코스와 동일한 스타일) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-violet-50 text-violet-600 text-sm font-bold mb-3 border border-violet-100">
                            🏛️ B코스 · ELENCHUS
                        </span>
                        <div className="flex justify-center mb-2">
                            <div className="inline-flex items-center gap-3 text-left">
                                <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200 shrink-0">
                                    <Landmark className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 break-keep">자기발견 5D 문답법</h1>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm">AI 소크라테스와 함께 나만의 핵심 역량(5D)을 발견하세요</p>
                    </motion.div>


                    <ElenchusSelection />

                </div>
            </div>
        );
    }

    // Wizard Mode (산파술 단계별)
    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "Step 1: 정의 (Definition)",
                    description: "당신의 생각을 있는 그대로 솔직하게 이야기해주세요.",
                    component: <ElenchusStep />
                };
            case 2:
                return {
                    title: "Step 2: 반박 (Elenchus)",
                    description: "소크라테스가 당신의 생각에 숨겨진 모순을 파고듭니다.",
                    component: <ElenchusStep />
                };
            case 3:
                return {
                    title: "Step 3: 산파술 (Maieutics)",
                    description: "혼란 속에서 새로운 진리가 태어나는 순간입니다.",
                    component: <ElenchusStep />
                };
            case 4:
                return {
                    title: "Step 4: 통합 (Synthesis)",
                    description: "발견한 진리를 하나의 문장으로 정리해보세요.",
                    component: <ElenchusStep />
                };
            case 5:
                return {
                    title: "발견 완료 (Discovery)",
                    description: "치열한 문답 끝에 탄생한 당신만의 5D입니다.",
                    component: <ElenchusResult />
                };
            default:
                return { title: "", description: "", component: null };
        }
    };

    const content = getStepContent();

    return (
        <WizardLayout
            title={content.title}
            description={content.description}
            pageTitle={
                <>
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-200 shrink-0">
                        <Landmark className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-3xl font-black text-slate-900 break-keep">자기발견 5D 문답법</h1>
                    </div>
                </>
            }
            pageDescription={<>
                소크라테스와의 문답법을 통해<br className="hidden sm:block" />
                나의 <span className="font-bold text-purple-600">{category}</span>에 대한 본질적인 답을 찾아갑니다.
            </>}
        >
            {content.component}
        </WizardLayout>
    );
}

