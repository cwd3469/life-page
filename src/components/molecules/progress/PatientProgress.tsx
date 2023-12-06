'use client';
import { useModelingQuestion } from '../../../controller/DataContext';

const PatientProgress = () => {
    const { progress } = useModelingQuestion();
    const label = progress.label.split('/');
    const current = label.length ? label[0] : '';
    const total = label.length ? label[1] : '';
    return (
        <div className="py-[18px] px-4 flex flex-col gap-2 ">
            <div className="flex justify-between ">
                <p className="font-semibold text-sm text-[#484848] tracking-tight">
                    <span>문진 작성 진행율</span>
                    <span className="text-[#1ABCB7]  ml-2">{progress.percent}%</span>
                </p>
                <div className="leading-5	align-middle text-xs text-[#8F8F8F] px-2">
                    <span className="text-[#1ABCB7]">{current}</span>/<span>{total}</span>
                </div>
            </div>
            <div className="w-full bg-[#F7F7F7] rounded-full h-2">
                <div className="bg-[#1ABCB7] h-2 rounded-full" style={{ width: `${progress.percent}%` }}></div>
            </div>
        </div>
    );
};

export default PatientProgress;
