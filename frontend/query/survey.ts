export const fetchSurveyQuery = gql`
query{
    surveys{
      id
      name
      file
      createdAt
    }
  }`

export const fetchAppointmentSurveysQuery = gql`
  query($appointmentId:Int){
      appointmentSurveys(appointmentId:$appointmentId){
        id
        isFinished
        appointment{
          id
        }
        survey{
          id
        }
      }
    }`


export const fetchSurveyWithQuestionsQuery = gql`
    query ($surveyId: Int, $appointmentSurveyId:ID) {
        surveys(pk: $surveyId) {
          id
          surveysquestionSet {
            edges {
              node {
                id
                questionType
                serialNo
                isConditionalQuestion
                createdAt
                title
                defaultDisplay
                xmlQuestionId
                parentQuestion {
                  id
                }
                surveyquestionresponseSet {
                  edges {
                    node {
                      id
                      xmlQuestionId
                      questionResponse
                      surveyquestionrelationSet {
                        edges {
                          node {
                            xmlQuestionResponseTargetQuestionId
                          }
                        }
                      }
                    }
                  }
                }
                appointmentsurveyquestionresponseSet (appointmentSurvey_Id:$appointmentSurveyId){
                  edges{
                    node{
                      responseValue
                                      id
                      questionResponse{
                        id
                        questionResponse
                      }
                      appointmentSurvey{
                        appointment{
                          doctor{
                            id
                            name
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

export const createAppointmentSurveyAnswerQuery = gql`
    mutation (
        $appointmentDecisionTreeId: ID
        $surveyId: ID
        $surveyAnswerId: ID
        $createdById: ID
    ) {
        createAppointmentSurveyAnswer(
        input: {
            appointmentDecisionTree: $appointmentDecisionTreeId
            survey: $surveyId
            surveyAnswer: $surveyAnswerId
            createdBy: $createdById
        }
        ) {
        appointmentSurveyAnswer {
            id
        }
        }
    }`

export const updateAppointmentSurveyAnswerQuery = gql`
mutation (
    $appointmentSurveyAnswerId: ID
    $appointmentDecisionTreeId: ID
    $surveyId: ID
    $surveyAnswerId: ID
    $createdById: ID
) {
    updateAppointmentSurveyAnswer(
    input: {
        id: $appointmentSurveyAnswerId
        appointmentDecisionTree: $appointmentDecisionTreeId
        survey: $surveyId
        surveyAnswer: $surveyAnswerId
        createdBy: $createdById
    }
    ) {
    appointmentSurveyAnswer {
        survey {
        id
        }
        surveyAnswer {
        id
        }
        appointmentDecisionTree {
        id
        }
    }
    }
}`

export const createAppointmentSurveyQuestionResponseQuery = gql`
mutation (
        $appointmentSurveyId: ID
        $surveyQuestionId: ID
        $questionResponseId: ID
        $responseValue: String
        $createdById: ID
        $updatedByID: ID
    ) 
    {
    createAppointmentSurveyQuestionResponse(
        input: {
        appointmentSurvey: $appointmentSurveyId
        surveyQuestion: $surveyQuestionId
        questionResponse: $questionResponseId
        responseValue: $responseValue
        createdBy: $createdById
        updatedBy: $updatedByID
        }
    ) {
        appointmentSurveyQuestionResponse {
            id
        }
    }
}`

export const updateAppointmentSurveyQuestionResponseQuery = gql`
mutation (
    $appointmentSurveyQuestionResponseId: ID
    $appointmentSurveyId: ID
    $surveyQuestionId: ID
    $questionResponseId: ID
    $responseValue: String
    $createdById: ID
    $updatedByID: ID
    ) {
    updateAppointmentSurveyQuestionResponse(
        input: {
        id: $appointmentSurveyQuestionResponseId
        appointmentSurvey: $appointmentSurveyId
        surveyQuestion: $surveyQuestionId
        questionResponse: $questionResponseId
        responseValue: $responseValue
        createdBy: $createdById
        updatedBy: $updatedByID
        }
    ) {
        appointmentSurveyQuestionResponse {
        id
        }
    }
}`
export const deleteAppointmentSurveyQuestionResponseQuery = gql`
mutation ($appointmentSurveyQuestionResponseId: ID) {
    deleteAppointmentSurveyQuestionResponse(id:$appointmentSurveyQuestionResponseId) {
        appointmentSurveyQuestionResponse {
        id
        }
    }
}`

export const surveyQuestionFinishedQuery = gql`
mutation (
  $appointmentSurveyId: ID
  $surveyId: ID
  $appointmentId: ID
  $isFinished: Boolean
  $createdById: ID
  $updatedById: ID
) {
  updateAppointmentSurvey(
    input: {
      id: $appointmentSurveyId
      appointment: $appointmentId
      survey: $surveyId
      isFinished:$isFinished
      createdBy: $createdById
      updatedBy: $updatedById
    }
  ) {
    appointmentSurvey {
      id
    }
  }
}`