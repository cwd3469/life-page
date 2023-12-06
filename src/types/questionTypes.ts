export type TermCode = {
    system: string;
    code: string;
    display: string;
};

type AnswerCoding = {
    system?: string;
    display?: string;
    code?: string;
};

export type ValueCoding = {
    code?: string;
    display?: string;
};

type ValueExpression = {
    name?: string;
    description?: string;
    language?: string;
    expression?: string;
};

type ValueCodeableConcept = {
    coding: TermCode[];
    text?: string;
};

type ValueAttachment = {
    url: string;
    title?: string;
};

export type ExtensionType = {
    url: string;
    valueUrl: string;
    valueInteger: number;
    valueExpression?: ValueExpression;
    valueCoding?: ValueCoding;
    valueCodeableConcept?: ValueCodeableConcept;
    valueAttachment?: ValueAttachment;
    valueBoolean?: boolean;
    valueQuantity?: number;
    valueString?: string;
};

export type QuestionEnableWhen = {
    question?: string;
    operator?: string;
    answerBoolean?: boolean;
    answerCoding?: AnswerCoding;
};

type QuestionAnswerOption = {
    valueCoding: ValueCoding;
    initialSelected?: boolean;
};

type QuestionInitial = {
    valueDateTime: Date;
};

type QuestionMeta = {
    versionId: string;
    lastUpdated?: Date;
    source: string;
};

export type QuestionItem = {
    linkId?: string;
    text?: string;
    type?: string;
    extension?: ExtensionType[];
    readOnly?: boolean;
    answerValueSet?: string;
    enableBehavior?: string;
    enableWhen?: QuestionEnableWhen[];
    initial?: QuestionInitial[];
    answerOption?: QuestionAnswerOption[];
    repeats?: boolean;
    item?: QuestionItem[];
    code?: TermCode[];
};

export type QuestionResource = {
    type?: string;
    resourceType: string;
    id: string;
    meta: QuestionMeta;
    url: string;
    version: string;
    title: string;
    status: string;
    code?: TermCode[];
    extension?: ExtensionType[];
    entry?: QuestionnaireEntryType[];
    questionnaire: string;
    authored: string;
};

export type QuestionResourceItem = { item: QuestionItem[] };

export type QuestionnaireEntryType = {
    fullUrl: string;
    resource?: QuestionResource & QuestionResourceItem;
};

export type QuestionnaireDataBundle = {
    resourceType: string;
    type: string;
    entry: QuestionnaireEntryType[];
};

export type QuestionnaireSliceInitStateType = {
    bundleResourceType: string;
    bundleType: string;
    questionnaireIndex: number;
    questionnaireEntryArray: QuestionnaireEntryType[];
    questionnaireEntry: QuestionnaireEntryType;
};

export type QuestionnaireClientSliceInitStateType = {
    fullUrl: string;
    resource: QuestionResource;
    rootItem?: QuestionItem;
    resourceItemArray: QuestionItem[];
};
