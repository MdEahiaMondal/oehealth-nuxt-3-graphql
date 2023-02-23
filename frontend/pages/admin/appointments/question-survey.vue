<script setup lang="ts">
import { useToast } from "vue-toastification";
import { useAuth } from "~/composables/useAuth";
import { useSurvey } from "~/composables/useSurvey";
import { DefineQuestionType, SelectedAnswerType } from "~~/types/survey";
definePageMeta({
  layout: "admin",
  middleware: "doctor",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getUserProfile } = useAuth();
const {
  fetchAppointmentSurveys,
  fetchSurveyWithQuestions,
  createAppointmentSurveyQuestionResponse,
  updateAppointmentSurveyQuestionResponse,
  deleteAppointmentSurveyQuestionResponse,
  surveyQuestionFinished,
  getQuestions,
  getAllQuestions,
  getAppointmentSurvey,
  PUSH_TARGET_QUESTION,
  UPDATE_QUESTION_ANSWER,
  UPDATE_MULTIPLE_QUESTION_ANSWER,
  REMOVE_QUESTIONS,
} = useSurvey();

const authUser = computed<any>(() => getUserProfile.value);
const questions = computed(() => getQuestions.value);
const allQuestions = computed(() => getAllQuestions.value);
const appointmentSurvey = computed(() => getAppointmentSurvey.value);
const selectedAnswer = ref<any>({});
const selectMulipleOptions = ref<any[]>([]);
const stepIndex = ref<number>(999999999999);
const nextDisable = ref(false);
const appointmentId = Number(route.query?.appointmentId);

const findNextQuestions = async (
  targetIds: number[],
  currentQuestion: DefineQuestionType,
  nextIndexNumber: number | string
) => {
  const newQs = allQuestions?.value.filter((question: DefineQuestionType) => {
    return targetIds.includes(Number(question.xmlQuestionId));
  });

  const sortQuestions = newQs.sort(function (
    q1: DefineQuestionType,
    q2: DefineQuestionType
  ) {
    return q1?.serialNo - q2?.serialNo;
  });

  PUSH_TARGET_QUESTION({
    currentQuestion,
    newQs: sortQuestions,
    nextIndexNumber,
  });
};

const jupmNextRootQuestion = async (nextIndexNumber: number) => {
  if (questions.value.length > nextIndexNumber) {
    stepIndex.value++;
  } else {
    await surveyQuestionFinished({
      appointmentSurveyId: Number(appointmentSurvey.value?.id),
      surveyId: Number(appointmentSurvey.value?.survey.id),
      appointmentId: Number(appointmentSurvey.value?.appointment.id),
      isFinished: true,
      createdById: Number(authUser.value?.id),
      updatedById: Number(authUser.value?.id),
    });
    toast.success("Your survey is successfully finished");
    router.push("/admin/appointments");
  }
};

const storeQuestionResponse = async (
  question: DefineQuestionType,
  selectedAnswer: SelectedAnswerType
) => {
  let response = null;
  if (question.userAnswer.appointmentSurveyQuestionResponseId) {
    const { data }: any = await updateAppointmentSurveyQuestionResponse({
      appointmentSurveyQuestionResponseId: Number(
        question.userAnswer.appointmentSurveyQuestionResponseId
      ),
      appointmentSurveyId: Number(appointmentSurvey.value?.id),
      surveyQuestionId: Number(question.id),
      questionResponseId: Number(selectedAnswer.id),
      responseValue: "",
      createdById: Number(authUser.value?.id),
      updatedByID: Number(authUser.value?.id),
    });
    response =
      data.updateAppointmentSurveyQuestionResponse
        ?.appointmentSurveyQuestionResponse.id;
  } else {
    const { data }: any = await createAppointmentSurveyQuestionResponse({
      appointmentSurveyId: Number(appointmentSurvey.value?.id),
      surveyQuestionId: Number(question.id),
      questionResponseId: Number(selectedAnswer.id),
      responseValue: "",
      createdById: Number(authUser.value?.id),
      updatedByID: Number(authUser.value?.id),
    });
    response =
      data.createAppointmentSurveyQuestionResponse
        ?.appointmentSurveyQuestionResponse.id;
  }
  return response;
};

const submitQuestion = async (question: DefineQuestionType, index: number) => {
  removeExistingQuestions(question, index);
  const nextIndexNumber: number = Number(index) + 1;

  if (question.userAnswer.answer || question.questionType === "LABEL") {
    if (question.questionType === "RADIO_BUTTON") {
      const answer = question.questionResponses.find(
        (answer: SelectedAnswerType) => {
          return Number(answer.id) === Number(question.userAnswer.answer);
        }
      );
      let appointmentSurveyQuestionResponseId = await storeQuestionResponse(
        question,
        answer
      );
      if (appointmentSurveyQuestionResponseId) {
        question.userAnswer.appointmentSurveyQuestionResponseId =
          appointmentSurveyQuestionResponseId;
        UPDATE_QUESTION_ANSWER(question);
        if (answer?.tragetXmlQuestionIds.length > 0) {
          await findNextQuestions(
            answer.tragetXmlQuestionIds,
            question,
            nextIndexNumber
          );
          stepIndex.value++;
          selectedAnswer.value = {};
        } else {
          jupmNextRootQuestion(nextIndexNumber);
        }
      } else {
        alert("error");
      }
    } else if (question.questionType === "MULTIPLE_SELECTION") {
      const surveyAnswers = question.questionResponses.filter(
        (answer: SelectedAnswerType) => {
          return question.userAnswer.answer.includes(answer.id);
        }
      );
      let targetXmlIds: number[] = [];
      surveyAnswers.forEach((selectedAnswer: SelectedAnswerType) => {
        targetXmlIds = targetXmlIds.concat(selectedAnswer.tragetXmlQuestionIds);
      });
      if (question.userAnswer.appointmentSurveyQuestionResponseId.length > 0) {
        let id;
        for (id of question.userAnswer.appointmentSurveyQuestionResponseId) {
          await deleteAppointmentSurveyQuestionResponse({
            appointmentSurveyQuestionResponseId: id,
          });
        }
      }
      let newAQRIds: number[] = [];
      let newQRIds: number[] = [];
      let questionResponse;
      for (questionResponse of surveyAnswers) {
        const { data }: any = await createAppointmentSurveyQuestionResponse({
          appointmentSurveyId: Number(appointmentSurvey.value?.id),
          surveyQuestionId: Number(question.id),
          questionResponseId: Number(questionResponse.id),
          responseValue: "",
          createdById: Number(authUser.value?.id),
          updatedByID: Number(authUser.value?.id),
        });
        newQRIds.push(questionResponse.id);
        if (
          data.createAppointmentSurveyQuestionResponse
            ?.appointmentSurveyQuestionResponse.id
        ) {
          newAQRIds.push(
            data.createAppointmentSurveyQuestionResponse
              ?.appointmentSurveyQuestionResponse.id
          );
        }
      }
      question.userAnswer.appointmentSurveyQuestionResponseId = newAQRIds;
      question.userAnswer.answer = newQRIds;
      UPDATE_QUESTION_ANSWER(question);
      if (targetXmlIds.length > 0) {
        await findNextQuestions(targetXmlIds, question, nextIndexNumber);
        selectMulipleOptions.value = [];
      } else {
        jupmNextRootQuestion(nextIndexNumber);
        selectMulipleOptions.value = [];
      }
    } else if (question.questionType === "TEXT_FIELD") {
      let appointmentSurveyQuestionResponseId = null;
      // create
      if (question.userAnswer.appointmentSurveyQuestionResponseId) {
        // update
        const { data }: any = await updateAppointmentSurveyQuestionResponse({
          appointmentSurveyQuestionResponseId: Number(
            question.userAnswer.appointmentSurveyQuestionResponseId
          ),
          appointmentSurveyId: Number(appointmentSurvey.value?.id),
          surveyQuestionId: Number(question.id),
          questionResponseId: "",
          responseValue: question.userAnswer.answer,
          createdById: Number(authUser.value?.id),
          updatedByID: Number(authUser.value?.id),
        });
        appointmentSurveyQuestionResponseId =
          data.updateAppointmentSurveyQuestionResponse
            ?.appointmentSurveyQuestionResponse.id;
      } else {
        const { data }: any = await createAppointmentSurveyQuestionResponse({
          appointmentSurveyId: Number(appointmentSurvey.value?.id),
          surveyQuestionId: Number(question.id),
          questionResponseId: "",
          responseValue: question.userAnswer.answer,
          createdById: Number(authUser.value?.id),
          updatedByID: Number(authUser.value?.id),
        });
        appointmentSurveyQuestionResponseId =
          data.createAppointmentSurveyQuestionResponse
            ?.appointmentSurveyQuestionResponse.id;
      }

      question.userAnswer.appointmentSurveyQuestionResponseId =
        appointmentSurveyQuestionResponseId;
      UPDATE_QUESTION_ANSWER(question);
      jupmNextRootQuestion(nextIndexNumber);
    } else {
      jupmNextRootQuestion(nextIndexNumber);
    }
  } else {
    toast.error(
      `Please ${
        question.questionType === "TEXT_FIELD" ? "type" : "select"
      } your survey`
    );
  }
};

const updateMultiSelectOptionQuestionAnswers = (
  question: DefineQuestionType,
  id: number
) => {
  UPDATE_MULTIPLE_QUESTION_ANSWER({ question, id });
};

const previousQuestion = (question: DefineQuestionType, index: number) => {
  removeExistingQuestions(question, index);
  stepIndex.value--;
  nextDisable.value = false;
};

const removeExistingQuestions = (
  question: DefineQuestionType,
  index: number
) => {
  let tragetXmlQuestionIds: number[] = [];
  question.questionResponses.forEach((answer: SelectedAnswerType) => {
    tragetXmlQuestionIds = tragetXmlQuestionIds.concat(
      answer.tragetXmlQuestionIds
    );
  });
  REMOVE_QUESTIONS({ tragetXmlQuestionIds, index });
};

onMounted(async () => {
  await fetchAppointmentSurveys({
    appointmentId,
  });

  if (appointmentSurvey.value && appointmentSurvey.value.isFinished) {
    toast.warning("Your survey already finished");
    router.push("/admin/appointments");
  } else {
    await fetchSurveyWithQuestions({
      surveyId: Number(appointmentSurvey.value?.survey.id),
      appointmentSurveyId: Number(appointmentSurvey.value?.id),
    });
  }

  stepIndex.value = 0;
});
</script>

<template>
  <v-card class="mx-auto">
    <v-window v-model="stepIndex">
      <v-window-item
        :value="index"
        v-for="(question, index) in questions"
        :key="index"
      >
        <v-card-text>
          <v-card-title class="pl-2">
            {{ question.title }}
          </v-card-title>
          <v-radio-group
            name="patient"
            hide-details
            row
            class="pt-0 mt-0"
            v-if="question.questionType === 'RADIO_BUTTON'"
            v-model="question.userAnswer.answer"
          >
            <v-radio
              :name="option.answer"
              color="green"
              :value="option.id"
              :label="option.answer"
              :key="index"
              v-for="(option, index) in question.questionResponses"
            ></v-radio>
          </v-radio-group>
          <v-row v-if="question.questionType === 'MULTIPLE_SELECTION'">
            <v-col
              cols="12"
              sm="2"
              md="2"
              :key="index"
              v-for="(option, index) in question.questionResponses"
            >
              <v-checkbox
                class="align-"
                :key="index"
                v-model="question.userAnswer.answer"
                :value="option.id"
                :label="option.answer"
                color="green"
                @change="
                  updateMultiSelectOptionQuestionAnswers(question, option.id)
                "
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-text-field
            v-if="question.questionType === 'TEXT_FIELD'"
            label="Outlined"
            outlined
            dense
            v-model="question.userAnswer.answer"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="text"
            @click="previousQuestion(question, index)"
            :disabled="stepIndex === 0"
          >
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="green"
            variant="flat"
            :disabled="nextDisable"
            @click="submitQuestion(question, Number(index))"
          >
            Next
          </v-btn>
        </v-card-actions>
      </v-window-item>
    </v-window>
  </v-card>
</template>
