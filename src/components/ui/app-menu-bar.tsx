"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Lightbulb,
    Brain,
    Compass,
    Mic,
    PenTool,
    ChevronDown,
} from "lucide-react";

export default function AppMenuBar() {
    const router = useRouter();

    return (
        <Menubar className="border-none shadow-none bg-transparent h-auto p-0 flex space-x-2">
            {/* Project Menu */}
            <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all cursor-pointer">
                    <Lightbulb className="w-4 h-4" />
                    수행평가 작명소
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[260px] rounded-xl p-2 border-slate-200 shadow-xl bg-white z-[99999]">
                    <MenubarItem onClick={() => router.push("/5d-project?tab=guide")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">사용가이드</span>
                        <span className="text-xs text-slate-500">100% 활용법 안내</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/5d-project?tab=ai")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">AI작명</span>
                        <span className="text-xs text-slate-500">수행평가 영역명 AI 추천</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/5d-project?tab=cases")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">우수사례</span>
                        <span className="text-xs text-slate-500">입사관 추천 우수 사례</span>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* 과세특 입력 (Link as discrete button outside MenubarMenu conceptually, but we can put it as a div or just a normal Link) */}
            <div className="flex items-center px-1">
                <Link
                    href="/5d-gwasaeteuk"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 transition-all shadow-sm"
                >
                    <PenTool className="w-4 h-4" />
                    과세특 입력
                </Link>
            </div>

            {/* PREP Menu */}
            <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all cursor-pointer">
                    <Brain className="w-4 h-4" />
                    PREP 사고훈련
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[260px] rounded-xl p-2 border-slate-200 shadow-xl bg-white z-[99999]">
                    <MenubarItem onClick={() => router.push("/about/prep")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">PREP이란?</span>
                        <span className="text-xs text-slate-500">말하기 공식</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/prep-word-dancing")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">PREP 3단계 연습</span>
                        <span className="text-xs text-slate-500">단계별 논리 훈련</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/prep-level-check")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">PREP 레벨체크</span>
                        <span className="text-xs text-slate-500">나의 PREP 수준 진단</span>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* Activity Menu */}
            <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all cursor-pointer">
                    <Compass className="w-4 h-4" />
                    오디세이 활동
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[260px] rounded-xl p-2 border-slate-200 shadow-xl bg-white z-[99999]">
                    <MenubarItem onClick={() => router.push("/5d-odyssey")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">오디세이란</span>
                        <span className="text-xs text-slate-500">오디세이(5D-Say) 개념 소개</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/5d-analysis")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">5D-Say 학생부분석</span>
                        <span className="text-xs text-slate-500">학생부 강점·약점 AI 분석</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/5d-interview")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">5D-Say 모의면접</span>
                        <span className="text-xs text-slate-500">AI와 함께하는 면접 연습</span>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* Interview Menu */}
            <MenubarMenu>
                <MenubarTrigger className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all cursor-pointer">
                    <Mic className="w-4 h-4" />
                    오디세이 면접
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[260px] rounded-xl p-2 border-slate-200 shadow-xl bg-white z-[99999]">
                    <MenubarItem onClick={() => router.push("/prep-training")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">A코스::구술면접 훈련</span>
                        <span className="text-xs text-slate-500">1분 면접 / 주도권 쥐기</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/5d-elenchus")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">B코스:: 자기발견 문답법</span>
                        <span className="text-xs text-slate-500">AI 소크라테스 / 핵심역량 발견</span>
                    </MenubarItem>
                    <MenubarItem onClick={() => router.push("/danbi-interview")} className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer hover:bg-slate-50">
                        <span className="font-semibold text-slate-800">AI최종분석</span>
                        <span className="text-xs text-slate-500">면접 스크립트 검증 및 완성</span>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
