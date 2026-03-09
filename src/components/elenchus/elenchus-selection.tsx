"use client";

import { motion } from "framer-motion";
import { ElenchusCategory, useElenchusStore } from "@/lib/elenchus-store";

const CATEGORIES: { key: ElenchusCategory; label: string; desc: string; icon: string }[] = [
    { key: 'DREAM', label: 'Dream (꿈/목표)', desc: '내가 이 전공·학교를 선택한 이유는 무엇인가요?', icon: '🌟' },
    { key: 'DIFFICULTY', label: 'Difficulty (고난)', desc: '가장 힘들었던 순간, 어떻게 극복했나요?', icon: '🧗' },
    { key: 'TREND', label: 'trenD (시대 통찰)', desc: '세상의 변화 속에서 내가 발견한 기회는?', icon: '📈' },
    { key: 'STAND', label: 'branD (나만의 브랜드)', desc: '나를 한 줄로 표현한다면? 나만의 강점은?', icon: '🚩' },
    { key: 'DIFFERENT', label: 'Different (차별성)', desc: '다른 지원자들과 나를 구별하는 결정적 한 끗은?', icon: '💎' },
];

export function ElenchusSelection() {
    const { setCategory, setStep } = useElenchusStore();

    const handleSelect = (key: ElenchusCategory) => {
        setCategory(key);
        setStep(1); // Move to Definition Step
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {CATEGORIES.map((cat, idx) => (
                <motion.button
                    key={cat.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(cat.key)}
                    className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-100 hover:border-trust-navy transition-all group"
                >
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {cat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-trust-navy mb-3 transition-colors">
                        {cat.label}
                    </h3>
                    <p className="text-slate-500 group-hover:text-slate-600 transition-colors leading-relaxed">
                        {cat.desc}
                    </p>
                </motion.button>
            ))}
        </div>
    );
}
