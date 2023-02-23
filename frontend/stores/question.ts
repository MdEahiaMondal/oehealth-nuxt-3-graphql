import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { useAuth } from '~~/composables/useAuth'
import {
    fetchQuestionsQuery,
    createQuestionDiseasesQuery,
    createQuestionDiseasesAnswerQuery,
    updateQuestionDiseasesAnswerQuery,
    deleteQuestionDiseasesQuery,
    deleteUserAllQuestionDiseasesQuery,
    deleteQuestionDiseasesAnswerQuery,
} from '~/query/question'




export const useQuestionStore = defineStore('question', () => {
    const { getUserProfile } = useAuth()

    const questions = ref<any[]>([])
    const answers = ref<any[]>([])


    const authUser = computed(() => getUserProfile.value)

    const getAllOfQuestions = computed(() => {
        return questions.value.map((item: any) => {
            return item
        })
    })

    const getOnlyYesAndDontKnowQuestions = computed(() => {
        const appendNewQuestions: any[] = []

        questions.value?.forEach((question: any) => {
            if (question.elementType.name === 'RADIO_BUTTON') {
                const selectedResponse = question.questionResponse.find((response: any) => {
                    return Number(response.id) === Number(question.userAnswer.answer)
                })

                if (selectedResponse && (selectedResponse.title === "I Don't know" || selectedResponse.title === "Yes")) {
                    appendNewQuestions.push(question)
                    if (Number(question.referenceId) === 1002 && Number(selectedResponse.referenceId) === 1) {
                        const relatedQuestion = questions.value?.find((newQ: any) => {
                            return Number(newQ.referenceId) === 1003

                        })
                        appendNewQuestions.push(relatedQuestion)
                    } else if (Number(question.referenceId) === 1006 && Number(selectedResponse.referenceId) === 1) {
                        const relatedQuestion = questions.value.find((newQ: any) => {
                            return Number(newQ.referenceId) === 1007
                        })
                        appendNewQuestions.push(relatedQuestion)

                        const selectedResponse = relatedQuestion.questionResponse.find((response: any) => {
                            return Number(response.id) === Number(relatedQuestion.userAnswer.answer)
                        })

                        if (selectedResponse && Number(selectedResponse.referenceId) === 1) {
                            const relatedQuestion = questions.value.find((newQ: any) => {
                                return Number(newQ.referenceId) === 1008

                            })
                            appendNewQuestions.push(relatedQuestion)

                        } else if (selectedResponse && Number(selectedResponse.referenceId) === 5) {
                            const relatedQuestion = questions.value.find((newQ: any) => {
                                return Number(newQ.referenceId) === 1009
                            })
                            appendNewQuestions.push(relatedQuestion)
                        }
                    } else if (Number(question.referenceId) === 1010 && Number(selectedResponse.referenceId) === 1) {
                        const relatedQuestion = questions.value.find((newQ: any) => {
                            return Number(newQ.referenceId) === 1011

                        })
                        appendNewQuestions.push(relatedQuestion)


                        const selectedResponse = relatedQuestion.questionResponse.find((response: any) => {
                            return Number(response.referenceId) === Number(3)
                        })

                        if (selectedResponse && relatedQuestion.userAnswer.answer.includes(selectedResponse.id)) {
                            const relatedQuestion = questions.value.find((newQ: any) => {
                                return Number(newQ.referenceId) === 1012

                            })
                            appendNewQuestions.push(relatedQuestion)
                        }

                    } else if (Number(question.referenceId) === 1018 && Number(selectedResponse.referenceId) === 1) {
                        const relatedQuestion = questions.value.find((newQ: any) => {
                            return Number(newQ.referenceId) === 1019

                        })
                        appendNewQuestions.push(relatedQuestion)

                        const selectedResponse = relatedQuestion.questionResponse.find((response: any) => {
                            return Number(response.referenceId) === Number(10)
                        })

                        if (selectedResponse && relatedQuestion.userAnswer.answer.includes(selectedResponse.id)) {
                            const relatedQuestion = questions.value.find((newQ: any) => {
                                return Number(newQ.referenceId) === 1020

                            })
                            appendNewQuestions.push(relatedQuestion)
                        }
                    }
                }
            }
        })


        let newQuestions = appendNewQuestions.map((question: any) => {
            let answer: any;
            if (question.elementType.name === 'RADIO_BUTTON') {
                const selectedResponse = question.questionResponse.find((response: any) => {
                    return Number(response.id) === Number(question.userAnswer.answer)
                })
                if (selectedResponse) {
                    answer = selectedResponse.title
                }

            } else if (question.elementType.name === 'CHECK_BOX') {
                let ans: any = []
                question.userAnswer.answer.forEach((answer: any) => {
                    const selectedResponse = question.questionResponse.find((response: any) => {
                        return Number(response.id) === Number(answer)
                    })
                    if (selectedResponse) {
                        ans.push(selectedResponse.title)
                    }
                })

                answer = ans

            } else if (question.elementType.name === 'TEXT_BOX') {
                answer = question.userAnswer.answer
            }

            return {
                id: question.id,
                title: question.title,
                type: question.elementType.name,
                answer,
            }
        })

        return newQuestions
    })



    const SET_CLEAR_QUESTION_ANSWER = (questionPaload: any) => {
        const questionIndex = questions.value?.findIndex((question: any) => {
            if (question.id === questionPaload.id) {
                return question
            }
        })
        questions.value[questionIndex] = questionPaload
        questions.value[questionIndex].userAnswer = {
            diseasesId: null,
            diseaseanswerId: null,
            answer: null,
        }

        if (questions.value[questionIndex].elementType.name === 'CHECK_BOX') {
            questions.value[questionIndex].userAnswer.diseaseanswerId = []
            questions.value[questionIndex].userAnswer.answer = []
        }

        questions.value[questionIndex] = questions.value[questionIndex]
        // Vue.set(state.questions, questionIndex, state.questions[questionIndex])
    }

    const SET_QUESTION_HOVE_TRUE = (questionPaload: any) => {
        const questionIndex = questions.value?.findIndex((question: any) => {
            if (question.id === questionPaload.id) {
                return question
            }
        })
        if (questionIndex > -1) {
            let question = questions.value[questionIndex] = questionPaload
            question.hover = true

            questions.value[questionIndex] = question
            // Vue.set(state.questions, questionIndex, question)
        }
    }

    const SET_QUESTION_HOVE_FALSE = (questionPaload: any) => {
        const questionIndex = questions.value.findIndex((question: any) => {
            if (question.id === questionPaload.id) {
                return question
            }
        })
        if (questionIndex > -1) {
            let question = questions.value[questionIndex] = questionPaload
            question.hover = false

            questions.value[questionIndex] = question
            // Vue.set(state.questions, questionIndex, question)
        }
    }

    const SET_UPDATE_QUESTION_DISPLAY = ({ displayQuestion, display }: any) => {
        const questionIndex = questions.value?.findIndex((item: any) => {
            if (item.id === displayQuestion.id) {
                return item
            }
        })
        if (questionIndex > -1) {
            let newQuestion = displayQuestion
            newQuestion.display = display

            questions.value[questionIndex] = newQuestion
            // Vue.set(state.questions, questionIndex, newQuestion)
        }
    }


    const SET_UPDATE_QUESTION_INFOMATION = (questionPaload: any) => {
        const questionIndex = questions.value.findIndex((question: any) => {
            if (question.id === questionPaload.id) {
                return question
            }
        })
        if (questionIndex > -1) {
            let question = questions.value[questionIndex] = questionPaload
            questions.value[questionIndex] = question
            // Vue.set(state.questions, questionIndex, question)
        }
    }


    const SET_UPDATE_CHECK_BOX_TYPE_QUESTION_ANSWERS = ({ checkBoxValue, question }: any) => {
        const questionIndex = questions.value?.findIndex((item: any) => {
            if (item.id === question.id) {
                return item
            }
        })
        if (questionIndex > -1) {
            let newQuestion = questions.value[questionIndex]
            if (newQuestion.userAnswer.answer.indexOf(checkBoxValue) != -1) {
                const newList = newQuestion.userAnswer.answer.filter((data: any) => data != checkBoxValue);
                newQuestion.userAnswer.answer = newList
            } else {
                newQuestion.userAnswer.answer.push(checkBoxValue)
            }
            questions.value[questionIndex] = newQuestion
            // Vue.set(state.questions, questionIndex, newQuestion)
        }
    }


    const fetchQuestions = async ({ userId, langId }: any) => {
      const variables = { userId, langId };
      const { onResult: onFetchQuestionsIsDone } = useQuery(
        fetchQuestionsQuery,
        variables
      );

      onFetchQuestionsIsDone(({ data }: any) => {
        const { questions: dataQuestions }: any = data;
        const deepClone = cloneDeep(dataQuestions);

        const newQuestions = deepClone.edges.map((item: any) => {
          let questionResponse: any = [];
          item.node.questionresponseSet.edges.forEach((qR: any) => {
            let title = qR.node.title;
            if (
              qR.node.questionresponselangSet &&
              qR.node.questionresponselangSet.edges?.length > 0
            ) {
              title = qR.node.questionresponselangSet.edges[0]?.node?.title;
            }
            questionResponse.push({
              id: qR.node.id,
              title,
              referenceId: qR.node.referenceId,
            });
          });

          const userAnswerUpdated: any = {
            diseasesId: "",
            diseaseanswerId: "",
            answer: "",
          };

          if (
            item.node.elementType &&
            item.node.elementType.name === "CHECK_BOX"
          ) {
            userAnswerUpdated.diseaseanswerId = [];
            userAnswerUpdated.answer = [];
          }

          if (item.node.diseaseSet && item.node.diseaseSet.edges.length > 0) {
            const disease = item.node.diseaseSet.edges[0].node;
            userAnswerUpdated.diseasesId = disease.id;
            if (
              disease.diseaseanswerSet &&
              disease.diseaseanswerSet.edges.length > 0
            ) {
              if (
                item.node.elementType &&
                item.node.elementType.name === "CHECK_BOX"
              ) {
                disease.diseaseanswerSet.edges.forEach((item: any) => {
                  userAnswerUpdated.diseaseanswerId.push(item.node.id);
                  userAnswerUpdated.answer.push(item.node.questionResponse.id);
                });
              } else {
                const diseaseAnswer = disease.diseaseanswerSet.edges[0].node;
                userAnswerUpdated.diseaseanswerId = diseaseAnswer.id;
                userAnswerUpdated.answer = diseaseAnswer.value
                  ? diseaseAnswer.value
                  : diseaseAnswer.questionResponse.id;
              }
            }
          }

          let title = item.node.title;
          if (
            item.node.questionlangSet &&
            item.node.questionlangSet.edges?.length > 0
          ) {
            title = item.node.questionlangSet.edges[0]?.node?.title;
          }

          return {
            id: item.node.id,
            title,
            elementType: item.node.elementType,
            referenceId: item.node.referenceId,
            isConditionalQuestion: item.node.isConditionalQuestion,
            serialNo: item.node.serialNo,
            questionResponse,
            userAnswer: userAnswerUpdated,
            hover: false,
            display: false,
          };
        });
        questions.value = newQuestions;
        return questions.value;
      });
    };

    const createQuestionDiseases = async ({ questionId, userId, createdById, updatedById }: any) => {
        const variables = { questionId, userId, createdById, updatedById }
        const { mutate: setCreateQuestionDiseases } = useMutation(createQuestionDiseasesQuery, { variables })
        return await setCreateQuestionDiseases()
    }

    const createQuestionDiseasesAnswer = async ({ diseasesId, questionResponseId, inputValue, createdById, updatedById }: any) => {
        const variables = { diseasesId, questionResponseId, inputValue, createdById, updatedById }
        const { mutate: setCreateQuestionDiseasesAnswer } = useMutation(createQuestionDiseasesAnswerQuery, { variables })
        return await setCreateQuestionDiseasesAnswer()
    }

    const updateQuestionDiseasesAnswer = async ({ diseaseAnswerId, diseasesId, questionResponseId, inputValue, updatedById }: any) => {
        const variables = { diseaseAnswerId, diseasesId, questionResponseId, inputValue, updatedById }
        const { mutate: setUpdateQuestionDiseasesAnswer } = useMutation(updateQuestionDiseasesAnswerQuery, { variables })
        return await setUpdateQuestionDiseasesAnswer()
    }

    const deleteQuestionDiseases = async ({ diseasesId }: any) => {
        const variables = { diseasesId }
        const { mutate: setDeleteQuestionDiseases } = useMutation(deleteQuestionDiseasesQuery, { variables })
        return await setDeleteQuestionDiseases()
    }

    const deleteUserAllQuestionDiseases = async ({ userId }: any) => {
        const variables = { userId }
        const { mutate: setDeleteUserAllQuestionDiseases } = useMutation(deleteUserAllQuestionDiseasesQuery, { variables })
        return await setDeleteUserAllQuestionDiseases()
    }

    const deleteQuestionDiseasesAnswer = async ({ userId }: any) => {
        const variables = { userId }
        const { mutate: setDeleteQuestionDiseasesAnswer } = useMutation(deleteQuestionDiseasesAnswerQuery, { variables })
        return await setDeleteQuestionDiseasesAnswer()
    }

    return {
        fetchQuestions,
        createQuestionDiseases,
        createQuestionDiseasesAnswer,
        updateQuestionDiseasesAnswer,
        deleteQuestionDiseases,
        deleteUserAllQuestionDiseases,
        deleteQuestionDiseasesAnswer,
        getAllOfQuestions,
        getOnlyYesAndDontKnowQuestions,
        SET_CLEAR_QUESTION_ANSWER,
        SET_QUESTION_HOVE_TRUE,
        SET_QUESTION_HOVE_FALSE,
        SET_UPDATE_QUESTION_DISPLAY,
        SET_UPDATE_QUESTION_INFOMATION,
        SET_UPDATE_CHECK_BOX_TYPE_QUESTION_ANSWERS,
    }
})
