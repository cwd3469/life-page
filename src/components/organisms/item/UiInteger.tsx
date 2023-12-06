'use client';
import { ItemComponentProp } from './UiDisplay';
import { useModelingQuestion } from '../../../controller/DataContext';
import PatientTextField from '../../molecules/textField/PatientTextField';
import { Answer } from '../../../controller/DataAnswerModeling';
import ControlSlider from '../control/ControllerSlider';

const ItemUiInteger = ({ item, groupId, answerSheet }: ItemComponentProp) => {
    const { fillingOutAnswerSheet } = useModelingQuestion();

    const answerInteger =
        answerSheet && answerSheet.length && answerSheet[0] && answerSheet[0].valueInteger
            ? answerSheet[0].valueInteger
            : undefined;

    const handleChange = (newValue: number) => {
        const value: Answer = { valueInteger: newValue };
        const itemLinkId = item.linkId ? item.linkId : '';
        fillingOutAnswerSheet && fillingOutAnswerSheet({ linkId: itemLinkId, value: [value], groupId });
    };

    if (!item || !item.itemExtension) return <></>;
    const { minValue, maxValue, itemControl } = item.itemExtension;
    const min = typeof minValue === 'number' ? minValue : 0;
    const max = typeof maxValue === 'number' ? maxValue : 0;
    const marks = [...new Array(max + 1)].map((_, i) => {
        return {
            value: i,
            label: `${i}`,
        };
    });

    return (
        <div className="flex flex-col gap-2">
            <div className="text-base font-bold">{item.text}</div>
            {itemControl && itemControl === 'slider' ? (
                <ControlSlider value={answerInteger} onClick={handleChange} min={min} max={max} />
            ) : (
                <PatientTextField />
            )}
        </div>
    );
};

export default ItemUiInteger;
