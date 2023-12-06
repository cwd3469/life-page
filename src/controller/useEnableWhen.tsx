'use client';
import { QuestionItemUiType } from '@_types/questionUiType';
import { useModelingQuestion } from './DataContext';
import { QuestionAnswerType } from './DataAnswerModeling';
import { useEffect, useState } from 'react';
import { QuestionEnableWhen } from 'firstchart-utils';
/** linkId 동일한 answer sheet  */

export const answerSheetFind = (sheets: QuestionAnswerType[], linkId?: string) => {
    if (!linkId) return [];
    let filterAnswer: QuestionAnswerType[] = [];

    for (let i = 0; i < sheets.length; i++) {
        const element = sheets[i];
        if (element.linkId === linkId) {
            filterAnswer = [...filterAnswer, element];
        }
        if (element.item) {
            const findChild = answerSheetFind(element.item, linkId);
            if (findChild.length) {
                filterAnswer = [...filterAnswer, ...findChild];
            }
        }
    }
    return filterAnswer;
};

export const answerSubSheetFind = (sheets: QuestionAnswerType[], linkId: string, groupId?: string) => {
    if (!groupId) return [];
    let filterAnswer: QuestionAnswerType[] = [];

    for (let i = 0; i < sheets.length; i++) {
        const element = sheets[i];
        if (element.text === groupId) {
            if (element.item) filterAnswer = answerSheetFind(element.item, linkId);
        } else {
            if (element.item) {
                const findChild = answerSubSheetFind(element.item, linkId, groupId);
                if (findChild.length) {
                    filterAnswer = [...filterAnswer, ...findChild];
                }
            }
        }
    }
    return filterAnswer;
};

//TODO: 추가 개발 할 예정
const useEnableWhen = (props: { item?: QuestionItemUiType; groupId?: string }) => {
    const { item, groupId } = props;
    const { openAnswerSheet, questionAnswer } = useModelingQuestion();
    const [isEnableWhen, setIsEnableWhen] = useState<boolean>(false);
    const [conditionAnswer, setConditionAnswer] = useState<QuestionAnswerType>();

    useEffect(() => {
        if (item) {
            if (item.enableWhen !== null) {
                setIsEnableWhen(true);
            }
        }
    }, [item]);

    useEffect(() => {
        if (item && item.enableWhen !== null) {
            const enableWhenCondition = item.enableWhen;
            const conditionVerify = (answerList: QuestionEnableWhen[]) => {
                let isPass = true;
                let sheet: QuestionAnswerType | undefined = undefined;

                for (let index = 0; index < answerList.length; index++) {
                    const element = answerList[index];
                    const findQuestion = element.question;
                    const linkId = findQuestion ? findQuestion : '';

                    const findAnswer = groupId
                        ? answerSubSheetFind(openAnswerSheet, linkId, groupId)
                        : answerSheetFind(openAnswerSheet, linkId);

                    const answerSheet = findAnswer.length && findAnswer[0];

                    if (answerSheet && answerSheet.answer) {
                        //유형 1. not exist
                        if (element.operator === 'exists') {
                            isPass = false;
                            sheet = answerSheet;
                        }
                        // 유형 2. equal
                        if (element.operator === '=') {
                            if (answerSheet.answer[0].valueCoding?.code === element.answerCoding?.code) {
                                isPass = false;
                                sheet = answerSheet;
                            }
                        }
                    }
                }
                return { isPass, sheet };
            };

            const condition = conditionVerify(enableWhenCondition);
            setIsEnableWhen(condition.isPass);
            setConditionAnswer(condition.sheet);
        }
    }, [item, questionAnswer]);

    useEffect(() => {
        if (item?.linkId === 'family-condition-sub') {
            console.log(isEnableWhen);
        }
    }, [isEnableWhen]);

    return { isEnableWhen, conditionAnswer };
};

export default useEnableWhen;
