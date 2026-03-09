"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPoint() {
    const { setStep, updateData, data, question } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = question?.guide.point || "작성 예시: 저는 [핵심 학업 역량]을 바탕으로, 귀 학과의 [구체적 학문 분야] 연구에 기여하고 싶습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">핵심 결론 (Point)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-emerald-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}


            </div>

            <Button type="submit" className="w-full bg-blue-600 py-6 text-xl font-bold hover:bg-blue-700 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto text-white">
                다음 (이유 설명하기)
            </Button>

        </form>
    );
}
