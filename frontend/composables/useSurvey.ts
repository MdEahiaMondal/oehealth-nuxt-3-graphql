import { storeToRefs } from "pinia";
import { useSurveyStore } from "~~/stores/survey";

export const useSurvey = () => {
    const surveyStore = useSurveyStore();
    const {
        fetchSurvey,
        fetchAppointmentSurveys,
        fetchSurveyWithQuestions,
        createAppointmentSurveyAnswer,
        updateAppointmentSurveyAnswer,
        createAppointmentSurveyQuestionResponse,
        updateAppointmentSurveyQuestionResponse,
        deleteAppointmentSurveyQuestionResponse,
        surveyQuestionFinished,
        PUSH_TARGET_QUESTION,
        UPDATE_QUESTION_ANSWER,
        UPDATE_MULTIPLE_QUESTION_ANSWER,
        REMOVE_QUESTIONS,
    } = surveyStore;

    const {
        getSurveys,
        getAllQuestions,
        getQuestions,
        getAppointmentSurvey,
    } = storeToRefs(surveyStore);


    return {
        fetchSurvey,
        fetchAppointmentSurveys,
        fetchSurveyWithQuestions,
        createAppointmentSurveyAnswer,
        updateAppointmentSurveyAnswer,
        createAppointmentSurveyQuestionResponse,
        updateAppointmentSurveyQuestionResponse,
        deleteAppointmentSurveyQuestionResponse,
        surveyQuestionFinished,
        getSurveys,
        getAllQuestions,
        getQuestions,
        getAppointmentSurvey,
        PUSH_TARGET_QUESTION,
        UPDATE_QUESTION_ANSWER,
        UPDATE_MULTIPLE_QUESTION_ANSWER,
        REMOVE_QUESTIONS,
    }

}




