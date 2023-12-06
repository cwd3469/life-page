'use client';
import { ExtensionType, QuestionItem, QuestionnaireDataBundle, ValueCoding } from '@/types/questionTypes';
import { QuestionItemUiType, itemExtension } from '@/types/questionUiType';

type Params = {
    data?: QuestionnaireDataBundle;
};
type ItemType = 'text' | 'string' | 'coding' | 'quantity' | 'integer' | 'display' | 'group' | 'attachment';

class QuestionnaireDataModeling {
    data: QuestionnaireDataBundle | undefined;
    extensionKey: string[];
    constructor(params: Params) {
        this.data = params.data;
        this.extensionKey = [
            'questionnaire-itemControl',
            'sdc-questionnaire-preferredTerminologyServer',
            'questionnaire-unitOption',
            'sdc-questionnaire-calculatedExpression',
            'maxValue',
            'minValue',
            'questionnaire-hidden',
            'sdc-questionnaire-itemMedia',
            'variable',
            'sdc-questionnaire-answerExpression',
            'sdc-questionnaire-itemPopulationContext',
            'entryFormat',
        ];
    }
    //TODO: 추가적인 개발 필요
    public covertToQuestionUiExtension = (extension: ExtensionType[] | undefined): itemExtension | null => {
        if (!extension) return null;
        let itemControl: string | null = '';
        let terminologyServer: string | null = '';
        let maxValue: number | null = 0;
        let minValue: number | null = 0;
        let hidden: boolean | null = false;

        let entryFormat: string | null = '';
        const attachment: { [key: string]: string } | null = {};
        const variable: Map<string, string> = new Map<string, string>();
        let expression: string | null = '';
        const unit: ValueCoding[] | null = [];

        for (let i = 0; i < this.extensionKey.length; i++) {
            const value = this.extensionKey[i];
            for (let k = 0; k < extension.length; k++) {
                const element = extension[k];
                const isExtension = element.url.includes(value) ? value : '-';
                switch (isExtension) {
                    case 'questionnaire-itemControl':
                        if (element.valueCodeableConcept)
                            itemControl = element.valueCodeableConcept.coding[0].code
                                ? element.valueCodeableConcept.coding[0].code
                                : '';
                        break;
                    case 'sdc-questionnaire-preferredTerminologyServer':
                        terminologyServer = element.valueUrl ? element.valueUrl : terminologyServer;
                        break;
                    case 'entryFormat':
                        entryFormat = element.valueString ? element.valueString : entryFormat;
                        break;
                    case 'questionnaire-unitOption':
                        unit.push(element.valueCoding ? element.valueCoding : unit[0]);
                        break;
                    case 'maxValue':
                        maxValue = element.valueInteger ? element.valueInteger : maxValue;
                        break;
                    case 'minValue':
                        minValue = element.valueInteger ? element.valueInteger : minValue;
                        break;
                    case 'questionnaire-hidden':
                        hidden = element.valueBoolean ? element.valueBoolean : false;
                        break;
                    case 'sdc-questionnaire-itemMedia':
                        if (element.valueAttachment)
                            attachment[element.valueAttachment?.title ? element.valueAttachment.title : 'notImage'] =
                                element.valueAttachment.url;
                        break;
                    case 'variable':
                        if (element.valueExpression) {
                            variable.set(
                                element.valueExpression.name ? element.valueExpression.name : '',
                                element.valueExpression.expression ? element.valueExpression.expression : ''
                            );
                        }
                        break;
                    case 'sdc-questionnaire-itemPopulationContext':
                        if (element.valueExpression?.expression) expression = element.valueExpression.expression;
                        break;
                    case 'sdc-questionnaire-calculatedExpression':
                        if (element.valueExpression?.expression) expression = element.valueExpression.expression;
                        break;
                    default:
                        break;
                }
            }
        }
        // console.log(variable);
        const value: itemExtension = {
            itemControl,
            terminologyServer,
            maxValue,
            minValue,
            hidden,
            unit,
            attachment,
            variable,
            expression,
            entryFormat,
        };
        return value;
    };

    private convertToQuestionItemUi = (params: {
        items: QuestionItem[];
        isTop: boolean;
        resourceExtension?: itemExtension;
    }): QuestionItemUiType[] => {
        const { items, isTop, resourceExtension } = params;
        const uiItems: QuestionItemUiType[] = items.map((element) => {
            const extension = this.covertToQuestionUiExtension(element.extension);
            let itemExtension = extension;
            const terminologyServer = resourceExtension ? resourceExtension.terminologyServer : null;

            if (isTop) {
                itemExtension = itemExtension
                    ? { ...itemExtension, terminologyServer }
                    : resourceExtension
                    ? resourceExtension
                    : null;
            }

            return {
                linkId: typeof element.linkId === 'string' ? element.linkId : null,
                type: typeof element.type === 'string' ? element.type : null,
                text: typeof element.text === 'string' ? element.text : null,
                readOnly: typeof element.readOnly === 'boolean' ? element.readOnly : null,
                enableWhen: element.enableWhen ? element.enableWhen : null,
                answerValueSet: element.answerValueSet ? element.answerValueSet : null,
                item: element.item ? this.convertToQuestionItemUi({ items: element.item, isTop: false }) : null,
                repeats: typeof element.repeats === 'boolean' ? element.repeats : null,
                itemExtension,
                isTop,
            };
        });
        return uiItems;
    };

    /** 데이터 배열 */
    public convertToData = () => {
        if (!this.data) return [];
        const data: QuestionnaireDataBundle = this.data;
        const dataList = data.entry.map((item, index) => {
            const resourceExtension = this.covertToQuestionUiExtension(item.resource?.extension);

            const resourceItem = item.resource?.item ? item.resource?.item : [];
            return this.convertToQuestionItemUi({
                items: resourceItem,
                isTop: true,
                resourceExtension: resourceExtension ? resourceExtension : undefined,
            });
        });
        return dataList;
    };
}

export default QuestionnaireDataModeling;
