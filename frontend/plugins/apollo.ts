import { useAuthStore } from "~~/stores/auth"

export default defineNuxtPlugin((nuxtApp) => {
  const { getToken } = useApollo()
  const authStore = useAuthStore()

  setTimeout(async () => {
    const token = await getToken()
    authStore.setToken(token)
    if (token) {
      await authStore.fetchAuthUserProfile({ token: token, langId: null })
    }
  })

  nuxtApp.hook('apollo:error', (error) => {
    console.error(error)
    // Handle different error cases
  })
})
