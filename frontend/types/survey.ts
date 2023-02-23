
export interface DefineQuestionType {
    id: number;
    title?: string;
    xmlQuestionId?: string | number;
    isConditionalQuestion?: boolean;
    questionType?: string;
    parentQuestion?: string;
    serialNo: number;
    questionResponses?: any;
    userAnswer?: any;
}

export interface SelectedAnswerType {
    id?: number;
    answer: any;
    xmlQuestionId: number;
    tragetXmlQuestionIds: number[];
}


export interface SurveyQuestionFinishedParamsType {
    appointmentSurveyId?: number,
    surveyId?: number,
    appointmentId?: number,
    isFinished?: boolean,
    createdById?: number,
    updatedById?: number
}

export interface DeleteAppointmentSurveyQuestionResponseParamsType {
    appointmentSurveyQuestionResponseId: number,
}

export interface UpdateAppointmentSurveyQuestionResponseParamsType {
    appointmentSurveyQuestionResponseId?: number,
    appointmentSurveyId?: number,
    surveyQuestionId?: number,
    questionResponseId?: number | string,
    responseValue?: string,
    createdById?: number,
    updatedByID?: number,
}

export interface CreateAppointmentSurveyQuestionResponseParamsType {
    appointmentSurveyId?: number,
    surveyQuestionId?: number,
    questionResponseId?: number | string,
    responseValue?: string,
    createdById?: number,
    updatedByID?: number,
}

export interface UpdateAppointmentSurveyAnswerParamsType {
    appointmentSurveyAnswerId?: number,
    appointmentDecisionTreeId?: number,
    surveyId?: number,
    surveyAnswerId?: number,
    createdById?: number,
}

export interface CreateAppointmentSurveyAnswerParamsType {
    appointmentDecisionTreeId?: number,
    surveyId?: number,
    surveyAnswerId?: number,
    createdById?: number,
}