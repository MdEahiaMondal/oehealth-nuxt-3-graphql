<script setup lang="ts">
import { Form } from "vee-validate";
import { useToast } from "vue-toastification";
import { useAuth } from "~~/composables/useAuth";
import { useQuestions } from "~~/composables/useQuestions";
import { useCommon } from "~~/composables/useCommon";

definePageMeta({
  middleware: "patient",
});

const toast = useToast();
const { getUserProfile, isDoctor } = useAuth();

const {
  fetchQuestions,
  createQuestionDiseases,
  createQuestionDiseasesAnswer,
  updateQuestionDiseasesAnswer,
  deleteQuestionDiseases,
  deleteUserAllQuestionDiseases,
  getAllOfQuestions: allOfQuestions,
  SET_CLEAR_QUESTION_ANSWER,
  SET_UPDATE_QUESTION_DISPLAY,
  SET_UPDATE_QUESTION_INFOMATION,
} = useQuestions();
const { setOverlay } = useCommon();

const authUser = computed(() => getUserProfile.value);
const getAllOfQuestions = computed(() => allOfQuestions.value);

const confirmation = ref();

const storeUserAnswer = async (question: any) => {
  const { data }: any = await createQuestionDiseases({
    questionId: Number(question.id),
    userId: Number(authUser.value?.id),
    createdById: Number(authUser.value?.id),
    updatedById: Number(authUser.value?.id),
  });

  const { createDisease } = data;

  if (createDisease && createDisease.disease?.id) {
    if (question.elementType.name === "CHECK_BOX") {
      let questionResponseId: string | number;
      for (questionResponseId of question.userAnswer.answer) {
        await createQuestionDiseasesAnswer({
          diseasesId: Number(createDisease.disease?.id),
          questionResponseId,
          inputValue: null,
          createdById: Number(authUser.value?.id),
          updatedById: Number(authUser.value?.id),
        });
      }
    } else {
      const questionResponseId =
        question.elementType.name === "RADIO_BUTTON"
          ? question.userAnswer.answer
          : null;
      const inputValue =
        question.elementType.name === "TEXT_BOX"
          ? question.userAnswer.answer
          : null;

      await createQuestionDiseasesAnswer({
        diseasesId: Number(createDisease.disease?.id),
        questionResponseId,
        inputValue,
        createdById: Number(authUser.value?.id),
        updatedById: Number(authUser.value?.id),
      });
    }
  }
};

const updateUserAnswer = async (question: any) => {
  if (question.elementType.name === "CHECK_BOX") {
    await deleteQuestionDiseases({
      diseasesId: Number(question.userAnswer.diseasesId),
    });
    await storeUserAnswer(question);
  } else {
    const questionResponseId =
      question.elementType.name === "RADIO_BUTTON"
        ? question.userAnswer.answer
        : null;
    const inputValue =
      question.elementType.name === "TEXT_BOX"
        ? question.userAnswer.answer
        : null;

    await updateQuestionDiseasesAnswer({
      diseaseAnswerId: Number(question.userAnswer.diseaseanswerId),
      diseasesId: Number(question.userAnswer.diseasesId),
      questionResponseId,
      inputValue,
      updatedById: Number(authUser.value?.id),
    });
  }
};

const createOrUpdateAllOfQuestion = async (question: any) => {
  if (question.elementType.name === "CHECK_BOX") {
    if (question.userAnswer.answer.length > 0) {
      if (question.userAnswer.diseasesId) {
        await updateUserAnswer(question);
      } else {
        await storeUserAnswer(question);
      }
    }
  } else {
    if (question.userAnswer.answer) {
      if (
        question.userAnswer.diseasesId &&
        question.userAnswer.diseaseanswerId
      ) {
        await updateUserAnswer(question);
      } else {
        await storeUserAnswer(question);
      }
    }
  }
};

const handleUpdate = async () => {
  setOverlay(true);

  let question: any;
  for (question of getAllOfQuestions.value) {
    await createOrUpdateAllOfQuestion(question);
  }
  await fetchQuestions({
    userId: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  reRenderAllOfQuestion();
  setOverlay(false);
  toast.success("Answer Successfully updated!");
};

const dicardAll = async () => {
  confirmation.value
    .open("Alert", "Do you want to retrieve the previous answer?", {
      color: "red",
    })
    .then(async (res: boolean) => {
      if (res) {
        await fetchQuestions({
          userId: Number(authUser.value?.id),
          langId: authUser.value?.lang?.id,
        });
        reRenderAllOfQuestion();
        toast.success("Successfully retrieve the previous answer");
      }
      return false;
    });
};

const resetAll = async () => {
  confirmation.value
    .open("Alert", "Do you want to reset all?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        setOverlay(true);
        await deleteUserAllQuestionDiseases({
          userId: Number(authUser.value?.id),
        });
        await fetchQuestions({
          userId: Number(authUser.value?.id),
          langId: authUser.value?.lang?.id,
        });
        reRenderAllOfQuestion();
        setOverlay(false);
        toast.success("Answers to all questions have been cleared");
      }
      return false;
    });
};

