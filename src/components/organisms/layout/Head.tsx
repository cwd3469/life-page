'use client';
import PatientProgress from '../../molecules/progress/PatientProgress';
import { QuestionItemUiType } from '@/types/questionUiType';
import { ItemStateCheckBtn } from '../UiSectionPage';
import { useModelingQuestion } from '../../../controller/DataContext';

export type QuestionnaireHeadProps = {
    item?: QuestionItemUiType;
    title?: string;
};

const BackBtn = ({ onClick }: { onClick?: () => void }) => {
    return (
        <button onClick={onClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.7071 5.29289C16.0976 5.68342 16.0976 6.31658 15.7071 6.70711L10.4142 12L15.7071 17.2929C16.0976 17.6834 16.0976 18.3166 15.7071 18.7071C15.3166 19.0976 14.6834 19.0976 14.2929 18.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L14.2929 5.29289C14.6834 4.90237 15.3166 4.90237 15.7071 5.29289Z"
                    fill="#242424"
                />
            </svg>
        </button>
    );
};

const QuestionnaireHead = (props: QuestionnaireHeadProps) => {
    const { questionPagiNation, router, handleQuestionPagination, answerSheetReset } = useModelingQuestion();
    const { title, item } = props;
    const handlePageChange = () => {
        const routerPrev = () => router && router.prev && router.prev();
        const routerModify = () => {
            handleQuestionPagination('preview');
            answerSheetReset();
        };
        const pageEvent: { [key: string]: () => void } = {
            questionnaire: routerPrev,
            preview: () => undefined,
            modify: routerModify,
            completion: () => undefined,
            already: () => undefined,
        };
        const pageChange = pageEvent[questionPagiNation];
        pageChange();
    };
    return (
        <>
            <div className=" bg-TG000 sticky top-0 left-0 w-full z-50 border-b border-solid border-[#F0F0F0]">
                <div
                    className="flex flex-row justify-between items-center py-1 px-2"
                    style={{ borderBottom: '1px solid #F0F0F0' }}
                >
                    {questionPagiNation !== 'preview' ? (
                        <BackBtn onClick={handlePageChange} />
                    ) : (
                        <div className="w-11 h-11" />
                    )}
                    <p className="text-lg font-bold">{title ? title : item && item.text}</p>
                    {item && <ItemStateCheckBtn item={item} />}
                    <div className="w-11 h-11" />
                </div>
                {questionPagiNation === 'questionnaire' && <PatientProgress />}
            </div>
        </>
    );
};

export default QuestionnaireHead;
