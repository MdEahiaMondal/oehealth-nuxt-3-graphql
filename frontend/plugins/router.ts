export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = (to: { hash: string; }) => {
    if (to.hash) {
      let el: any = document.getElementById(to.hash.split("#")[1]);
      if ("scrollBehavior" in document.documentElement.style) {
       setTimeout(() => {
        return window.scrollTo({
            top: el.getBoundingClientRect().top + window.scrollY,
            behavior: "smooth",
          });
       }, 300);
      } else {
        return window.scrollTo(
          0,
          el.getBoundingClientRect().top + window.scrollY
        );
      }
    } else {
      return { left: 0, top: 0 };
    }
  };
});
