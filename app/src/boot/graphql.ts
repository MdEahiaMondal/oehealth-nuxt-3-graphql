import { boot } from 'quasar/wrappers'
import { GraphQLClient } from 'graphql-request'
// const endpoint = 'http://10.0.0.100:8000/graphql'
// const endpoint = 'http://192.168.0.100:8000/graphql'
// const endpoint = 'https://oehealth-api.devxhub.com/graphql'
// const endpoint = 'https://oehealth-api.promptequation.com/graphql'
const endpoint = 'https://api.teethwallet.com/graphql'
const graphQLClient = new GraphQLClient(endpoint)

export default boot(({ app }) => {
  app.config.globalProperties.$graphql = graphQLClient
})

export { graphQLClient }
