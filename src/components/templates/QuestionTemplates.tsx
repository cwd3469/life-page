'use client';
import QuestionUiSection, { QuestionModify } from '../organisms/UiSectionPage';
import { QuestionModelingProvider, useModelingQuestion } from '../../controller/DataContext';
import QuestionPreview from '../organisms/PreviewPage';
import QuestionCompletionState from '../organisms/CompletionStatePage';
import { QuestionnaireDataBundle } from '@/types/questionTypes';

export type PageRouter = {
    next?: () => void;
    prev?: () => void;
    page?: (page: number) => void;
};

type Props = {
    data?: QuestionnaireDataBundle;
    index: number;
    router?: PageRouter;
};
export const QuestionnaireTemplates = (props: Props) => {
    const { data, index, router } = props;

    return (
        <QuestionModelingProvider questionData={data} questionIndex={index} router={router}>
            <QuestionnairePage />
        </QuestionModelingProvider>
    );
};

const QuestionnairePage = () => {
    const { questionPagiNation } = useModelingQuestion();
    const questionPage: { [key: string]: JSX.Element } = {
        questionnaire: <QuestionUiSection />,
        preview: <QuestionPreview />,
        modify: <QuestionModify />,
        completion: <QuestionCompletionState name="홍길동" />,
        already: <QuestionCompletionState />,
    };

    return <>{questionPage[questionPagiNation]}</>;
};
