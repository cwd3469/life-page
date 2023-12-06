import { CommonContainer } from './layout/Container';

const CheckSymbol = () => {
    return (
        <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M95.8553 95.3553C86.4785 104.732 73.7608 110 60.5 110C47.2392 110 34.5215 104.732 25.1447 95.3553C15.7678 85.9785 10.5 73.2608 10.5 60C10.5 46.7391 15.7678 34.0215 25.1447 24.6446C34.5215 15.2678 47.2392 9.99997 60.5 9.99997C73.7608 9.99997 86.4785 15.2678 95.8553 24.6446C105.232 34.0215 110.5 46.7391 110.5 60C110.5 73.2608 105.232 85.9785 95.8553 95.3553Z"
                fill="#63CD82"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M87.6491 40.0256C89.2298 41.7265 89.2298 44.4841 87.6491 46.1849L52.9552 83.516C52.1962 84.3328 51.1666 84.7916 50.0931 84.7916C49.0196 84.7916 47.9901 84.3328 47.231 83.516L33.3535 68.5836C31.7728 66.8827 31.7728 64.1251 33.3535 62.4243C34.9342 60.7234 37.497 60.7234 39.0777 62.4243L50.0931 74.277L81.9249 40.0256C83.5056 38.3248 86.0684 38.3248 87.6491 40.0256Z"
                fill="white"
            />
        </svg>
    );
};

const RoundSymbol = () => {
    return (
        <svg width="121" height="120" viewBox="0 0 121 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M60.5 110C88.1142 110 110.5 87.6142 110.5 60C110.5 32.3858 88.1142 10 60.5 10C32.8858 10 10.5 32.3858 10.5 60C10.5 87.6142 32.8858 110 60.5 110Z"
                fill="#63CD82"
            />
            <circle cx="61" cy="60" r="21" stroke="white" strokeWidth="6" />
        </svg>
    );
};

const QuestionCompletionState = (props: { name?: string }) => {
    const { name } = props;
    const symbol = name ? <CheckSymbol /> : <RoundSymbol />;
    const title = name ? '문진 제출이 완료되었습니다.' : '이미 제출되었습니다.';
    const contents = name ? `${name}님의 문진이` : '모든 문진을 완료하셨습니다.';
    const contents2 = name ? `병원에 정상적으로 제출되었습니다.` : '감사합니다.';

    return (
        <CommonContainer>
            <div className="flex flex-col justify-start">
                <div className="flex flex-col justify-center items-center h-96">
                    {symbol}
                    <div className="h-9" />
                    <div className="text-xl font-bold text-[#484848] leading-8	">{title}</div>
                    <div className="h-2" />
                    <div className="text-base text-[#686868]">{contents}</div>
                    <div className="text-base text-[#686868]">{contents2}</div>
                </div>
            </div>
        </CommonContainer>
    );
};

export default QuestionCompletionState;
