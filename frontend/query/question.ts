export const fetchQuestionsQuery = gql`
query ($userId:ID, $langId:ID){
  questions{
    edges {
      node {
        id
        title
        referenceId
        isConditionalQuestion
        elementType {
          id
          name
        }
        questionlangSet(lang_Id: $langId){
          edges{
            node{
                title
            }
          }
        }
        serialNo
        questionresponseSet {
          edges {
            node {
              id
              title
              referenceId
              serialNo
              questionresponselangSet(lang_Id: $langId){
                edges{
                  node{
                    title
                  }
                }
              }
            }
          }
        }
        diseaseSet(user_Id:$userId){
          edges{
            node{
              id
              user{
                id
              }
              question{
                id
              }
              diseaseanswerSet{
                edges{
                  node{
                    id
                    value
                    questionResponse{
                      id
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`





export const createQuestionDiseasesQuery = gql`
mutation ($userId: ID, $questionId: ID, $createdById: ID, $updatedById: ID) {
  createDisease(
    input: {
      question: $questionId
      user: $userId
      createdBy: $createdById
      updatedBy: $updatedById
    }
  ) {
    disease {
      id
    }
  }
}
`
export const createQuestionDiseasesAnswerQuery = gql`
mutation (
   $diseasesId: ID
   $questionResponseId: ID
   $inputValue: String
   $createdById: ID
   $updatedById: ID
 ) {
   createDiseaseAnswer(
     input: {
       disease: $diseasesId
       questionResponse: $questionResponseId
       value: $inputValue
       createdBy: $createdById
       updatedBy: $updatedById
     }
   ) {
     diseaseAnswer {
       id
       disease {
         id
       }
     }
   }
 }`



export const updateQuestionDiseasesAnswerQuery = gql`
mutation (
 $diseaseAnswerId: ID
 $diseasesId: ID
 $inputValue: String
 $questionResponseId: ID
 $updatedById: ID
) {
 updateDiseaseAnswer(
   input: {
     id: $diseaseAnswerId
     value: $inputValue
     disease: $diseasesId
     questionResponse: $questionResponseId
     updatedBy: $updatedById
   }
 ) {
   diseaseAnswer {
     id
     value
   }
 }
}`

export const deleteQuestionDiseasesQuery = gql`
mutation ($diseasesId: ID) {
 deleteDisease(id: $diseasesId) {
   disease {
     id
   }
 }
}`
export const deleteUserAllQuestionDiseasesQuery = gql`
mutation ($userId: ID) {
  deleteUserDisease(id: $userId) {
    disease {
      id
    }
  }
}
`
export const deleteQuestionDiseasesAnswerQuery = gql`
mutation($diseaseAnswerId:ID){
  deleteDiseaseAnswer(id:$diseaseAnswerId)
  {
    diseaseAnswer {
      id
    }
  }
}
`