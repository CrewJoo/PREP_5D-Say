"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHomeStore } from "@/store/use-home-store";
import { Menu, X, Home, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import AppMenuBar from "@/components/ui/app-menu-bar";

const ProgramGuideModal = dynamic(() => import("@/components/common/program-guide-modal").then(mod => mod.ProgramGuideModal), { ssr: false });
const CoachingModal = dynamic(() => import("@/components/common/coaching-modal").then(mod => mod.CoachingModal), { ssr: false });

// 드롭다운 메뉴 데이터
const MENUS = {
    project: {
        label: "수행평가 작명소",
        color: "black",
        items: [
            { href: "/5d-project?tab=guide", label: "사용가이드", desc: "수행평가 작명소 100% 활용법 및 안내" },
            { href: "/5d-project?tab=ai", label: "AI작명", desc: "조건 맞춤형 수행평가 영역명 AI 추천" },
            { href: "/5d-project?tab=cases", label: "우수사례", desc: "대학 입사관 추천 실제 채택 우수 사례" },
        ],
    },
    prep: {
        label: "PREP 사고훈련",
        color: "black",
        items: [
            { href: "/about/prep", label: "PREP이란?", desc: "결론→이유→예시→결론 말하기 공식" },
            { href: "/prep-word-dancing", label: "PREP 3단계 연습", desc: "단계별 스피치 훈련" },
            { href: "/prep-level-check", label: "PREP 레벨체크", desc: "나의 PREP 수준 진단" },
        ],
    },
    activity: {
        label: "오디세이 활동",
        color: "black",
        items: [
            { href: "/5d-odyssey", label: "오디세이란", desc: "5D 오디세이 개념과 활동 소개" },
            { href: "/5d-analysis", label: "학생부분석", desc: "학생부 강점·약점 AI 분석" },
            { href: "/5d-interview", label: "5D 모의면접", desc: "AI와 함께하는 실전 면접 연습" },
        ],
    },
    interview: {
        label: "5D-say 면접",
        color: "black",
        items: [
            { href: "/prep-training", label: "A코스 — 일반 서류 면접", desc: "중경외시·수도권·지방대 / 5~10분 빠른 면접" },
            { href: "/5d-elenchus", label: "B코스 — 자기발견 5D 문답법", desc: "심층면접·역량발굴 / AI 소크라테스" },
            { href: "/danbi-interview", label: "AI최종분석", desc: "면접 전체 결과 종합 평가" },
        ],
    },
} as const;

type MenuKey = keyof typeof MENUS;

const colorMap = {
    red: {
        btn: "border-red-400 text-red-700 bg-red-50 hover:bg-red-100",
        header: "text-red-600",
        dot: "bg-red-500",
        hover: "hover:bg-red-50 hover:text-red-700",
        border: "border-red-100",
        desc: "text-red-400",
    },
    violet: {
        btn: "border-violet-400 text-violet-700 bg-violet-50 hover:bg-violet-100",
        header: "text-violet-600",
        dot: "bg-violet-500",
        hover: "hover:bg-violet-50 hover:text-violet-700",
        border: "border-violet-100",
        desc: "text-violet-400",
    },
    emerald: {
        btn: "border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
        header: "text-emerald-600",
        dot: "bg-emerald-500",
        hover: "hover:bg-emerald-50 hover:text-emerald-700",
        border: "border-emerald-100",
        desc: "text-emerald-400",
    },
    blue: {
        btn: "border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100",
        header: "text-blue-600",
        dot: "bg-blue-500",
        hover: "hover:bg-blue-50 hover:text-blue-700",
        border: "border-blue-100",
        desc: "text-blue-400",
    },
    black: {
        btn: "border-slate-600 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-800",
        header: "text-slate-700",
        dot: "bg-slate-600",
        hover: "hover:bg-slate-50 hover:text-slate-800",
        border: "border-slate-200",
        desc: "text-slate-500",
    },
} as const;

const dropdownVariants = {
    hidden: { opacity: 0, y: -6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" } },
    exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.1 } },
};

interface MegaMenuDropdownProps {
    menuKey: MenuKey;
    isOpen: boolean;
    onClose: () => void;
    hideHeader?: boolean;
}

