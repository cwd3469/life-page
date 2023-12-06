'use client';
import PatientTextField from '../../molecules/textField/PatientTextField';
import { useModelingQuestion } from '../../../controller/DataContext';
import { Quantity } from '../../../controller/DataAnswerModeling';
import { ItemComponentProp } from './UiDisplay';

const IcArrow = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
};

const calculateBMI = (weightStr: string, heightStr: string) => {
    const regExpNumber = /^[0-9]+$/;
    const weight = Number(weightStr);
    const height = Number(heightStr);
    const bmi = (weight / ((height * height) / 10000)).toFixed(1);

    return isNaN(Number(bmi)) ? 0 : isFinite(Number(bmi)) ? bmi : 0;
};

/** Quantity type */
const ItemUiQuantity = ({ item, groupId, answerSheet }: ItemComponentProp) => {
    const { fillingOutAnswerSheet, variable } = useModelingQuestion();
    const itemLinkId = item.linkId ? item.linkId : '';
    const itemUnit = item.itemExtension?.unit;
    const answerQuantity = answerSheet && answerSheet.length ? answerSheet[0] : undefined;
    const answerUnit = answerQuantity && answerQuantity.valueQuantity?.unit;
    //TODO: 추가 적인 개발 예정 /
    const check = '(%weightV/((%heightV*0.01).power(2))).round(1)';
    const bmi =
        item.readOnly &&
        item.itemExtension?.expression &&
        item.itemExtension.expression === check &&
        calculateBMI(variable['weightV'], variable['heightV']);

    /** Quantity type answer 입력 기능 */
    const sheetFillOut = (text: string, unit?: string) => {
        if (!itemUnit) return;
        const unitSet: Quantity = {};
        const regExpNumber = /^[0-9]+$/;
        const validValue = regExpNumber.test(text) ? text : '';
        const valueCoding = unit ? itemUnit.filter((el) => el.display === unit)[0] : itemUnit[0];
        if (valueCoding.display) unitSet['unit'] = valueCoding.display;
        if (valueCoding.code) unitSet['code'] = valueCoding.code;
        const value = { valueQuantity: { ...answerQuantity?.valueQuantity, value: validValue, ...unitSet } };
        fillingOutAnswerSheet && fillingOutAnswerSheet({ linkId: itemLinkId, value: [value], groupId });
    };

    if (!item.itemExtension || itemUnit === null || itemUnit === undefined || itemUnit.length === 0) return <></>;
    //textFiled props
    const value = bmi ? bmi : answerQuantity?.valueQuantity?.value || '';
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => sheetFillOut(e.target.value, answerUnit);
    const placeholder = item.itemExtension.entryFormat !== null ? item.itemExtension.entryFormat : '';
    const readOnly = item.readOnly === null ? false : item.readOnly;
    const name = item.linkId ? item.linkId : '';
    //select props
    const selectName = item.linkId ? item.linkId + 'lang' : 'lang';
    const selectOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
        sheetFillOut(answerQuantity?.valueQuantity?.value || '', e.target.value);

    return (
        <div className="flex flex-col gap-2">
            {item.text && <p className="text-sm font-bold">{item.text}</p>}
            {itemUnit.length <= 1 ? (
                <div className="relative">
                    <PatientTextField
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        name={name}
                        style={{ paddingRight: '2rem' }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-2/4">{itemUnit[0].display}</div>
                </div>
            ) : (
                <div className="flex flex-row justify-between">
                    <div className="w-[49.5%]">
                        <PatientTextField
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            readOnly={readOnly}
                            name={name}
                        />
                    </div>
                    <div className="relative w-[49.5%] flex text-sm">
                        <select
                            name={selectName}
                            id={selectName}
                            onChange={selectOnChange}
                            value={answerUnit}
                            className=" border w-full border-solid border-TG300 rounded-lg p-3 appearance-none"
                            disabled={readOnly}
                        >
                            {itemUnit.map((el, index) => {
                                return (
                                    <option value={el.display} key={index}>
                                        {el.display}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <IcArrow />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemUiQuantity;
