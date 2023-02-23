<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <section class="header-background outer-height tw-py-5">
    <div class="second-background box-shadow custom-container">
      <div
        class="tw-flex tw-justify-between tw-items-center inner-height tw-px-14"
      >
        <img src="@/assets/images/home-page/logo.svg" />
        <div class="d-flex">
          <router-link :to="{ path: '/' }" custom v-slot="{ href, navigate }">
            <a
              class="link-text"
              :class="[
                $route.fullPath === '/' ? 'router-link-exact-active' : '',
              ]"
              :href="href"
              @click="navigate"
              >Home</a
            >
          </router-link>

          <router-link
            :to="{ path: '/', hash: '#project' }"
            custom
            v-slot="{ href, navigate }"
          >
            <a
              class="link-text"
              :class="[
                $route.fullPath === '/#project'
                  ? 'router-link-exact-active'
                  : '',
              ]"
              :href="href"
              @click="navigate"
              >Product Sheet</a
            >
          </router-link>
          <router-link class="link-text" to="/start">Start Now</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
a.router-link-exact-active::after {
  content: "";
  width: 8px;
  height: 8px;
  background: #111111;
  border-radius: 50%;
  display: block;
  left: 50%;
  position: absolute;
  margin-left: -4px;
}
.custom-container {
  max-width: 1330px;
  margin: auto;
}

.header-background {
  background-image: url("@/assets/images/home-page/header-image.svg");
  background-position: top;
  background-color: #c6dee1 !important;
}

.second-background {
  background: linear-gradient(135deg, #bcd3d6 0%, #d0e9ec 100%);
  background-image: url("@/assets/images/home-page/header-image.svg");
  background-position: bottom;
}
.inner-height {
  height: 115px !important;
}
.box-shadow {
  box-shadow: -5px 5px 10px rgba(178, 200, 203, 0.2),
    5px -5px 10px rgba(178, 200, 203, 0.2),
    -5px -5px 10px rgba(218, 244, 248, 0.9),
    5px 5px 13px rgba(178, 200, 203, 0.9);
  border-radius: 20px;
}
.link-text {
  font-size: 24px;
  color: #111111;
  font-weight: 400;
  margin-right: 40px;
  padding: 5px;
  line-height: 25px;
  position: relative;
  letter-spacing: 2.95px;
}

.margin-right {
  margin-right: 8rem;
}
.min-width {
  min-width: 100vw;
}
</style>
