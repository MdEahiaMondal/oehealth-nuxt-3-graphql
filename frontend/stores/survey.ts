import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { useAuth } from '~~/composables/useAuth'
import {
    fetchSurveyQuery,
    fetchAppointmentSurveysQuery,
    fetchSurveyWithQuestionsQuery,
    createAppointmentSurveyAnswerQuery,
    updateAppointmentSurveyAnswerQuery,
    createAppointmentSurveyQuestionResponseQuery,
    updateAppointmentSurveyQuestionResponseQuery,
    deleteAppointmentSurveyQuestionResponseQuery,
    surveyQuestionFinishedQuery,
} from '~/query/survey'
import {
    DefineQuestionType,
    SurveyQuestionFinishedParamsType,
    DeleteAppointmentSurveyQuestionResponseParamsType,
    UpdateAppointmentSurveyQuestionResponseParamsType,
    CreateAppointmentSurveyQuestionResponseParamsType,
    UpdateAppointmentSurveyAnswerParamsType,
    CreateAppointmentSurveyAnswerParamsType,
} from "~~/types/survey";


export const useSurveyStore = defineStore('survey', () => {
    const { getUserProfile } = useAuth()

    const loading = ref(false)
    const surveys = ref<any[]>([])
    const questions = ref<DefineQuestionType[]>([])
    const nextQuestions = ref<DefineQuestionType[]>([])
    const appointmentSurvey = ref<any>({})


    const authUser = computed(() => getUserProfile.value)


    const getSurveys = computed(() => surveys.value)
    const getAllQuestions = computed(() => questions.value)
    const getQuestions = computed(() => nextQuestions.value)
    const getAppointmentSurvey = computed(() => appointmentSurvey.value)



    const PUSH_TARGET_QUESTION = ({ currentQuestion, newQs, nextIndexNumber }: any) => {
        nextQuestions.value.splice(nextIndexNumber, 0, ...newQs)

        const uniqueQuestion = [...new Map(nextQuestions.value.map((item: any) =>
            [item['id'], item])).values()];

        nextQuestions.value = uniqueQuestion
    }

    const UPDATE_QUESTION_ANSWER = (question: any) => {
        const index = nextQuestions.value.findIndex((ques: any) => {
            return Number(question.id) === Number(ques.id)
        })
        nextQuestions.value[index] = question
        // Vue.set(state.nextQuestions, index, question)
    }

    const UPDATE_MULTIPLE_QUESTION_ANSWER = ({ question, id }: any) => {
        const questionIndex = nextQuestions.value.findIndex((ques: any) => {
            return Number(question.id) === Number(ques.id)
        })

        if (questionIndex > -1) {
            let newQuestion = JSON.parse(JSON.stringify(question))
            if (newQuestion.userAnswer.answer.indexOf(id) != -1) {
                const newList = newQuestion.userAnswer.answer.filter((data: any) => data != id);
                newQuestion.userAnswer.answer = newList
            } else {
                newQuestion.userAnswer.answer.push(id)
            }

            nextQuestions.value[questionIndex] = question
            // Vue.set(state.nextQuestions, questionIndex, question)
        }
    }


    const REMOVE_QUESTIONS = ({ tragetXmlQuestionIds, index }: any) => {
        if (tragetXmlQuestionIds.length > 0) {
            const solidQuestions = nextQuestions.value.filter((question: any) => {
                return !tragetXmlQuestionIds.includes(question.xmlQuestionId)
            })
            nextQuestions.value = solidQuestions
        }
    }


    const fetchSurvey = async ({ doctorId }: any) => {
        const variables = { doctorId }
        const { onResult: fetchSurveyDone } = useQuery(fetchSurveyQuery, variables)
        fetchSurveyDone(({ data }: any) => {
            const { surveys: newData } = data
            surveys.value = newData
        })
    }

    const fetchAppointmentSurveys = async ({ appointmentId }: any) => {
        const variables = { appointmentId }
        const { data } = await useAsyncQuery(fetchAppointmentSurveysQuery, variables)
        const { appointmentSurveys: newData }: any = data?.value
        appointmentSurvey.value = newData[0]
        return newData[0];
    }


    const fetchSurveyWithQuestions = async ({ surveyId, appointmentSurveyId }: any) => {
        const variables = { surveyId, appointmentSurveyId }
        const { onResult: fetchSurveyWithQuestionsDone } = useQuery(fetchSurveyWithQuestionsQuery, variables)
        fetchSurveyWithQuestionsDone(({ data }: any) => {
            const { surveys: newData } = data
            const deepClone = cloneDeep(newData[0])

            const newQuestions = deepClone.surveysquestionSet?.edges.map((question: any) => {
                const userAnswerUpdated: any = {
                    appointmentSurveyQuestionResponseId: question.node.questionType === 'MULTIPLE_SELECTION' ? [] : '',
                    answer: question.node.questionType === 'MULTIPLE_SELECTION' ? [] : ''
                }

                if (
                    question.node.appointmentsurveyquestionresponseSet.edges &&
                    question.node.appointmentsurveyquestionresponseSet.edges.length > 0
                ) {
                    if (question.node.questionType === 'RADIO_BUTTON') {
                        const userResponse: any = question.node.appointmentsurveyquestionresponseSet.edges[0]
                        userAnswerUpdated.appointmentSurveyQuestionResponseId = Number(userResponse.node.id)
                        userAnswerUpdated.answer = Number(userResponse.node.questionResponse.id)
                    }
                    if (question.node.questionType === 'TEXT_FIELD') {
                        const userResponse = question.node.appointmentsurveyquestionresponseSet.edges[0]
                        userAnswerUpdated.appointmentSurveyQuestionResponseId = Number(userResponse.node.id)
                        userAnswerUpdated.answer = userResponse.node.responseValue
                    }
                    if (question.node.questionType === 'MULTIPLE_SELECTION') {
                        const userResponse = question.node.appointmentsurveyquestionresponseSet.edges
                        const ids: any[] = []
                        const answers: any[] = []
                        userResponse.forEach((response: any) => {
                            ids.push(Number(response.node.id))
                            answers.push(Number(response.node.questionResponse.id))
                        })
                        userAnswerUpdated.appointmentSurveyQuestionResponseId = ids
                        userAnswerUpdated.answer = answers
                    }
                }
                return {
                    id: Number(question.node.id),
                    title: question.node.title,
                    xmlQuestionId: question.node.xmlQuestionId ? Number(question.node.xmlQuestionId) : null,
                    isConditionalQuestion: question.node.isConditionalQuestion,
                    questionType: question.node.questionType,
                    parentQuestion: question.node.parentQuestion?.id,
                    serialNo: Number(question.node.serialNo),
                    questionResponses: question.node.surveyquestionresponseSet?.edges.map((option: any) => {
                        return {
                            id: Number(option.node.id),
                            answer: option.node.questionResponse,
                            xmlQuestionId: Number(option.node.xmlQuestionId),
                            tragetXmlQuestionIds: option.node.surveyquestionrelationSet?.edges.map((targetQuestion: any) => {
                                return Number(targetQuestion.node.xmlQuestionResponseTargetQuestionId)
                            })
                        }
                    }),
                    userAnswer: userAnswerUpdated
                }
            })

            const parentQuestions = newQuestions.filter((question: any) => {
                return question.parentQuestion === undefined ||
                    question.parentQuestion === null ||
                    question.parentQuestion === ''
            })
            nextQuestions.value = parentQuestions
            questions.value = newQuestions
        })
    }


    const createAppointmentSurveyAnswer = async ({ appointmentDecisionTreeId, surveyId, surveyAnswerId, createdById }: CreateAppointmentSurveyAnswerParamsType) => {
        const variables = { appointmentDecisionTreeId, surveyId, surveyAnswerId, createdById }
        const { mutate: setCreateAppointmentSurveyAnswer } = useMutation(createAppointmentSurveyAnswerQuery, { variables })
        return await setCreateAppointmentSurveyAnswer()
    }

    const updateAppointmentSurveyAnswer = async ({ appointmentSurveyAnswerId, appointmentDecisionTreeId, surveyId, surveyAnswerId, createdById }: UpdateAppointmentSurveyAnswerParamsType) => {
        const variables = { appointmentSurveyAnswerId, appointmentDecisionTreeId, surveyId, surveyAnswerId, createdById }
        const { mutate: setUpdateAppointmentSurveyAnswer } = useMutation(updateAppointmentSurveyAnswerQuery, { variables })
        return await setUpdateAppointmentSurveyAnswer()
    }

    const createAppointmentSurveyQuestionResponse = async ({ appointmentSurveyId, surveyQuestionId, questionResponseId, responseValue, createdById, updatedByID }: CreateAppointmentSurveyQuestionResponseParamsType) => {
        const variables = { appointmentSurveyId, surveyQuestionId, questionResponseId, responseValue, createdById, updatedByID }
        const { mutate: setCreateAppointmentSurveyQuestionResponse } = useMutation(createAppointmentSurveyQuestionResponseQuery, { variables })
        return await setCreateAppointmentSurveyQuestionResponse()
    }

    const updateAppointmentSurveyQuestionResponse = async ({ appointmentSurveyQuestionResponseId, appointmentSurveyId, surveyQuestionId, questionResponseId, responseValue, createdById, updatedByID }: UpdateAppointmentSurveyQuestionResponseParamsType) => {
        const variables = { appointmentSurveyQuestionResponseId, appointmentSurveyId, surveyQuestionId, questionResponseId, responseValue, createdById, updatedByID }
        const { mutate: setUpdateAppointmentSurveyQuestionResponse } = useMutation(updateAppointmentSurveyQuestionResponseQuery, { variables })
        return await setUpdateAppointmentSurveyQuestionResponse()
    }
    const deleteAppointmentSurveyQuestionResponse = async ({ appointmentSurveyQuestionResponseId }: DeleteAppointmentSurveyQuestionResponseParamsType) => {
        const variables = { appointmentSurveyQuestionResponseId }
        const { mutate: setDeleteAppointmentSurveyQuestionResponse } = useMutation(deleteAppointmentSurveyQuestionResponseQuery, { variables })
        return await setDeleteAppointmentSurveyQuestionResponse()
    }

    const surveyQuestionFinished = async ({ appointmentSurveyId, surveyId, appointmentId, isFinished = true, createdById, updatedById }: SurveyQuestionFinishedParamsType) => {
        const variables = { appointmentSurveyId, surveyId, appointmentId, isFinished, createdById, updatedById }
        const { mutate: setSurveyQuestionFinished } = useMutation(surveyQuestionFinishedQuery, { variables })
        return await setSurveyQuestionFinished()
    }



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
})
