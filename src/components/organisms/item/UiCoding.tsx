'use client';
import { useEffect, useState } from 'react';
import { useModelingQuestion } from '../../../controller/DataContext';
import ControlAutocomplete from '../control/ControllerAutocomplete';
import { ItemComponentProp } from './UiDisplay';
import { Answer, Coding } from '../../../controller/DataAnswerModeling';
import getTerminologyCode, { GetTerminologyCodeParams } from '../../../api/getTerminologyCode';
import ControlRadiusButton from '../control/ControllerRadiusButton';
import { answerSheetFind, answerSubSheetFind } from '../../../controller/useEnableWhen';
import ControlCheckBox from '../control/ControllerCheckBox';
import { QuestionItemUiType } from '@/types/questionUiType';

export type CodingCommonProps = {
    item: QuestionItemUiType;
    code: Coding[];
    handleFilter: (text: string | undefined) => void;
    filter?: string;
    answerFillOut: (result: Coding | undefined) => void;
    itemAnswer?: Answer[];
    itemLinkId: string;
};

const ItemUiCoding = ({ item, groupId, answerSheet }: ItemComponentProp) => {
    const { terminologyServer, fillingOutAnswerSheet, openAnswerSheet, deleteAnswerSheet } = useModelingQuestion();
    const itemLinkId = item.linkId ? item.linkId + groupId : 'ItemUiCoding-' + groupId;
    const itemAnswer = answerSheet && answerSheet.length ? answerSheet : undefined;
    const [filter, setFilter] = useState<string | undefined>();
    const [terminologyCode, setTerminologyCode] = useState<Coding[]>([]);
    const handleFilter = (value: string | undefined) => {
        setFilter(value);
    };

    /** 질문 저장 기능 */
    const answerFillOut = (result: Coding | undefined) => {
        if (!result || !fillingOutAnswerSheet || item.type === null || item.linkId === null) return;
        // valueCoding value
        const value: Answer = {
            valueCoding: {
                code: result.code,
                system: result.system,
                display: result.display,
            },
        };
        // 이미 저장되어져 있는 answer value 존재 참조
        const referenceSheet = groupId
            ? answerSubSheetFind(openAnswerSheet, item.linkId, groupId)
            : answerSheetFind(openAnswerSheet, item.linkId);
        // 이미 저장되어져 있는 answer value
        let answer: Answer[] =
            referenceSheet.length && referenceSheet[0].answer && referenceSheet[0].answer.length
                ? [...referenceSheet[0].answer]
                : [];
        // 저장된 answer 변수에서 같은 값 확인
        const isSameValue =
            answer.length && answer.filter((el) => el.valueCoding?.code === result?.code).length ? true : false;

        if (item.repeats) {
            // item repeats 기능이 있을 경우
            answer = [...answer, value];
        } else {
            // item repeats 기능이 없을 경우
            answer = [value];
        }
        if (isSameValue) {
            //autocomplete가 아닐 경우 answer에서 중복된 값을 다 삭제하고 저장 -> Toggle
            if (item.itemExtension && item.itemExtension.itemControl !== 'autocomplete') {
                const answerFilter = answer.filter((el) => el.valueCoding?.code !== result?.code);
                answer = answerFilter;
                deleteAnswerSheet &&
                    deleteAnswerSheet({
                        mainId: item.linkId,
                        currentGroupId: result?.code,
                    });
            } else {
                //autocomplete일 경우 answer에서 중복된 값만 삭제하고 저장
                const uniqueObjArr = [
                    ...new Map(answer.map((obj) => [obj.valueCoding ? obj.valueCoding.code : '', obj])).values(),
                ];
                answer = uniqueObjArr;
            }
        }
        fillingOutAnswerSheet({ linkId: item.linkId, value: answer, groupId });
    };

    /** control props 공통 데이터 */
    const controlData: CodingCommonProps = {
        item,
        code: terminologyCode,
        handleFilter,
        answerFillOut,
        filter,
        itemAnswer,
        itemLinkId,
    };

    // 용어 서버 데이터 패칭
    useEffect(() => {
        const onlyKo = /^[ㄱ-ㅎ가-힣]+$/;
        // 용어 서버 api 요청 기능
        const reqTerminologyCode = async (query: GetTerminologyCodeParams) => {
            const data = await getTerminologyCode(query);
            const contains: Coding[] = data.data.expansion.contains;
            setTerminologyCode(contains ? contains : []);
        };
        // api 요청 기능
        const apiRequest = async () => {
            if (typeof terminologyServer !== 'string' || item.answerValueSet === null) return;
            const query: GetTerminologyCodeParams = {
                terminologyServer: terminologyServer,
                answerValueSet: item.answerValueSet,
            };
            // autocomplete는 filter가 적용
            if (item.itemExtension?.itemControl === 'autocomplete') {
                if (typeof filter === 'string') {
                    const checkNumber = onlyKo.test(filter) ? 2 : 3;
                    if (filter.length >= checkNumber) {
                        query['filter'] = filter;
                        reqTerminologyCode(query);
                    } else {
                        setTerminologyCode([]);
                    }
                }
            } else {
                reqTerminologyCode(query);
            }
        };

        apiRequest();
    }, [filter, item]);

    // item controller별로 component 지정
    const itemControlComponent: { [key: string]: JSX.Element } = {
        autocomplete: (
            <ControlAutocomplete
                code={controlData.code}
                onSearch={(keyword) => controlData.handleFilter(keyword)}
                onSelect={controlData.answerFillOut}
                label={item.text === null ? undefined : item.text}
                name={item.linkId}
            />
        ),
        'radio-button': <ControlRadiusButton {...controlData} />,
        'check-box': <ControlCheckBox {...controlData} />,
    };

    if (item.itemExtension !== null && item.itemExtension.itemControl !== null) {
        const itemControl = item.itemExtension.itemControl;
        return <div>{itemControlComponent[itemControl]}</div>;
    }
    return <div></div>;
};

export default ItemUiCoding;
