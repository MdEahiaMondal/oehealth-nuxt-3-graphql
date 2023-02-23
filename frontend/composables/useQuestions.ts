import { storeToRefs } from "pinia";
import { useQuestionStore } from "~~/stores/question";

export const useQuestions = () => {
    const questionStore = useQuestionStore();
    const {
        fetchQuestions,
        createQuestionDiseases,
        createQuestionDiseasesAnswer,
        updateQuestionDiseasesAnswer,
        deleteQuestionDiseases,
        deleteUserAllQuestionDiseases,
        deleteQuestionDiseasesAnswer,
        SET_CLEAR_QUESTION_ANSWER,
        SET_QUESTION_HOVE_TRUE,
        SET_QUESTION_HOVE_FALSE,
        SET_UPDATE_QUESTION_DISPLAY,
        SET_UPDATE_QUESTION_INFOMATION,
        SET_UPDATE_CHECK_BOX_TYPE_QUESTION_ANSWERS,
    } = questionStore;

    const {
        getAllOfQuestions,
        getOnlyYesAndDontKnowQuestions,
    } = storeToRefs(questionStore);


    return {
        fetchQuestions,
        createQuestionDiseases,
        createQuestionDiseasesAnswer,
        updateQuestionDiseasesAnswer,
        deleteQuestionDiseases,
        deleteUserAllQuestionDiseases,
        deleteQuestionDiseasesAnswer,
        SET_CLEAR_QUESTION_ANSWER,
        SET_QUESTION_HOVE_TRUE,
        SET_QUESTION_HOVE_FALSE,
        SET_UPDATE_QUESTION_DISPLAY,
        SET_UPDATE_QUESTION_INFOMATION,
        SET_UPDATE_CHECK_BOX_TYPE_QUESTION_ANSWERS,
        getAllOfQuestions,
        getOnlyYesAndDontKnowQuestions,
    }

}




