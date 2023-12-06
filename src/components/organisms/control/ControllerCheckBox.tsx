'use client';
import { CodingCommonProps } from '../item/UiCoding';
import { Coding } from '../../../controller/DataAnswerModeling';
import { useModelingQuestion } from '../../../controller/DataContext';
import { useEffect, useState } from 'react';
import { expressParsing } from '../../../controller/useExpressParsing';
import { useAnswerSheetAddOnEffect } from '../item/UiGroup';
import { QuestionItemUiMapping } from '../UiSectionPage';
import { QuestionItemUiType } from '@/types/questionUiType';

type CheckBoxChildItemGroupProps = {
    itemResource: QuestionItemUiType;
    code: string;
    maxIndex: number;
};

const CheckBoxChildItemGroup = ({ itemResource, code, maxIndex }: CheckBoxChildItemGroupProps) => {
    useAnswerSheetAddOnEffect({ item: itemResource, currentGroupId: code });

    return <QuestionItemUiMapping uiData={itemResource.item} groupId={code} isFirstItem />;
};

/** check box question 밑에 item question이 있으면 체크 박스 1개당 1개의 question으로 인식 하고 자식 요소로 노출 한다. */
/** useCheckBoxChildItem
 * component 생성 기능
 * @param  { item: QuestionItemUiType[] | null }
 * @returns {keyComponent: Map<string, JSX.Element>}
 */
const useCheckBoxChildItem = ({ item }: { item: QuestionItemUiType[] | null }) => {
    const { openAnswerSheet, questionAnswer } = useModelingQuestion();
    const [keyComponent, setKeyComponent] = useState<Map<string, JSX.Element>>(new Map());
    const [itemResource, setItemResource] = useState<QuestionItemUiType>();

    useEffect(() => {
        if (item && item.length) setItemResource(item[0]);
    }, [item]);

    useEffect(() => {
        if (
            itemResource &&
            itemResource.itemExtension?.expression &&
            itemResource.itemExtension.itemControl === 'list'
        ) {
            const expressAnswer = expressParsing(itemResource.itemExtension?.expression, openAnswerSheet);

            if (expressAnswer) {
                const componentMap: Map<string, JSX.Element> = new Map();
                const sheetLength = expressAnswer.answerSheetCode.length;

                for (let index = 0; index < sheetLength; index++) {
                    const code = expressAnswer.answerSheetCode[index];
                    const component = (
                        <CheckBoxChildItemGroup itemResource={itemResource} code={code} maxIndex={sheetLength} />
                    );
                    componentMap.set(code, component);
                }

                setKeyComponent(componentMap);
            }
        }
    }, [itemResource, questionAnswer]);

    return { keyComponent };
};

const ControlCheckBox = ({
    item,
    code,
    handleFilter,
    answerFillOut,
    filter,
    itemAnswer,
    itemLinkId,
}: CodingCommonProps) => {
    const { keyComponent } = useCheckBoxChildItem({ item: item.item });
    const handleChange = (value: string) => {
        const valueCoding: Coding = JSON.parse(value);
        answerFillOut(valueCoding);
    };
    const checkValue = (code?: string) => {
        if (!code) return;
        const check = itemAnswer ? itemAnswer.filter((el) => el.valueCoding?.code === code) : [];
        return check.length ? true : false;
    };

    return (
        <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">{item.text}</p>
            {code.map((element, index) => {
                return (
                    <div key={index}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="inline-flex items-center">
                                <label
                                    className="relative flex items-center  rounded-full cursor-pointer"
                                    htmlFor={itemLinkId + index}
                                >
                                    <input
                                        type={'checkbox'}
                                        className="peer relative h-6 w-6 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all  checked:border-mint600 checked:bg-mint600"
                                        value={JSON.stringify(element)}
                                        onChange={(e) => handleChange(e.target.value)}
                                        checked={checkValue(element.code)}
                                        id={itemLinkId + index}
                                        disabled={item.readOnly === null ? false : item.readOnly}
                                    />
                                    <div className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <label
                                htmlFor={itemLinkId + index}
                                className="cursor-pointer  block text-sm font-medium leading-6 text-gray-900"
                            >
                                {element.display}
                            </label>
                        </div>
                        {item.item && element.code && keyComponent && keyComponent.get(element.code)}
                    </div>
                );
            })}
        </div>
    );
};

export default ControlCheckBox;
