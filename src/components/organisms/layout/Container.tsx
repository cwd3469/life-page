'use client';
import QuestionnaireFooter from './Footer';
import { useModelingQuestion } from '../../../controller/DataContext';
import { CSSProperties } from 'react';

type Props = {
    children: JSX.Element | JSX.Element[];
    style?: CSSProperties | undefined;
};

const QuestionnaireFrame = ({ children, style }: Props) => {
    return (
        <div className="relative bg-[#FBFBFB] w-full mx-auto max-w-xl	" style={style}>
            <div className="h-screen flex flex-col  justify-between overflow-y-scroll relative">{children}</div>
        </div>
    );
};
const QuestionnaireContainer = ({ children }: Props) => {
    const { router, isEnd, isStart, handleQuestionPagination } = useModelingQuestion();

    const nextPage = () => {
        if (isEnd) handleQuestionPagination('preview');
        else router && router.next && router.next();
    };
    const prevPage = () => {
        if (isStart) undefined;
        else router && router.prev && router.prev();
    };

    return (
        <QuestionnaireFrame>
            <div>{children}</div>
            <QuestionnaireFooter nextRouter={nextPage} prevRouter={prevPage} btnForm="pagiNation" />
        </QuestionnaireFrame>
    );
};

type TermsContainerType = {
    children: JSX.Element | JSX.Element[];
    nextRouter: () => void;
    bottomDisabled: boolean;
};

export const TermsContainer = ({ nextRouter, bottomDisabled, children }: TermsContainerType) => {
    return (
        <QuestionnaireFrame>
            <>{children}</>
            <QuestionnaireFooter disabled={bottomDisabled} nextRouter={nextRouter} btnForm="default" />
        </QuestionnaireFrame>
    );
};

export const PreviewContainer = ({ children }: Props) => {
    const { handleQuestionPagination } = useModelingQuestion();
    const pageChange = () => handleQuestionPagination('completion');
    return (
        <QuestionnaireFrame>
            <div>{children}</div>
            <QuestionnaireFooter btnForm="default" nextBtnText="문진제출하기" nextRouter={pageChange} />
        </QuestionnaireFrame>
    );
};

export const ModifyContainer = ({ children }: Props) => {
    const { handleQuestionPagination } = useModelingQuestion();
    const pageChange = () => handleQuestionPagination('preview');
    return (
        <QuestionnaireFrame>
            <div>{children}</div>
            <QuestionnaireFooter btnForm="default" nextBtnText="문진수정하기" nextRouter={pageChange} />
        </QuestionnaireFrame>
    );
};

export const CommonContainer = ({ children }: Props) => {
    const { handleQuestionPagination, questionAnswer, resourceList } = useModelingQuestion();
    const pageChange = () => {
        handleQuestionPagination('already');
        if (resourceList) {
            console.log(resourceList);
        }
    };
    return (
        <QuestionnaireFrame>
            <div className="h-full">{children}</div>
            <QuestionnaireFooter btnForm="default" nextBtnText="확인" nextRouter={pageChange} />
        </QuestionnaireFrame>
    );
};

export default QuestionnaireContainer;
