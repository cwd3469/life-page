'use client';
import { QuestionItemUiMapping } from '../UiSectionPage';
import { useModelingQuestion } from '../../../controller/DataContext';
import { ItemComponentProp } from './UiDisplay';
import { expressParsing } from '../../../controller/useExpressParsing';
import { useEffect, useState } from 'react';
import { QuestionItemUiType } from '@/types/questionUiType';
import { overlapGroupId } from '../../../utils/transformLinkId';
import { DeleteBtnIcon } from '../../molecules/button/FCButton';

const ItemUiGroupTable = ({ item }: ItemComponentProp) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {item.item !== null && <QuestionItemUiMapping uiData={item.item} />}
        </div>
    );
};
const ItemUiGroupContents = ({ item }: ItemComponentProp) => {
    return (
        <div className="flex flex-col gap-3">{item.item !== null && <QuestionItemUiMapping uiData={item.item} />}</div>
    );
};
//TODO: 추가 개발 할 예정

type UseAnswerSheetAddOnEffectType = {
    item: QuestionItemUiType;
    currentGroupId: string;
    parentGroupId?: string;
};

/** Answer 추가 기능
 * 해당 question component 생성 시 answer 추가 기능
 * @param UseAnswerSheetAddOnEffectType
 */
export const useAnswerSheetAddOnEffect = ({ item, currentGroupId, parentGroupId }: UseAnswerSheetAddOnEffectType) => {
    const { addAnswerSheet } = useModelingQuestion();

    useEffect(() => {
        if (item.linkId && currentGroupId) addAnswerSheet({ linkId: item.linkId, currentGroupId, parentGroupId });
    }, [item, currentGroupId]);
};

type ItemUiGroupType = {
    item: QuestionItemUiType;
    groupTitle?: string;
    referencedQuestion: string[];
    parentGroupId?: string;
    currentGroupId: string;
};

/** Question Resource Component
 * @type group
 * @itemController list
 * @param ItemUiGroupType
 * @returns JSX.Element
 */
export const ControlTable = ({
    item,
    groupTitle,
    currentGroupId,
    referencedQuestion,
    parentGroupId,
}: ItemUiGroupType) => {
    const { deleteAnswerSheet } = useModelingQuestion();

    const depthGroupId = overlapGroupId({ parentGroupId, groupId: currentGroupId });
    const deleteAnswer = () => {
        if (!referencedQuestion.length) return;
        const mainId = referencedQuestion[0];
        deleteAnswerSheet && deleteAnswerSheet({ mainId, currentGroupId, parentGroupId });
    };
    useAnswerSheetAddOnEffect({ item, currentGroupId, parentGroupId });

    return (
        <div className="relative flex flex-col gap-3 border border-solid bg-TG000 border-[#E1E1E1] shadow-sm	rounded-xl	p-4">
            <div className="flex flex-row justify-between items-center">
                <div className="text-lg font-bold">{groupTitle}</div>
                <button onClick={deleteAnswer}>
                    <DeleteBtnIcon />
                </button>
            </div>
            {item.item !== null && <QuestionItemUiMapping uiData={item.item} groupId={depthGroupId} />}
        </div>
    );
};
/** Question Resource Component
 * @type group
 * @param ItemComponentProp
 * @returns JSX.Element
 */
const ItemUiGroup = ({ item, answerSheet, groupId }: ItemComponentProp) => {
    const { openAnswerSheet, questionAnswer } = useModelingQuestion();
    const [referencedQuestion, setReferencedQuestion] = useState<{
        answerSheetText: string[];
        answerLinkId: string[];
        answerSheetCode: string[];
    }>();

    useEffect(() => {
        if (item.itemExtension?.expression) {
            const expressAnswer = expressParsing(item.itemExtension?.expression, openAnswerSheet, groupId);
            if (expressAnswer) {
                setReferencedQuestion(expressAnswer);
            }
        }
    }, [item, questionAnswer]);

    const itemControl = item.itemExtension?.itemControl;
    switch (itemControl) {
        case 'list':
            return (
                <div className="flex flex-col gap-4">
                    {referencedQuestion &&
                        referencedQuestion.answerSheetText.map((element, index) => {
                            const code = referencedQuestion.answerSheetCode[index];
                            const parentGroupId = groupId;

                            return (
                                <ControlTable
                                    item={item}
                                    key={index}
                                    groupTitle={element}
                                    currentGroupId={code}
                                    referencedQuestion={referencedQuestion.answerLinkId}
                                    parentGroupId={parentGroupId}
                                />
                            );
                        })}
                </div>
            );
        case 'table':
            return <ItemUiGroupTable item={item} answerSheet={answerSheet} />;
        default:
            return <ItemUiGroupContents item={item} answerSheet={answerSheet} />;
    }
};

export default ItemUiGroup;
