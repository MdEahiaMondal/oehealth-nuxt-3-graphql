<script setup lang="ts">
const search = ref("");
const props = defineProps({
  tableHeader: {
    type: Object,
    required: false,
  },
  flat: {
    type: Boolean,
    required: false,
    default: false,
  },
  baseClass: {
    type: String,
    required: false,
  },
  buttonText: {
    type: String,
    required: false,
  },
  secondButtonText: {
    type: String,
    required: false,
  },
  visibility: {
    type: String,
    required: false,
  },
  secondButtonVisibility: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["buttonFunction", "secondButtonFunction"]);
const actionButton = () => {
  emit("buttonFunction");
};
const secondActionButton = () => {
  emit("secondButtonFunction");
};
</script>

<template>
  <v-row>
    <v-col cols="12" sm="12">
      <v-card :flat="flat" :class="baseClass">
        <v-card-text class="pa-5">
          <h3 class="title text-h6 mb-6"><slot name="title" /></h3>
          <v-row>
            <v-col cols="12" lg="4" md="6">
              <slot name="search"></slot>
            </v-col>
            <v-col cols="12" lg="8" md="6" class="text-right">
              <v-btn
                color="info"
                class="ml-auto mr-2"
                :class="visibility"
                @click="actionButton"
              >
                {{ buttonText }}
              </v-btn>
              <v-btn
                color="info"
                class="ml-auto"
                :class="secondButtonVisibility"
                @click="secondActionButton"
              >
                {{ secondButtonText }}
              </v-btn>
            </v-col>
          </v-row>
          <v-table fixed-header hover class="mt-5">
            <thead>
              <tr>
                <th v-for="item in props.tableHeader" :key="item.id">
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <slot name="tableBody"></slot>
            </tbody>
          </v-table>
          <div class="text-center mt-4">
            <p class="text-button text-grey"><slot name="noData"></slot></p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