const resetQuestion = async (question: any) => {
  confirmation.value
    .open("Alert", "Do you want to reset?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        setOverlay(true);
        if (question.userAnswer.diseasesId) {
          await deleteQuestionDiseases({
            diseasesId: Number(question.userAnswer.diseasesId),
          });
        }
        SET_CLEAR_QUESTION_ANSWER(question);
        setOverlay(false);
        toast.success("The question answer cleared");
      }
      return false;
    });
};

const showCloseBtn = (question: any) => {
  console.log({ showCloseBtn: question });

  // SET_QUESTION_HOVE_TRUE(question);
};

const hideCloseBtn = (question: any) => {
  console.log({ hideCloseBtn: question });

  // SET_QUESTION_HOVE_FALSE(question);
};

const displayQuestions = (
  display: boolean,
  targetAbleQuestionRefId: string | number
) => {
  const displayQuestion = getAllOfQuestions.value.find((newQ: any) => {
    return Number(newQ.referenceId) === targetAbleQuestionRefId;
  });

  if (displayQuestion && displayQuestion.id) {
    SET_UPDATE_QUESTION_DISPLAY({
      displayQuestion,
      display,
    });
  }
};

const displayConditionalQuestion = (selectedResponse: any, question: any) => {
  const display = Number(selectedResponse.referenceId) === 1 ? true : false;

  if (Number(question.referenceId) === 1002) {
    displayQuestions(display, 1003);
  } else if (Number(question.referenceId) === 1006) {
    displayQuestions(display, 1007);

    if (!display) {
      displayQuestions(display, 1008);
      displayQuestions(display, 1009);
    }
  } else if (Number(question.referenceId) === 1007) {
    if (Number(selectedResponse.referenceId) === 1) {
      displayQuestions(display, 1008);
      displayQuestions(false, 1009);
    } else if (Number(selectedResponse.referenceId) === 5) {
      displayQuestions(true, 1009);
      displayQuestions(false, 1008);
    } else {
      displayQuestions(false, 1008);
      displayQuestions(false, 1009);
    }
  } else if (Number(question.referenceId) === 1010) {
    displayQuestions(display, 1011);
  } else if (Number(question.referenceId) === 1011) {
    const display = question.userAnswer.answer.includes(selectedResponse.id);

    if (selectedResponse.referenceId === 3) {
      displayQuestions(display, 1012);
    }
  } else if (Number(question.referenceId) === 1018) {
    displayQuestions(display, 1019);

    if (!display) {
      displayQuestions(display, 1020);
    }
  } else if (Number(question.referenceId) === 1019) {
    const display = question.userAnswer.answer.includes(selectedResponse.id);

    if (selectedResponse.referenceId === 10) {
      displayQuestions(display, 1020);
    }
  }
};

const updateRadioTypeQuestionAnswer = (question: any) => {
  const selectedResponse = question.questionResponse.find((item: any) => {
    return Number(item.id) === Number(question.userAnswer.answer);
  });

  if (selectedResponse) {
    displayConditionalQuestion(selectedResponse, question);
  }

  SET_UPDATE_QUESTION_INFOMATION(question);
};

const updateInputTypeQuestionAnswer = (question: any) => {
  SET_UPDATE_QUESTION_INFOMATION(question);
};

const updateCheckboxQuestionAnswer = (checkBoxValue: any, question: any) => {
  const selectedResponse = question.questionResponse.find((item: any) => {
    return Number(item.id) === Number(checkBoxValue);
  });

  if (selectedResponse) {
    displayConditionalQuestion(selectedResponse, question);
  }
};

