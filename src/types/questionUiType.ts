'use client';

import { QuestionEnableWhen, ValueCoding } from './questionTypes';

export type TerminologyServerQuery = {
    url: string;
    displayLanguage: string;
    includeDefinition: boolean;
    includeDesignations: boolean;
    count: number;
    filter: string;
};

export type QuestionItemUiType = {
    /**fhir linkId */
    linkId: string | null;
    /**fhir type */
    type: string | null;
    /**fhir text */
    text: string | null;
    /**fhir readOnly */
    readOnly: boolean | null;
    /**fhir enableWhen */
    enableWhen: QuestionEnableWhen[] | null;
    /**modeling type : QuestionItemUiType 배열 데이터 */
    item: QuestionItemUiType[] | null;

    answerValueSet: string | null;
    /**
     * modeling type : fhir extension 정의 데이터
     * - 반복되고 불필요한 코드 정리
     * */
    itemExtension: itemExtension | null;

    /**Top item 표시 */
    isTop: boolean | null;

    repeats: boolean | null;
};

export type itemExtension = {
    /**fhir extension questionnaire-itemControl 정의*/
    itemControl: string | null;
    /**fhir extension terminology-server 정의*/
    terminologyServer: string | null;
    /** fhir extension maxValue 정의 */
    maxValue: number | null;
    /** fhir extension minValue 정의 */
    minValue: number | null;
    /** fhir extension questionnaire-hidden 정의 */
    hidden: boolean | null;
    /** fhir extension fhir sdc-questionnaire-answerExpression 정의 */
    expression: string | null;
    /** fhir extension sdc-questionnaire-itemMedia 정의 */
    attachment: { [key: string]: string } | null;
    /** fhir extension variable 정의 */
    variable: Map<string, string>;
    /**fhir extension questionnaire-unitOption 정의 */
    unit: ValueCoding[] | null;

    entryFormat: string | null;
};
