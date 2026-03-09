import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrepStore } from "@/lib/store";
import { QUESTIONS_INTERVIEW, QUESTIONS_STUDENT } from "@/lib/constants";

// import { HomeButton } from "@/components/common/home-button";

interface WizardLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    pageTitle?: string | ReactNode;
    pageDescription?: string | ReactNode;
    tipTitle?: string;
    tipContent?: ReactNode;
    theme?: 'emerald' | 'indigo' | 'purple' | 'rose';
    compact?: boolean;
}

export function WizardLayout({ children, title, description, pageTitle, pageDescription, tipTitle, tipContent, theme = 'emerald', compact = false }: WizardLayoutProps) {
    const { question, setQuestion, mode } = usePrepStore();

    // ... (useEffect remains same)

    const borderGradients = {
        emerald: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
        indigo: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500",
        purple: "bg-gradient-to-r from-purple-400 via-violet-500 to-fuchsia-400",
        rose: "bg-gradient-to-r from-rose-400 via-pink-400 to-red-400"
    };

    return (
        <div className={`relative pb-20 p-6 ${compact ? '' : 'min-h-screen'}`}>
            {/* <HomeButton /> */}

            <div className={`max-w-6xl mx-auto px-6 ${compact ? 'pt-0' : 'pt-52'}`}>
                {/* Page Header (Optional) - Global Page Title */}
                {(pageTitle || pageDescription) && (
                    <div className="text-center mb-10 space-y-4">
                        {pageTitle && (
                            <motion.div
                                initial={{ opacity: 0, y: -16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3"
                            >
                                {pageTitle}
                            </motion.div>
                        )}
                        {/* ... (description remains same) */}
                        {pageDescription && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed"
                            >
                                {pageDescription}
                            </motion.div>
                        )}
                        {/* Step Title & Description - tip 위 */}
                        {(title || description) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 }}
                                className="max-w-3xl mx-auto text-center"
                            >
                                <h2 className="text-2xl font-bold text-slate-800 mb-1">{title}</h2>
                                {description && (
                                    <p className="text-base text-slate-500">{description}</p>
                                )}
                            </motion.div>
                        )}
                        {(tipTitle || tipContent) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="max-w-3xl mx-auto rounded-xl bg-blue-50 border border-blue-100 p-5 text-left"
                            >
                                {tipTitle && (
                                    <p className="text-base font-bold flex items-center gap-2 mb-2 text-blue-700">
                                        💡 Tip: {tipTitle}
                                    </p>
                                )}
                                <div className="text-sm leading-relaxed text-blue-900">
                                    {tipContent}
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                <motion.div
                    // ... (animation props remain same)
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mx-auto text-center"
                >
                    {/* Question Context Display */}
                    {question && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 text-left w-full pl-2"
                        >
                            <div className="flex items-start gap-4">
                                <span className={`text-4xl font-handwriting font-bold -mt-2 drop-shadow-sm ${theme === 'indigo' ? 'text-indigo-500' : theme === 'purple' ? 'text-purple-500' : theme === 'rose' ? 'text-rose-500' : 'text-emerald-500'}`}>Q.</span>
                                <h3 className={`text-2xl font-bold leading-tight drop-shadow-sm ${theme === 'indigo' ? 'text-indigo-600' : theme === 'purple' ? 'text-purple-600' : theme === 'rose' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {question.q}
                                </h3>
                                <div className={`flex-1 h-px mt-4 ml-4 self-center ${theme === 'indigo' ? 'bg-indigo-200' : theme === 'purple' ? 'bg-purple-200' : theme === 'rose' ? 'bg-rose-200' : 'bg-emerald-200'}`} />
                            </div>
                        </motion.div>
                    )}

                    <div className="w-full overflow-hidden rounded-2xl bg-white p-8 shadow-2xl sm:p-12 text-left border border-slate-200 relative">
                        {/* Inner Glow */}
                        <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${borderGradients[theme]}`} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>


                </motion.div>
            </div>
        </div>
    );
}
