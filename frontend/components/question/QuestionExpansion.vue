<template>
  <div>
    <v-list>
      <v-list-item
        :border="true"
        class="tw-border-b-0"
        v-for="(question, index) in getOnlyYesAndDontKnowQuestions"
        :key="index"
        :title="question.title"
      >
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-help-circle</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <template v-if="question.type === 'CHECK_BOX'">
            <span v-for="answer in question.answer">{{ answer }}</span>
          </template>
          <template v-else="">
            {{ question.answer }}
          </template>
        </template>
      </v-list-item>
    </v-list>
    <p v-if="getOnlyYesAndDontKnowQuestions.length === 0">
      Not found any question
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";
import { useQuestions } from "~~/composables/useQuestions";

const props = defineProps({
  userId: { type: String, default: null },
});

const { getUserProfile } = useAuth();
const authUser = computed<any>(() => getUserProfile.value);
const getOnlyYesAndDontKnowQuestions = computed(() => questions.value);

const { fetchQuestions, getOnlyYesAndDontKnowQuestions: questions } =
  useQuestions();

watch(
  () => props.userId,
  async (userid: string) => {
    if (userid) {
      await fetchQuestions({
        userId: Number(userid),
        langId: authUser.value?.lang?.id,
      });
    }
  }
);

onMounted(async () => {
  if (props.userId) {
    await fetchQuestions({
      userId: Number(props.userId),
      langId: authUser.value?.lang?.id,
    });
  }
});
</script>

<style lang="scss" scoped>
::v-deep {
  .sub-radio {
    .v-input__control {
      .v-input__slot {
        .v-input--radio-group__input {
          align-items: flex-start;
        }
      }
    }
  }
}
</style>
