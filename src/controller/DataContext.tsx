'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import QuestionnaireDataModeling from './DataModeling';

import QuestionnaireDataAnswerModeling, {
    QuestionnaireResponseType,
    type Answer,
    type QuestionAnswerType,
} from './DataAnswerModeling';
import { expressParsing } from './useExpressParsing';
import { overlapGroupId } from '../utils/transformLinkId';
import { answerSheetFind } from './useEnableWhen';
import { PageRouter } from '@/components/templates/QuestionTemplates';
import { QuestionnaireDataBundle } from '@/types/questionTypes';
import { QuestionItemUiType } from '@/types/questionUiType';

type Props = {
    children: JSX.Element | JSX.Element[];
    questionData?: QuestionnaireDataBundle;
    questionIndex: number;
    router?: PageRouter;
};

type DeleteAnswerParams = {
    /**enableWhen 조건의 question에 answer에 linkId 값 */
    mainId: string;
    /**enableWhen 조건의 question에 answer 값에 code 값 */
    currentGroupId?: string;
    parentGroupId?: string;
};

type AddAnswerSheetParams = {
    linkId: string;
    currentGroupId: string;
    parentGroupId?: string;
};

type AddAnswerMappingParams = { addOnAnswer: QuestionAnswerType; openSheets: QuestionAnswerType[] };

export type QuestionPagiNation = 'questionnaire' | 'preview' | 'modify' | 'completion' | 'already';

type ContextState = {
    uiData: QuestionItemUiType[];
    questionIndex: number;
    totalNumber: number;
    isStart: boolean;
    isEnd: boolean;
    isSuccess: boolean;
    progress: { percent: number; label: string };
    router?: PageRouter;
    terminologyServer: string | null | undefined;
    answerValueSet?: { [key: string]: Answer };
    fillingOutAnswerSheet?: (props: { linkId: string; value: Answer[]; groupId?: string }) => void;
    deleteAnswerSheet?: (params: DeleteAnswerParams) => void;
    questionAnswer: QuestionAnswerType[][] | null;
    openAnswerSheet: QuestionAnswerType[];
    addAnswerSheet: (params: AddAnswerSheetParams) => void;
    variable: { [key: string]: string };
    questionPagiNation: QuestionPagiNation;
    handleQuestionPagination: (page: QuestionPagiNation) => void;
    answerSheetReset: () => void;
    answerSheetInit: (sheets?: QuestionAnswerType[]) => void;
    resourceList: QuestionnaireResponseType | undefined;
};

const QuestionModelingContext = createContext<ContextState>({
    uiData: [],
    questionIndex: 0,
    totalNumber: 0,
    isStart: false,
    isEnd: false,
    isSuccess: false,
    progress: { percent: 0, label: '' },
    terminologyServer: '',
    questionAnswer: null,
    openAnswerSheet: [],
    addAnswerSheet: (params: AddAnswerSheetParams) => undefined,
    variable: {},
    questionPagiNation: 'questionnaire',
    handleQuestionPagination: (page: QuestionPagiNation) => undefined,
    answerSheetReset: () => undefined,
    answerSheetInit: (sheets?: QuestionAnswerType[]) => undefined,
    resourceList: undefined,
});