function MegaMenuDropdown({ menuKey, isOpen, onClose, hideHeader }: MegaMenuDropdownProps) {
    const menu = MENUS[menuKey];
    const c = colorMap[menu.color];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-full left-0 pt-3 z-50"
                    style={{ minWidth: "280px" }}
                >
                    <div className={`bg-white border ${c.border} rounded-2xl shadow-2xl p-2 overflow-hidden`}>
                        {/* hideHeader가 false일 때만 그룹 레이블 표시 */}
                        {!hideHeader && (
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-50">
                                <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                                <span className={`text-xs font-extrabold ${c.header} uppercase tracking-widest`}>{menu.label}</span>
                            </div>
                        )}
                        <div className="py-1">
                            {menu.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex flex-col px-4 py-3 rounded-xl mx-1 my-0.5 transition-colors ${c.hover}`}
                                >
                                    <span className="text-base font-semibold text-slate-800 whitespace-nowrap">{item.label}</span>
                                    <span className={`text-xs mt-0.5 whitespace-nowrap ${c.desc}`}>{item.desc}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function MainNav() {
    const [showGuide, setShowGuide] = useState(false);
    const [showCoaching, setShowCoaching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { viewMode, setViewMode } = useHomeStore();
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setShowGuide(false);
        setShowCoaching(false);
        setIsMobileMenuOpen(false);
        setOpenMenu(null);
    }, [pathname]);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const isHome = pathname === "/";
    const showLogo = (isHome && viewMode === "intro") || !isHome;

    const goHome = () => {
        if (isHome) setViewMode("intro");
        else { setViewMode("intro"); router.push("/"); }
        setIsMobileMenuOpen(false);
        setOpenMenu(null);
    };

    return (
        <>
            <div className="fixed top-6 left-0 z-[9999] w-full p-4 flex justify-center pointer-events-none">
                <nav
                    ref={navRef}
                    className="pointer-events-auto w-full max-w-7xl bg-white border border-slate-200 shadow-xl rounded-full px-6 py-4 sm:px-8 sm:py-4 flex justify-between items-center transition-all"
                >
                    {/* 로고 */}
                    <div
                        className={`flex flex-col items-start justify-center cursor-pointer transition-opacity duration-300 flex-shrink-0 group ${showLogo ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        onClick={goHome}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-4xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-emerald-500 from-[55%] via-indigo-500 via-[85%] to-violet-600 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 group-hover:brightness-110 pr-1">
                                속초고
                            </span>
                            <div className="flex items-end gap-0.5 ml-0">
                                {["오", "디", "세", "이"].map((char, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="w-1 h-1 rounded-full bg-violet-500 mb-0.5 shadow-sm shrink-0" />
                                        <span className="text-lg sm:text-2xl font-bold text-violet-600 tracking-tight group-hover:text-violet-700 transition-colors leading-none">
                                            {char}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className="text-[0.6rem] sm:text-[0.7rem] font-bold text-slate-400 tracking-[0.2em] uppercase ml-1 opacity-70 group-hover:opacity-100 transition-opacity mt-1">
                            프렙베이스캠프: 여러분의 진로성공 파트너
                        </span>
                    </div>

                    {/* 데스크탑 메뉴 */}
                    <div className="hidden lg:flex items-center gap-2 flex-1 ml-8">
                        <AppMenuBar />

                        {/* 홈 버튼 */}
                        <button
                            onClick={goHome}
                            className="ml-auto p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-95 group"
                            aria-label="Home"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* 모바일 햄버거 */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* 모바일 메뉴 오버레이 */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[90] bg-white/97 backdrop-blur-md pt-36 px-6 lg:hidden flex flex-col overflow-y-auto pb-20"
                    >
                        {/* 그룹별 렌더링 */}
                        {(Object.keys(MENUS) as MenuKey[]).map((key) => {
                            const menu = MENUS[key];
                            const c = colorMap[menu.color];

                            const mobileDropdownBlock = (
                                <div key={`mobile-dropdown-${key}`} className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                                        <p className={`text-[0.65rem] font-extrabold ${c.header} uppercase tracking-widest`}>{menu.label}</p>
                                    </div>
                                    {menu.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex flex-col px-3 py-3 rounded-xl mb-1 ${c.hover} transition-colors`}
                                        >
                                            <span className="text-base font-semibold text-slate-800">{item.label}</span>
                                            <span className={`text-xs mt-0.5 ${c.desc}`}>{item.desc}</span>
                                        </Link>
                                    ))}
                                </div>
                            );

                            return (
                                <Fragment key={key}>
                                    {mobileDropdownBlock}
                                    {/* 과세특 입력 (모바일 환경) */}
                                    {key === "project" && (
                                        <div className="mb-6">
                                            <Link href="/5d-gwasaeteuk" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-xl text-base font-bold text-slate-800 bg-white border-2 border-slate-800 shadow-sm">
                                                과세특 입력
                                            </Link>
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}

                        {/* 홈 */}
                        <div className="border-t border-slate-100 mt-4 pt-6 flex justify-center">
                            <button
                                onClick={goHome}
                                className="p-4 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                aria-label="Home"
                            >
                                <Home className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProgramGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
            <CoachingModal isOpen={showCoaching} onClose={() => setShowCoaching(false)} />
        </>
    );
}