const reRenderAllOfQuestion = () => {
  getAllOfQuestions.value.forEach((question: any) => {
    const selectedResponse = question.questionResponse.find((item: any) => {
      return Number(item.id) === Number(question.userAnswer.answer);
    });

    if (question.elementType.name === "RADIO_BUTTON" && selectedResponse) {
      const display = Number(selectedResponse.referenceId) === 1 ? true : false;

      if (Number(question.referenceId) === 1002) {
        displayQuestions(display, 1003);
      } else if (Number(question.referenceId) === 1006) {
        displayQuestions(display, 1007);

        if (!display) {
          displayQuestions(display, 1008);
          displayQuestions(display, 1009);
        }
      } else if (Number(question.referenceId) === 1007) {
        if (Number(selectedResponse.referenceId) === 1) {
          const displayQuestion = getAllOfQuestions.value.find((newQ: any) => {
            return Number(newQ.referenceId) === 1006;
          });
          if (displayQuestion) {
            const selectedResponse = displayQuestion.questionResponse.find(
              (item: any) => {
                return (
                  Number(item.id) === Number(displayQuestion.userAnswer.answer)
                );
              }
            );
            if (selectedResponse && selectedResponse.referenceId === 2) {
              displayQuestions(false, 1008);
            } else {
              displayQuestions(true, 1008);
            }
          }
          displayQuestions(false, 1009);
        } else if (Number(selectedResponse.referenceId) === 5) {
          const displayQuestion = getAllOfQuestions.value.find((newQ: any) => {
            return Number(newQ.referenceId) === 1006;
          });
          if (displayQuestion) {
            const selectedResponse = displayQuestion.questionResponse.find(
              (item: any) => {
                return (
                  Number(item.id) === Number(displayQuestion.userAnswer.answer)
                );
              }
            );
            if (selectedResponse && selectedResponse.referenceId === 2) {
              displayQuestions(false, 1009);
            } else {
              displayQuestions(true, 1009);
            }
          }

          displayQuestions(false, 1008);
        } else {
          displayQuestions(false, 1008);
          displayQuestions(false, 1009);
        }
      } else if (Number(question.referenceId) === 1010) {
        displayQuestions(display, 1011);
      } else if (Number(question.referenceId) === 1018) {
        displayQuestions(display, 1019);

        if (!display) {
          displayQuestions(display, 1020);
        }
      }
    }

    if (question.elementType.name === "CHECK_BOX") {
      if (Number(question.referenceId) === 1019) {
        const selectedResponse = question.questionResponse.find((item: any) => {
          return Number(item.referenceId) === Number(10);
        });

        if (selectedResponse && selectedResponse.referenceId === 10) {
          const display = question.userAnswer.answer.includes(
            selectedResponse.id
          );
          displayQuestions(display, 1020);
        }
      } else if (Number(question.referenceId) === 1011) {
        const selectedResponse = question.questionResponse.find((item: any) => {
          return Number(item.referenceId) === Number(3);
        });

        if (selectedResponse && selectedResponse.referenceId === 3) {
          const display = question.userAnswer.answer.includes(
            selectedResponse.id
          );
          displayQuestions(display, 1012);
        }
      }
    }
  });
};

onMounted(async () => {
  await fetchQuestions({
    userId: Number(authUser.value?.id),
    langId: authUser.value?.lang?.id,
  });
  reRenderAllOfQuestion();
});
</script>

<template>
  <v-card class="rounded-0">
    <v-row class="tw-w-full">
      <Form class="tw-w-full" as="v-form" @submit="handleUpdate">
        <v-col class="tw-w-full">
          <v-card flat class="rounded-0 tw-w-full">
            <v-card-text>
              <h3 class="title text-h6 mb-6">
                {{ $t("diseases.associatedDiseases") }}
              </h3>
              <h1 class="text-body-1 text-grey-darken-2 mb-6">
                {{ $t("diseases.sufferFrom") }}
              </h1>
              <v-row>
                <template v-for="(question, index) in getAllOfQuestions">
                  <v-col
                    v-if="!question.isConditionalQuestion || question.display"
                    :key="index"
                    cols="4"
                  >
                    <v-list-item
                      class="pa-0 mb-1"
                      @mouseover="question.hover = true"
                      @mouseleave="question.hover = false"
                    >
                      <v-list-item-title
                        class="text-subtitle-2 border-2 border-gray-800 bg-blue-500 px-2 mr-7"
                      >
                        {{ question.title }}
                      </v-list-item-title>
                      <template v-slot:append>
                        <v-btn
                          @click="resetQuestion(question)"
                          icon
                          density="compact"
                          variant="text"
                        >
                          <v-icon
                            :class="question.hover ? '' : 'd-none'"
                            icon="mdi-close"
                            class="text-grey"
                          ></v-icon>
                        </v-btn>
                      </template>
                    </v-list-item>

                    <v-radio-group
                      @input="updateRadioTypeQuestionAnswer(question)"
                      class="mt-0"
                      inline
                      v-model="question.userAnswer.answer"
                      v-if="question.elementType.name === 'RADIO_BUTTON'"
                    >
                      <v-radio
                        color="green"
                        :key="responseIndex"
                        :value="response.id"
                        :label="response.title"
                        v-for="(
                          response, responseIndex
                        ) in question.questionResponse"
                      >
                      </v-radio>
                    </v-radio-group>

                    <div v-if="question.elementType.name === 'CHECK_BOX'">
                      <v-row>
                        <v-col cols="3"
                          ><v-checkbox
                            @input="
                              updateCheckboxQuestionAnswer(
                                response.id,
                                question
                              )
                            "
                            v-model="question.userAnswer.answer"
                            :value="response.id"
                            :label="response.title"
                            v-for="(
                              response, responseIndex
                            ) in question.questionResponse"
                            :key="responseIndex"
                            color="green"
                            hide-details
                          ></v-checkbox
                        ></v-col>
                      </v-row>
                    </div>

                    <div v-if="question.elementType.name === 'TEXT_BOX'">
                      <v-text-field
                        v-model="question.userAnswer.answer"
                        class="width px-2"
                        label="Drug Name"
                        density="compact"
                        variant="underlined"
                      ></v-text-field>
                    </div>
                  </v-col>
                </template>
              </v-row>

              <v-row>
                <v-col>
                  <BaseActionButtons
                    @discardButtonFunction="dicardAll"
                    @resetButtonFunction="resetAll"
                    class="mt-5"
                    deleteButton="d-none"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </Form>
      <BaseConfirmationDialog ref="confirmation" />
    </v-row>
  </v-card>
</template>

<style scoped>
.width {
  max-width: 85%;
}
</style>
