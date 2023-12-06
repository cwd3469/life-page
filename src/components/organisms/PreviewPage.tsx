import { Answer, AnswerValueSet, Coding, Quantity, QuestionAnswerType } from '../../controller/DataAnswerModeling';
import { useModelingQuestion } from '../../controller/DataContext';
import { PreviewContainer } from './layout/Container';
import QuestionnaireHead from './layout/Head';
import answerJson from '../../api/answer.json';
import { useEffect, useState } from 'react';

const QuestionGuide = () => {
    const info = {
        title: '작성하신 문진들을 요약해서 보여드려요.',
        contents: '수정이 필요하실 경우 문진 항목 옆 아이콘을 눌러서 수정해주신 후 문진 요약 가기 버튼을 눌러주세요.',
    };
    return (
        <div className="py-4 border-b border-solid border-[#F0F0F0]">
            <div className="text-mint600 font-semibold text-sm">{info.title}</div>
            <div className="text-slate-700 text-xs">{info.contents}</div>
        </div>
    );
};

function getFormatDate(date: Date | undefined) {
    if (!date) return;
    const year = date.getFullYear(); //yyyy
    let month: number | string = 1 + date.getMonth(); //M
    month = month >= 10 ? month : '0' + month; //month 두자리로 저장
    let day: number | string = date.getDate(); //d
    day = day >= 10 ? day : '0' + day; //day 두자리로 저장
    return year + '' + month + '' + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

type ValueSetComponent = { answer: Answer; valueKey: string };

const ValueInter = ({ answer, valueKey }: ValueSetComponent) => {
    const inter = answer[valueKey] as number;
    return <div>{`${inter}`}</div>;
};
const ValueDate = ({ answer, valueKey }: ValueSetComponent) => {
    const date = answer[valueKey] as Date;
    return <div>{getFormatDate(date)}</div>;
};
const ValueQuantity = ({ answer, valueKey }: ValueSetComponent) => {
    const quantity = answer[valueKey] as Quantity;
    return <div>{`${quantity.value}${quantity.unit}`}</div>;
};
const ValueCoding = ({ answer, valueKey }: ValueSetComponent) => {
    const coding = answer[valueKey] as Coding;
    return <div>{`${coding.display} : (${coding.code})`}</div>;
};

const valueSetComponent = (props: ValueSetComponent) => {
    const valueSet: { [key: string]: JSX.Element } = {
        valueInteger: <ValueInter {...props} />,
        valueDate: <ValueDate {...props} />,
        valueString: <></>,
        valueUri: <></>,
        valueAttachment: <></>,
        valueCoding: <ValueCoding {...props} />,
        valueQuantity: <ValueQuantity {...props} />,
        valueTime: <></>,
        valueDateTime: <></>,
        valueReference: <></>,
        valueBoolean: <></>,
        valueDecimal: <></>,
    };
    const valueKeyArr = Object.keys(valueSet);
    return { valueSet, valueKeyArr };
};

/** question preview 컴포넌트 find 기능
 * @function answer의 key명에 따라서 컴포넌트를 찾는 기능
 * @returns JSX.Element
 */
const QuestionPreviewList = (props: { item: QuestionAnswerType }) => {
    const { item } = props;
    const { questionAnswer } = useModelingQuestion();
    const valueKeyArr = valueSetComponent({ answer: {}, valueKey: '' }).valueKeyArr;
    const [valueComponent, setValueComponent] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (!item.answer || !item.answer.length) return;
        const components: JSX.Element[] = [];
        for (let index = 0; index < item.answer.length; index++) {
            const answer = item.answer[index];
            for (let int = 0; int < valueKeyArr.length; int++) {
                const valueKey = valueKeyArr[int];
                const idValueSet = answer[valueKey];
                if (idValueSet) {
                    const component = valueSetComponent({ answer, valueKey }).valueSet[valueKey];
                    components.push(component);
                }
            }
        }
        setValueComponent(components);
    }, [item, questionAnswer]);

    if (!valueComponent.length) return <></>;

    return (
        <div className="flex flex-col gap-3 py-1 text-base">
            {valueComponent.map((el, index) => {
                return <div key={index}>{el}</div>;
            })}
        </div>
    );
};

/** question preview 맵핑 컴포넌트
 * @function 재귀함수를 사용한 컴포넌트 재사용
 * @returns JSX.Element
 */
const QuestionPreviewMapping = (props: { items: QuestionAnswerType[] }) => {
    const { items } = props;
    if (!items.length) return <></>;
    return items.map((item, index) => {
        return (
            <div key={index}>
                <QuestionPreviewList item={item} />
                {item.item && <QuestionPreviewMapping items={item.item} />}
            </div>
        );
    });
};

/** question preview 템플릿 컴포넌트
 * @function 데이터를 받고 페이지 head를 생성한다. 초반 데이터를 가공 , 맵핑한다.
 * @returns JSX.Element
 */
const QuestionPreview = () => {
    const { handleQuestionPagination, router, questionAnswer, answerSheetInit } = useModelingQuestion();
    const pageChangeToModify = (index: number, sheets: QuestionAnswerType[]) => {
        handleQuestionPagination('modify');
        router && router.page && router.page(index);
        answerSheetInit(sheets);
    };
    // const questionAnswer: QuestionAnswerType[][] | null = JSON.parse(JSON.stringify(answerJson));
    return (
        <PreviewContainer>
            <div className="flex flex-col">
                <QuestionnaireHead title="문진 요약" />
                <div className="px-4">
                    <QuestionGuide />
                    {questionAnswer &&
                        questionAnswer.map((el, index) => {
                            return (
                                <div key={index}>
                                    {el.length && (
                                        <div className="py-4 border-b border-solid border-[#F0F0F0]">
                                            <div className="flex flex-row justify-between items-center pb-2">
                                                <p className="text-sm font-semibold text-[#8F8F8F]">{el[0].text}</p>
                                                <button
                                                    value={index}
                                                    className="border border-solid border-[#C2C2C2] py-1 px-4 rounded text-xs text-[#484848]"
                                                    onClick={() => pageChangeToModify(index, el)}
                                                >
                                                    수정
                                                </button>
                                            </div>
                                            {el[0].item && <QuestionPreviewMapping items={el[0].item} />}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </PreviewContainer>
    );
};

export default QuestionPreview;
