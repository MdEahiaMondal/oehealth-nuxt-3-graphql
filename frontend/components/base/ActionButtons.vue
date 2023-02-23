<script setup>
const props = defineProps({
  saveButton: {
    type: String,
    required: false,
  },
  discardButton: {
    type: String,
    required: false,
  },
  deleteButton: {
    type: String,
    required: false,
  },
  resetButton: {
    type: String,
    required: false,
  },
});

const emit = defineEmits([
  "SaveButtonFunction",
  "discardButtonFunction",
  "deleteButtonFunction",
  "resetButtonFunction",
]);
const saveButtonAction = () => {
  emit("SaveButtonFunction");
};
const discardButtonAction = () => {
  emit("discardButtonFunction");
};
const deleteButtonAction = () => {
  emit("deleteButtonFunction");
};
const resetButtonAction = () => {
  emit("resetButtonFunction");
};
</script>

<template>
  <v-btn
    class="mr-2"
    :class="saveButton"
    type="submit"
    color="green"
    @click="saveButtonAction"
  >
    {{ $t("actionButtons.save") }}
  </v-btn>
  <v-btn
    class="mr-2"
    :class="discardButton"
    color="warning"
    @click="discardButtonAction"
  >
    {{ $t("actionButtons.discard") }}
  </v-btn>
  <v-btn
    class="mr-2"
    :class="deleteButton"
    color="error"
    @click="deleteButtonAction"
  >
    Delete
  </v-btn>
  <v-btn color="info" :class="resetButton" @click="resetButtonAction">
    Reset All
  </v-btn>
</template>
