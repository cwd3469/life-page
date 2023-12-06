'use client';
import { CodingCommonProps } from '../item/UiCoding';
import { Coding } from '../../../controller/DataAnswerModeling';

const ControlRadiusButton = ({
    item,
    code,
    handleFilter,
    answerFillOut,
    filter,
    itemAnswer,
    type,
    itemLinkId,
}: CodingCommonProps & { type?: string }) => {
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
            <p className="text-base font-bold">{item.text}</p>
            <div className="flex flex-col gap-2 py-2 ">
                {code.map((element, index) => {
                    return (
                        <div className="flex flex-row items-center gap-2" key={index}>
                            <div className="inline-flex items-center">
                                <label
                                    className="relative flex cursor-pointer items-center rounded-full"
                                    htmlFor={itemLinkId + index}
                                >
                                    <input
                                        type={'radio'}
                                        className="peer relative h-6 w-6 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-mint600 transition-al"
                                        value={JSON.stringify(element)}
                                        onChange={(e) => handleChange(e.target.value)}
                                        checked={checkValue(element.code)}
                                        id={itemLinkId + index}
                                        disabled={item.readOnly === null ? false : item.readOnly}
                                    />
                                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-mint600 opacity-0 transition-opacity peer-checked:opacity-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            viewBox="0 0 16 16"
                                            fill="currentColor"
                                        >
                                            <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                        </svg>
                                    </div>
                                </label>
                            </div>
                            <label
                                htmlFor={itemLinkId + index}
                                className="cursor-pointer block text-base leading-6"
                                style={{ color: checkValue(element.code) ? 'black' : '#6B6B6B' }}
                            >
                                {element.display}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ControlRadiusButton;
