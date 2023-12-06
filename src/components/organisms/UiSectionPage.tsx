'use client';
import { QuestionItemUiType } from '@/types/questionUiType';
import { useModelingQuestion } from '../../controller/DataContext';
import ItemUiText from './item/UiText';
import ItemUiString from './item/UiString';
import ItemUiQuantity from './item/UiQuantity';
import ItemUiInteger from './item/UiInteger';
import ItemUiDisplay, { ItemComponentProp } from './item/UiDisplay';
import ItemUiAttachment from './item/UiAttachment';
import QuestionnaireHead from './layout/Head';
import ItemUiGroup from './item/UiGroup';
import useEnableWhen, { answerSheetFind, answerSubSheetFind } from '../../controller/useEnableWhen';
import { useEffect, useState } from 'react';
import { Answer, QuestionAnswerType } from '../../controller/DataAnswerModeling';
import { cn } from '../../utils/twMerge';
import { cva } from 'class-variance-authority';
import ItemUiCoding from './item/UiCoding';
import QuestionnaireContainer, { ModifyContainer } from './layout/Container';
type ItemType = 'text' | 'string' | 'coding' | 'quantity' | 'integer' | 'display' | 'group' | 'attachment';

export const ItemStateCheckBtn = (props: { item: QuestionItemUiType; groupId?: string; answer?: Answer[] }) => {
    const { item, answer, groupId } = props;

    const handleButton = () => {
        console.log(item);
    };
    const isDev = false;
    if (process.env.NODE_ENV === 'development' && isDev) {
        return (
            <button onClick={handleButton} className="border border-red-300 p-1 rounded-md gap-1 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                        fillRule="evenodd"
                        d="M17.768 7.793a.75.75 0 01-1.06-.025L12.75 3.622v10.003a5.375 5.375 0 01-10.75 0V10.75a.75.75 0 011.5 0v2.875a3.875 3.875 0 007.75 0V3.622L7.293 7.768a.75.75 0 01-1.086-1.036l5.25-5.5a.75.75 0 011.085 0l5.25 5.5a.75.75 0 01-.024 1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        );
    }
    return <></>;
};

export const QuestionItemUiVariants = cva('', {
    variants: {
        isFirstItemCheck: {
            check: 'p-4 bg-white border border-solid border-[#F0F0F0] rounded-2xl',
        },
    },
});

/** ItemUiList item list 컴포넌트
 * @function item type에 따른 컴포넌트 호출
 * @returns JSX.Element
 */
const ItemUiList = (props: { item: QuestionItemUiType; groupId?: string; isFirstItem?: boolean }) => {
    const { item, groupId, isFirstItem } = props;
    const { questionIndex, questionAnswer } = useModelingQuestion();
    const [itemResource, setItemResource] = useState<QuestionItemUiType>();
    const [answerSheet, setAnswerSheet] = useState<Answer[]>();
    const [itemGroupIndex, setItemGroupIndex] = useState<string>();
    const { isEnableWhen } = useEnableWhen({
        item: itemResource,
        groupId: itemGroupIndex,
    });
    useEffect(() => {
        if (questionAnswer === null || !itemResource || itemResource.linkId === null) return;
        /** question answer Set 이벤트 */
        const setSheet = (questionSheet: QuestionAnswerType[]) => {
            if (questionSheet.length && questionSheet[0].answer && questionSheet[0].answer.length) {
                const answerSection = questionSheet[0].answer;
                setAnswerSheet(answerSection);
                return;
            }
            setAnswerSheet(undefined);
        };

        const itemLinkId = itemResource.linkId;
        const openAnswerSheet = [...questionAnswer[questionIndex]];
        // 'linkId'가 동일한 question sheet
        const sheets = [...answerSheetFind(openAnswerSheet, itemLinkId)];
        // 'group Id'가 동일한 question sheet
        const subSheets = [...answerSubSheetFind(openAnswerSheet, itemLinkId, itemGroupIndex)];
        setSheet(itemGroupIndex ? subSheets : sheets);
    }, [questionAnswer, itemResource, itemGroupIndex]);

    useEffect(() => {
        if (typeof groupId === 'string') setItemGroupIndex(groupId);
    }, [groupId]);

    useEffect(() => {
        setItemResource(item);
    }, [item]);

    useEffect(() => {
        return () => {
            setItemResource(undefined);
            setAnswerSheet([]);
            setItemGroupIndex(undefined);
        };
    }, []);

    if (isEnableWhen || !itemResource) return <></>;

    const itemProps: ItemComponentProp = {
        item: itemResource,
        groupId: itemGroupIndex,
        answerSheet,
    };

    const ItemTypeObj: { [key: string]: JSX.Element | undefined } = {
        text: <ItemUiText {...itemProps} />,
        string: <ItemUiString {...itemProps} />,
        quantity: <ItemUiQuantity {...itemProps} />,
        integer: <ItemUiInteger {...itemProps} />,
        display: <ItemUiDisplay {...itemProps} />,
        attachment: <ItemUiAttachment {...itemProps} />,
        coding: <ItemUiCoding {...itemProps} />,
        group: <ItemUiGroup {...itemProps} />,
    };

    if (item.type === null) return <></>;
    const firstStyle = cn(QuestionItemUiVariants({ isFirstItemCheck: isFirstItem ? 'check' : undefined }));
    const style =
        item.type === 'group' && item.itemExtension && item.itemExtension.itemControl === 'list' ? '' : firstStyle;
    return (
        <div className={`${style} mb-4`}>
            {ItemTypeObj[item.type]}
            <ItemStateCheckBtn item={itemResource} groupId={itemGroupIndex} answer={answerSheet} />
        </div>
    );
};

type QuestionItemUiMappingProps = {
    uiData: QuestionItemUiType[] | null;
    groupId?: string;
    isFirstItem?: boolean;
};

/** QuestionItemUiMapping 컴포넌트 매핑
 * @function 재귀함수를 이용하기 위한 재사용 컴포넌트
 * @returns JSX.Element
 */
export const QuestionItemUiMapping = (props: QuestionItemUiMappingProps) => {
    const { uiData, groupId, isFirstItem } = props;

    if (uiData === null) return <></>;
    return uiData.map((item, index) => {
        const linkId = item.linkId ? item.linkId : '';
        const isItemCheckBox =
            item.type === 'coding' && item.itemExtension && item.itemExtension.itemControl === 'check-box' && item.item
                ? true
                : false;

        return (
            <div key={index + linkId}>
                <ItemUiList item={item} groupId={groupId} isFirstItem={isFirstItem} />

                {item.type !== 'group' && !isItemCheckBox && item.item && (
                    <QuestionItemUiMapping uiData={item.item} groupId={groupId} />
                )}
            </div>
        );
    });
};
/** QuestionUiSection 최상위 컴포넌트
 * @function 데이터 주입 기능
 * @returns JSX.Element
 */
const QuestionUiSection = () => {
    const { uiData } = useModelingQuestion();
    if (!uiData.length) return <></>;
    const topItem = uiData[0];
    return (
        <QuestionnaireContainer>
            <div className="flex flex-col">
                {topItem.isTop && <QuestionnaireHead item={topItem} />}
                <div className="flex flex-col px-4 py-4">
                    <QuestionItemUiMapping uiData={topItem.item} isFirstItem />
                </div>
            </div>
        </QuestionnaireContainer>
    );
};

/** QuestionModify 최상위 컴포넌트
 * @function 데이터 주입 기능
 * @returns JSX.Element
 */
export const QuestionModify = () => {
    const { uiData } = useModelingQuestion();
    if (!uiData.length) return <></>;
    const topItem = uiData[0];
    return (
        <ModifyContainer>
            <div className="flex flex-col">
                {topItem.isTop && <QuestionnaireHead item={topItem} />}
                <div className="flex flex-col px-4 py-4">
                    <QuestionItemUiMapping uiData={topItem.item} isFirstItem />
                </div>
            </div>
        </ModifyContainer>
    );
};

export default QuestionUiSection;
