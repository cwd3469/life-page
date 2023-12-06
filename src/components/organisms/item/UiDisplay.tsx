'use client';
import { Answer, QuestionAnswerType } from '../../../controller/DataAnswerModeling';
import { QuestionItemUiType } from '@_types/questionUiType';

export type ItemComponentProp = {
    item: QuestionItemUiType;
    answerSheet?: Answer[];
    groupId?: string;
};

const ItemUiDisplay = ({ item }: ItemComponentProp) => {
    if (item.itemExtension?.itemControl === 'help') {
        return (
            <div className="bg-[#FBFBFB] px-3 py-2 flex flex-row items-center gap-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path
                        fill="#B3B3B3"
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                    />
                </svg>
                <p className="text-sm text-[#6B6B6B] font-normal">{item.text}</p>
            </div>
        );
    }
    return (
        <div className="text-lg font-bold">
            {item.text} {item.itemExtension?.itemControl}
        </div>
    );
};

export default ItemUiDisplay;
