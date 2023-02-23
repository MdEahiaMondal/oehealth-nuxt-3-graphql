<template>
  <v-footer app class="footer" inset>
    <v-col cols="12">
      <span class="text-caption"
        >Copyright © {{ new Date().getFullYear() }} OeHMP. All Rights
        Reserved.</span
      >
    </v-col>
  </v-footer>
</template>

<style lang="scss">
.v-application .footer {
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
  min-width: 100%;
}
.theme--light.v-footer {
  background: white;
}
</style>
