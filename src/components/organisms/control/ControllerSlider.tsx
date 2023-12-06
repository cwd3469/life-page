import { useState } from 'react';

type Props = {
    value?: number;
    onClick?: (value: number) => void;
    min: number;
    max: number;
};

const IcSpeechBubble = () => (
    <svg width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.9833 21.9241C17.9833 21.9241 16.2733 24.0302 15.0933 25.4824C14.8267 25.8095 14.4267 26 14 26C13.5733 26 13.1733 25.8095 12.9067 25.4824C11.7267 24.0294 10.0167 21.9217 10.0167 21.9217C1.56335 21.2094 0 17.8952 0 11.0352C0 3.21151 2.04667 0 14 0C25.9533 0 28 3.15738 28 11.0352C28 17.9432 26.4367 21.2215 17.9833 21.9241Z"
            fill="#1ABCB7"
        />
    </svg>
);

const setArray = (minValue: number, maxValue: number) => {
    const options: number[] = [];
    for (let index = 0; index <= 10; index++) {
        options.push(index);
    }
    return options;
};

const activeRatio = (current: number, minValue: number, maxValue: number) => {
    const interval = maxValue - minValue;
    const percent = 100 / interval;
    const currentPercent = percent * current;
    return current > 4 ? currentPercent - 1 : currentPercent + 1;
};

const ControlSlider = ({ value, onClick, min, max }: Props) => {
    const [slider, setSlider] = useState<number>(0);
    const optionArray: number[] = setArray(min, max);
    const handleSlider = (value: number) => {
        onClick ? onClick(value) : setSlider((prev) => (prev !== value ? value : prev));
    };
    const ratio = activeRatio(value ? value : slider, 0, 10);
    return (
        <div className="flex flex-col h-[72px] justify-center">
            <div
                className="flex flex-row bg-[#F3FBFA] rounded-lg h-4 justify-between items-center relative"
                style={{
                    background: `linear-gradient(90deg, rgba(120,222,213,1) ${ratio}%, rgba(243,251,250,1) ${ratio}%)`,
                }}
            >
                {optionArray.map((item, index) => {
                    const isSameNumber = value ? value === item : slider === item;
                    const isOverNumber = value ? value >= item : slider >= item;
                    const buttonStyle = {
                        backgroundColor: isSameNumber ? '#1ABCB7' : isOverNumber ? '#78ded5' : '#F3FBFA',
                    };
                    const botStyle = {
                        backgroundColor: isSameNumber ? '#1ABCB7' : isOverNumber ? '#78ded5' : '#AFE9E1',
                    };
                    return (
                        <button
                            key={index}
                            className={`w-4 h-4 rounded-full relative`}
                            style={buttonStyle}
                            onClick={() => handleSlider(item)}
                        >
                            {isSameNumber && (
                                <div className="absolute -top-7 left-1/2 text-xs text-[#78DED5] -translate-x-1/2">
                                    <IcSpeechBubble />
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2  text-white">{item}</div>
                                </div>
                            )}
                            <div
                                className="w-1 h-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                style={botStyle}
                            />
                            <div className="absolute -bottom-6 left-1/2 text-xs text-[#78DED5] -translate-x-1/2">
                                {item}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ControlSlider;
