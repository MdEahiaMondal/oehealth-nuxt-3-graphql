<template>
  <v-app>
    <v-main class="landing-fade-background">
      <HomeAppHeader />
      <slot />
      <HomeAppFooter />
    </v-main>
  </v-app>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900;1000&display=swap");

* {
  font-family: "Nunito", sans-serif !important;
}

html {
  scroll-behavior: smooth;
}

.landing-fade-background {
  background-color: #c6dee1 !important;
  background-position: top;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
}

body::-webkit-scrollbar {
  width: 12px;              
}

body::-webkit-scrollbar-track {
  background: #a8a8a8;       
}

body::-webkit-scrollbar-thumb {
  background: #a8a8a8;    
  border-radius: 20px;      
  border: 3px solid #a8a8a8 ;  
}
</style>
