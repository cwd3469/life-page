'use client';

import { QuestionItem, QuestionnaireDataBundle } from '@/types/questionTypes';

type ParametersType = {
    data?: QuestionnaireDataBundle;
};

export type QuestionnaireResponseType = {
    type: string;
    entry: {
        resourceType: string;
        status: string;
        questionnaire: string;
        authored: string;
        url: string;
        item: QuestionAnswerType[];
    }[];
};

export type Attachment = {
    contentType: string;
    //language: string;
    data: string;
    url: string;
    size?: number; // if (url provided)
    hash: string;
    title: string;
    creation: Date;
    height?: number; //if (photo or video)
    width?: number; //if (photo or video)
    frames?: number; //if > 1 (photo)
    duration?: number; //if(audio or video)
    pages: number;
};

export type Coding = {
    system: string;
    version?: string; //if relevant
    code?: string;
    display?: string;
    userSelected?: boolean; //if this coding was chosen directly by the user
};

export type Quantity = {
    [key: string]: string | undefined;
    value?: string;
    //comparator: string; //< | <= | >= | > | ad(The actual value is sufficient for the total quantity to equal the given value.) - how to understand the value
    unit?: string;
    //system: string;
    code?: string;
};

export type Reference = {
    reference: string;
    type: string;
    identifier: Identifier;
    display: string;
};

export type CodeableConcept = {
    coding: Coding[];
    text: string;
};

export type Identifier = {
    use: string; //usual | official | temp | secondary | old (If known)
    type: CodeableConcept;
    system: string;
    value: string;
    period: Period;
    assigner: Reference | string;
};

export type Period = {
    start: Date;
    end?: Date;
};

/**
 * - type integer > valueInteger?: number;
 * - type date > valueDate?: Date;
 * - type string > valueString?: string;
 * - type quantity > [valueQuantity :Quantity ]
 * - type attachment > valueAttachment?: Attachment;
 * - type coding > valueCoding?: Coding;
 */
export type AnswerValueSet =
    | number
    | Date
    | string
    | Attachment
    | Coding
    | Quantity
    | Date
    | Reference
    | boolean
    | undefined;

export type Answer = {
    [key: string]: AnswerValueSet;
    valueInteger?: number;
    valueDate?: Date;
    valueString?: string;
    valueUri?: string;
    valueAttachment?: Attachment;
    valueCoding?: Coding;
    valueQuantity?: Quantity;
    // TODO: 추후 변경할 추가 될 예정
    valueTime?: string;
    valueDateTime?: Date;
    valueReference?: Reference;
    valueBoolean?: boolean;
    valueDecimal?: number;
};

/** answer 저장시 같이 저장되는 단위 , 코드 등 기본 단위가 저장된 위치**/
export type QuestionAnswerType = {
    linkId: string;
    answer?: Answer[];
    item?: QuestionAnswerType[];
    text?: string;
    /** api 요청시 삭제 */
};

class QuestionnaireDataAnswerModeling {
    data?: QuestionnaireDataBundle;
    constructor(param: ParametersType) {
        this.data = param.data;
    }
    /** item을 answer로 변환하는 컨버팅 함수 */
    private convertToQuestionItemAnswer = (params: { items: QuestionItem[] }): QuestionAnswerType[] => {
        const { items } = params;

        const answerList: QuestionAnswerType[] = items.map((element) => {
            const value: QuestionAnswerType = {
                linkId: typeof element.linkId === 'string' ? element.linkId : '',
            };

            if (element.item) {
                value['item'] = this.convertToQuestionItemAnswer({ items: element.item });
            }

            if (typeof element.text === 'string') {
                value['text'] = element.text;
            }

            return value;
        });

        return answerList;
    };
    /** answer questionnaire response format 기능 */
    public convertToDataResource = (answer: QuestionAnswerType[][] | null): QuestionnaireResponseType | undefined => {
        if (!this.data || answer === null) return;
        const data: QuestionnaireDataBundle = this.data;
        const resourceList = data.entry.map((element, index) => {
            let url = '';
            let linkId: string | undefined = '';
            let version = '';
            if (element.resource) {
                const resource = element.resource;
                url = resource.url;
                linkId = element.resource.item[0].linkId;
                version = element.resource.meta.versionId;
            }
            return { url, linkId, version };
        });
        const entry = answer.map((item, index) => {
            const url =
                resourceList[index]?.linkId === item[0].linkId
                    ? `${resourceList[index]?.url}|${resourceList[index].version}`
                    : '';

            return {
                resourceType: 'QuestionnaireResponse',
                status: 'completed',
                questionnaire: url,
                authored: new Date().toJSON(),
                url,
                item,
            };
        });

        const QuestionnaireResponse: QuestionnaireResponseType = {
            type: 'collection',
            entry: entry,
        };

        return QuestionnaireResponse;
    };

    /** questionnaire 데이터를 answer 리스트 데이터로 변환하는 컨버팅 함수 */
    public convertToDataAnswer = () => {
        if (!this.data) return [];
        const data: QuestionnaireDataBundle = this.data;
        const dataList = data.entry.map((item, index) => {
            if (!item.resource?.item) return [];
            return this.convertToQuestionItemAnswer({ items: item.resource?.item });
        });
        return dataList;
    };

    /** valueSet 컨버팅 함수*/
    public convertToValueSet = () => {
        const mapping: { [key: string]: Answer } = {
            integer: { valueInteger: 0 },
            date: { valueDate: new Date() },
            string: { valueString: '' },
            quantity: { valueQuantity: {} },
            attachment: {
                valueAttachment: {
                    contentType: '',
                    data: '',
                    url: '',
                    size: undefined, // if (url provided)
                    hash: '',
                    title: '',
                    creation: new Date(),
                    height: undefined, //if (photo or video)
                    width: undefined, //if (photo or video)
                    frames: undefined, //if > 1 (photo)
                    duration: undefined, //if(audio or video)
                    pages: 0,
                },
            },
            coding: {
                valueCoding: {
                    system: '',
                    version: undefined,
                    code: undefined,
                    display: undefined,
                    userSelected: undefined,
                },
            },
        };
        return mapping;
    };
}

export default QuestionnaireDataAnswerModeling;