export const QuestionModelingProvider = (props: Props) => {
    const { children, questionData, questionIndex, router } = props;
    const [questionPagiNation, setQuestionPagiNation] = useState<QuestionPagiNation>('questionnaire');
    /** ui 리소스 데이터 모델링 */
    const uiResourceList = new QuestionnaireDataModeling({ data: questionData });
    /** ui 리소스 데이터 */
    const uiResources = uiResourceList.convertToData();
    /** ui data state */
    const [uiData, setData] = useState<QuestionItemUiType[]>([]);

    const [terminologyServer, setTerminologyServer] = useState<string>('');
    /** ui 총 데이터 questionnaire number */
    const totalNumber = uiResources.length - 1;
    /** 데이터 업데이터 성공 판단 */
    const isSuccess = uiData.length ? true : false;
    /** ui question 첫번째 페이지 판단  */
    const isStart = questionIndex === 0;
    /** ui question 마지막 페이지 판단  */
    const isEnd = totalNumber === questionIndex;

    useEffect(() => {
        const uiList = uiResources[questionIndex];
        setData(uiList);
    }, [questionIndex]);

    useEffect(() => {
        const terminology = isSuccess ? uiData[0].itemExtension?.terminologyServer : '';
        if (terminology) setTerminologyServer(terminology);
    }, [uiData]);

    /** answer 데이터 모델링 */
    const answerSection = new QuestionnaireDataAnswerModeling({ data: questionData });
    /** answer 데이터 */
    const answerData = answerSection.convertToDataAnswer();
    /** answer valueSet 데이터 */
    const answerValueSet = answerSection.convertToValueSet();
    /** answer state */
    const [questionAnswer, setQuestionAnswer] = useState<QuestionAnswerType[][] | null>(null);
    /** variable answer state */
    const [variable, setVariable] = useState<{ [key: string]: string }>({});

    const [initAnswer, setInitAnswer] = useState<QuestionAnswerType[]>([]);
    /** answer 현재페이지의 answer sheet */
    const openAnswerSheet = questionAnswer ? questionAnswer[questionIndex] : [];

    const resourceList = answerSection.convertToDataResource(questionAnswer);

    useEffect(() => {
        setQuestionAnswer(answerData);
        setInitAnswer(answerData[questionIndex]);
    }, []);

    useEffect(() => {
        if (questionAnswer) {
            const init = questionAnswer[questionIndex];
            setInitAnswer(init);
        }
    }, [questionIndex]);

    useEffect(() => {
        /**공통 용어 서버 데이터 */
        /** 추가 개발 할 예정 전체 페이지 서칭이 필요 */
        const commonVariable = isSuccess && uiData[0].itemExtension?.variable;

        if (commonVariable) {
            for (const iterator of commonVariable.entries()) {
                const key = iterator[0];
                const expression = iterator[1];

                const search = expressParsing(expression, openAnswerSheet);
                if (search) {
                    const searchValue = search.answerSheetText.length ? search.answerSheetText[0] : '';
                    setVariable((prev) => {
                        return { ...prev, [key]: searchValue };
                    });
                }
            }
        }
    }, [uiData, questionAnswer]);

    const answerSheetInit = (sheets?: QuestionAnswerType[]) => {
        if (sheets) setInitAnswer(sheets);
    };

    const answerSheetReset = () => {
        setQuestionAnswer((prev) => {
            if (prev === null) return prev;
            const answerSheets = prev;
            answerSheets[questionIndex] = initAnswer;
            return prev;
        });
    };

    /** 프로그레스 props 데이터 */
    const progress = {
        percent: Math.round((questionIndex / totalNumber) * 100),
        label: `${questionIndex + 1} / ${totalNumber + 1}`,
    };

    const handleQuestionPagination = (page: QuestionPagiNation) => {
        setQuestionPagiNation(page);
    };

    /** addAnswerMapping question answer에서 위치 확인 후 저장 기능
     * @param AddAnswerMappingParams
     */
    const addAnswerMapping = (params: AddAnswerMappingParams) => {
        const { addOnAnswer, openSheets } = params;
        let isSameAnswer = false;
        const addAnswer = { ...addOnAnswer };
        const baseAnswers: QuestionAnswerType[] = openSheets;
        const changeAnswer: QuestionAnswerType[] = baseAnswers.map((element, index) => {
            if (element.linkId === addAnswer.linkId) isSameAnswer = true;
            if (element.item) element.item = addAnswerMapping({ addOnAnswer: addAnswer, openSheets: element.item });
            return element;
        });

        return isSameAnswer ? [...changeAnswer, addAnswer] : changeAnswer;
    };

    /** addAnswerMapping question answer에서 위치 확인 후 저장 기능
     * @param AddAnswerMappingParams
     * @param parentGroupId string
     */
    const addSubAnswerMapping = (
        params: AddAnswerMappingParams & {
            parentGroupId: string;
        }
    ) => {
        const { addOnAnswer, openSheets, parentGroupId } = params;
        const addAnswer = { ...addOnAnswer };
        const baseAnswers: QuestionAnswerType[] = openSheets;
        const changeAnswer: QuestionAnswerType[] = baseAnswers.map((element, index) => {
            if (element.text === parentGroupId) {
                if (element.item) element.item = addAnswerMapping({ addOnAnswer: addAnswer, openSheets: element.item });
            } else {
                if (element.item)
                    element.item = addSubAnswerMapping({
                        addOnAnswer: addAnswer,
                        openSheets: element.item,
                        parentGroupId,
                    });
            }

            return element;
        });

        return changeAnswer;
    };
    /** addAnswerSheet question answer 추가 저장 기능
     * @param linkId string
     * @param AddAnswerSheetParams
     */
    const addAnswerSheet = (params: AddAnswerSheetParams) => {
        const { linkId, currentGroupId, parentGroupId } = params;
        const depthGroupId = overlapGroupId({ parentGroupId, groupId: currentGroupId });

        setQuestionAnswer((prev) => {
            if (prev === null) return prev;
            const sheetList = prev.map((el, index) => {
                const element: QuestionAnswerType[] = el;
                const sheet = [...answerSheetFind(element, linkId)];
                if (!sheet.length) return element;
                const isDuplication = sheet.length ? sheet.filter((el) => el.text === depthGroupId) : [];
                if (isDuplication.length) return element;
                const addOnAnswer: QuestionAnswerType = { ...sheet[0] };
                if (!addOnAnswer['text']) addOnAnswer['text'] = depthGroupId;
                const fillingOutAnswer = parentGroupId
                    ? addSubAnswerMapping({ addOnAnswer, openSheets: element, parentGroupId })
                    : addAnswerMapping({ addOnAnswer, openSheets: element });
                return fillingOutAnswer;
            });

            return sheetList;
        });
    };

    //TODO: 추가개발 할 예정
    /** questionnaire answer에 데이터를 추가하는 기능 */
    const fillingOutSheet = (param: { linkId: string; value?: Answer[]; openSheets: QuestionAnswerType[] }) => {
        const { linkId, value, openSheets } = param;

        const changeSheets = openSheets.map((item, index) => {
            const sheet = { ...item };

            if (sheet.linkId === linkId) {
                sheet.answer = value;
                if (value?.length === 0) {
                    delete sheet.answer;
                }
            }
            if (sheet.item) sheet.item = fillingOutSheet({ ...param, openSheets: sheet.item });

            return sheet;
        });

        return changeSheets;
    };
    /** questionnaire answer에 데이터에 위치 찾고 저장 기능 */
    const fillingOutSubSheet = (param: {
        linkId: string;
        value?: Answer[];
        openSheets: QuestionAnswerType[];
        groupId: string;
    }) => {
        const { linkId, value, openSheets, groupId } = param;

        const changeSheets = openSheets.map((item, index) => {
            const sheet = { ...item };

            if (sheet.text === groupId) {
                if (sheet.item) sheet.item = fillingOutSheet({ ...param, openSheets: sheet.item });
            } else {
                if (sheet.item) sheet.item = fillingOutSubSheet({ ...param, openSheets: sheet.item });
            }

            return sheet;
        });

        return changeSheets;
    };

    /** questionnaire answer에 데이터를 작성하는 기능 */
    const fillingOutAnswerSheet = (param: { linkId: string; value: Answer[]; groupId?: string }) => {
        const { linkId, value, groupId } = param;
        setQuestionAnswer((prev) => {
            const sheetList = JSON.parse(JSON.stringify(prev));
            if (sheetList === null) return sheetList;
            const state = sheetList[questionIndex];
            const fillingOutAnswer = groupId
                ? fillingOutSubSheet({ linkId, value, openSheets: state, groupId })
                : fillingOutSheet({ linkId, value, openSheets: state });
            sheetList[questionIndex] = fillingOutAnswer;
            return sheetList;
        });
    };

    const deleteMainAnswer = (params: { linkId: string; sheets: QuestionAnswerType[]; code?: string }) => {
        const { linkId, sheets, code } = params;
        const changeSheet: QuestionAnswerType[] = sheets.map((el, index) => {
            const sheet = el;
            if (sheet.linkId === linkId) {
                if (sheet.answer) {
                    const arr = sheet.answer;
                    const filterArr = arr.filter((e) => {
                        return e.valueCoding && e.valueCoding.code !== code;
                    });
                    if (filterArr.length === 0) {
                        delete sheet.answer;
                    } else {
                        sheet.answer = filterArr;
                    }
                }
            }
            if (sheet.item && sheet.item.length) sheet.item = deleteMainAnswer({ linkId, sheets: sheet.item, code });
            return sheet;
        });
        return changeSheet;
    };

    /** Main Answer를 지우는 기능*/
    const findGroupIdDeleteAnswer = (params: {
        linkId: string;
        sheets: QuestionAnswerType[];
        parentGroupId?: string;
        code?: string;
    }) => {
        const { linkId, sheets, parentGroupId, code } = params;
        const changeSheet = sheets.map((el, idex) => {
            const sheet = el;
            if (sheet.text === parentGroupId) {
                console.log(sheet);
                if (sheet.item) sheet.item = deleteMainAnswer({ linkId, sheets: sheet.item, code });
            } else {
                if (sheet.item)
                    sheet.item = findGroupIdDeleteAnswer({ linkId, sheets: sheet.item, parentGroupId, code });
            }
            return sheet;
        });
        return changeSheet;
    };

    /** Sub Answer를 지우는 기능*/
    const deleteCurrentAnswer = (params: { sheets: QuestionAnswerType[]; depthGroupId?: string }) => {
        const { sheets, depthGroupId } = params;
        const saveSheet: QuestionAnswerType[] = [];

        for (let i = 0; i < sheets.length; i++) {
            const sheet = sheets[i];
            if (sheet.item && sheet.item.length) sheet.item = deleteCurrentAnswer({ sheets: sheet.item, depthGroupId });
            if (sheet.text !== depthGroupId) {
                saveSheet.push(sheet);
            }
        }
        return saveSheet;
    };

    /** sub question 삭제 기능
     * @
     * */
    const deleteAnswerSheet = ({ mainId, currentGroupId, parentGroupId }: DeleteAnswerParams) => {
        const depthGroupId = overlapGroupId({ parentGroupId, groupId: currentGroupId });

        setQuestionAnswer((prev) => {
            if (prev === null) return prev;
            const sheetList = prev.map((sheet, index) => {
                if (index !== questionIndex) return sheet;
                const deleteMain = parentGroupId
                    ? findGroupIdDeleteAnswer({ linkId: mainId, sheets: sheet, parentGroupId, code: currentGroupId })
                    : deleteMainAnswer({ linkId: mainId, sheets: sheet, code: currentGroupId });
                console.log(deleteMain);
                const deleteSubAnswer = deleteCurrentAnswer({ sheets: deleteMain, depthGroupId });
                return deleteSubAnswer;
            });
            return sheetList;
        });
    };

    useEffect(() => {
        if (questionAnswer && questionAnswer.length) {
            console.log(questionAnswer[questionIndex]);
        }
    }, [questionAnswer]);

    const value: ContextState = {
        uiData,
        questionIndex,
        totalNumber,
        isStart,
        isEnd,
        isSuccess,
        progress,
        router,
        terminologyServer,
        answerValueSet,
        fillingOutAnswerSheet,
        questionAnswer,
        openAnswerSheet,
        deleteAnswerSheet,
        addAnswerSheet,
        variable,
        questionPagiNation,
        handleQuestionPagination,
        answerSheetReset,
        answerSheetInit,
        resourceList,
    };

    return <QuestionModelingContext.Provider value={value}>{children}</QuestionModelingContext.Provider>;
};

export const useModelingQuestion = () => {
    const state = useContext(QuestionModelingContext);
    return state;
};
