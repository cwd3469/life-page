'use client';
import { QuestionAnswerType } from './DataAnswerModeling';
import { answerSheetFind, answerSubSheetFind } from './useEnableWhen';

/** expression를 파싱 기능
 * ex  "%resource.repeat(item).where(linkId='current-problem-select').answer.valueCoding.code"
 * "%resource.repeat(item).where(*).answer.valueCoding.code"
 * "%resource.repeat(item).where(*).answer.valueQuantity.value"
 * "%resource.repeat(item).where(*).answer.*"
*  const regArray = [
    /(?<=%resource.repeat(\()item(\)).where(\())(.*?)(?=(\))(\.)answer.valueCoding.code)/g,
    /(?<=%resource.repeat(\()item(\)).where(\())(.*?)(?=(\))(\.)item.answer.valueQuantity)/g,
  ];
  const reg = /(?<=linkId=')(.*?)(?=')/g;
 */
export const expressParsing = (
    expression: string | null | undefined,
    openSheet: QuestionAnswerType[],
    groupId?: string
) => {
    if (!expression) return;
    const regArray = [
        /(?<=resource.repeat(\()item(\)).where(\())(.*?)(?=(\))(\.)item.answer.valueQuantity)/g,
        /(?<=resource.repeat(\()item(\)).where(\())(.*?)(?=(\))(\.)answer.valueCoding.code)/g,
    ];

    const answerSheetText: string[] = [];
    const answerSheetCode: string[] = [];
    let answerLinkId: string[] = [];
    for (let k = 0; k < regArray.length; k++) {
        const element = regArray[k];
        const findId = expression.match(element);
        const valueSet = expression.match(/(?<='(\).))(.*)?/g);
        const linkArr = findId && findId[0].match(/(?<=linkId=')(.*?)(?=')/g);
        if (linkArr && linkArr.length) {
            answerLinkId = linkArr;
            for (let i = 0; i < linkArr.length; i++) {
                const linkId = linkArr[i];
                const answerSheet = groupId
                    ? answerSubSheetFind(openSheet, linkId, groupId)
                    : answerSheetFind(openSheet, linkId);
                const filterGroupId = answerSheet;

                if (filterGroupId.length && filterGroupId[0].answer) {
                    const answerObj = filterGroupId[0].answer;
                    const checkValue = valueSet ? valueSet[0].indexOf('valueCoding') : -1;
                    for (let l = 0; l < answerObj.length; l++) {
                        const elItem = answerObj[l];
                        const answerText = checkValue > 0 ? elItem.valueCoding?.display : elItem.valueQuantity?.value;
                        const answerCode = checkValue > 0 ? elItem.valueCoding?.code : elItem.valueQuantity?.code;
                        if (answerText) answerSheetText.push(answerText);
                        if (answerCode) answerSheetCode.push(answerCode);
                    }
                }
            }
        }
    }
    return { answerSheetText, answerSheetCode, answerLinkId };
};
