

export const fetchAppointmentsQuery = gql`
  query (
    $patientId: ID
    $doctorId: ID
    $companyId: ID
    $langId: ID
    $isActive: Boolean
  ) {
    appointments(
      patient: $patientId
      doctor_Id: $doctorId
      company_Id: $companyId
      isActive: $isActive
    ) {
      edges {
        node {
          id
          patient {
            id
            name
          }
          doctor {
            id
            name
          }
          company {
            id
            name
          }
          startDate
          duration
          createdAt
          appointmentDetails {
            edges {
              node {
                id
                tooth {
                  id
                  number
                }
                diagnosis {
                  id
                  name
                }
                treatment {
                  id
                  name
                }
              }
            }
          }
          appointmentprioritySet {
            edges {
              node {
                id
                priority {
                  id
                  name
                }
              }
            }
          }
          appointmentlangSet(lang_Id: $langId) {
            edges {
              node {
                note
              }
            }
          }
          appointmentSurvey {
            edges {
              node {
                id
                survey {
                  id
                  name
                  file
                  createdAt
                }
                createdAt
              }
            }
          }
        }
      }
    }
  }
`;


export const fetchAppointmentCodesQuery = gql`
query {
  appointmentCode {
    id
    name
    codeType
  }
}
`

export const fetchSingleAppointmentQuery = gql`
query ($id: ID, $langId:ID) {
 appointments(id: $id) {
   edges {
     node {
       id
       patient {
         id
         name
       }
       doctor {
         id
         name
       }
       company{
         id
         name
       }
       note
       startDate
       duration
       appointmentDetails {
         edges {
           node {
             id
             tooth {
               id
               number
             }
             diagnosis {
               id
               name
             }
             treatment {
               id
               name
             }
           }
         }
       }
       appointmentprioritySet {
         edges {
           node {
             id
             priority {
               id
               name
             }
           }
         }
       }
       appointmentspecializationSet {
         edges {
           node {
             id
             specialization {
               id
               name
             }
           }
         }
       }
       appointmentlangSet(lang_Id: $langId){
         edges{
           node{
             note
           }
         }
       }
       appointmentfileSet{
         edges{
           node{
             id
             name
             file
             createdAt
             updatedAt
           }
         }
       }
       appointmentSurvey {
         edges {
           node {
             id
             survey {
               id
               name
               file
               createdAt
             }
             createdAt
           }
         }
       }
       appointmentshortcodeSet {
           edges {
               node {
                   id
                   appointmentCode {
                       id
                   }
               }
           }
       }
     }
   }
 }
}`;

export const fetchAppointmentDurationQuery = gql`
query{
    durations{
        id
        number
    }
}
`
export const createAppointmentQuery = gql`
mutation (
   $companyId: ID
   $patientId: ID
   $doctorId: ID
   $startDate: DateTime
   $duration: Int
   $note: String
   $createdBy: ID
   $updatedBy: ID
 ) {
   createAppointment(
     input: {
       company: $companyId
       patient: $patientId
       doctor: $doctorId
       startDate: $startDate
       duration: $duration
       note: $note
       createdBy: $createdBy
       updatedBy: $updatedBy
     }
   ) {
     appointment {
       id
     }
   }
 }`

export const updateAppointmentQuery = gql`
 mutation (
   $id: ID
   $companyId: ID
   $patientId: ID
   $doctorId: ID
   $startDate: DateTime
   $duration: Int
   $note: String
   $updatedBy: ID
 ) {
   updateAppointment(
     input: {
       id: $id
       company: $companyId
       patient: $patientId
       doctor: $doctorId
       startDate: $startDate
       duration: $duration
       note: $note
       updatedBy: $updatedBy
     }
   ) {
     appointment {
       id
     }
   }
 }`

export const deleteAppointmentQuery = gql`
 mutation ($id: ID) {
    deleteAppointment(id: $id) {
        appointment {
            id
        }
    }
}
`
export const createAppointmentDetailsQuery = gql`
mutation($appointmentId:ID,$toothId:ID,$diagnosticId:ID,$treatmentId:ID, $createdBy:ID, $updatedBy:ID){
     createAppointmentDetails(input:{
         appointment: $appointmentId,
         tooth: $toothId,
         diagnosis:$diagnosticId,
         treatment:$treatmentId,
         createdBy: $createdBy,
         updatedBy:$updatedBy
     }){
         appointmentDetails{
             id
             tooth{
                 id
                 number
             }
             diagnosis{
                 id
                 name
             }
             treatment{
                 id
                 name
             }
         }
     }
 }
 `
export const createAppointmentShortCodeQuery = gql`
mutation($appointmentId:ID, $codeId:ID, $createdBy:ID, $updatedBy:ID){
  createAppointmentShortCode(input:{
         appointment: $appointmentId,
         appointmentCode: $codeId,
         createdBy: $createdBy,
         updatedBy:$updatedBy
     }){
       appointmentShortCode {
         appointment {
           id
         }
         appointmentCode {
           id
           name
         }
       }
     }
 }
 `
export const updateAppointmentDetailsQuery = gql`
mutation ($id:ID, $appointmentId: ID, $toothId: ID, $diagnosticId: ID, $treatmentId: ID, $updatedBy: ID) {
 updateAppointmentDetails(input: {id:$id, appointment: $appointmentId, tooth: $toothId, diagnosis: $diagnosticId, treatment: $treatmentId, updatedBy: $updatedBy}) {
     appointmentDetails {
         id
         tooth{
             id
             number
         }
         diagnosis{
             id
             name
         }
         treatment{
             id
             name
         }
     }
 }
 }
 `
export const deleteAppointmentDetailsQuery = gql`
 mutation ($id:ID){
     deleteAppointmentDetails(id: $id){
         appointment{
             id
         }
     }
 }
`
export const deleteAppointmentShortCodeQuery = gql`
mutation ($id:ID){
    deleteAppointmentShortCode(id: $id){
        appointmentShortCode {
            id
        }
    }
}
`
export const fetchToothsQuery = gql`
query {
  teeth {
      id
      number
  }
}
`;

export const fetchDiagnosticsQuery = gql`
query($langId: ID) {
  diagnostics {
      id
      name
      diagnosticlangSet(lang_Id: $langId){
        edges{
          node{
            id
            name
          }
        }
      }
  }
}
`;

export const fetchTreatmentsQuery = gql`
query($langId: ID){
  treatments {
      id
      name
      treatmentlangSet(lang_Id: $langId){
        edges{
          node{
            id
            name
          }
        }
      }
  }
}
`;
export const createToothQuery = gql`
mutation($number:Int, $createdBy:Int){
    createTooth(input:{number:$number, createdBy: $createdBy}){
        tooth {
            id
            number
        }
    }
}
`
export const createDiagnosticQuery = gql`
mutation($name: String, $createdBy: Int) {
  createDiagnostic(input: { name: $name, createdBy: $createdBy }) {
    diagnostic {
      id
      name
    }
  }
}
`;
export const createTreatmentQuery = gql`
mutation($name: String, $createdBy: Int) {
  createTreatment(input: { name: $name, createdBy: $createdBy }) {
    treatment {
      id
      name
    }
  }
}
`;
export const createAppointmentDurationQuery = gql`
mutation($number:Int, $createdBy:ID){
  createDuration(input:{number: $number, createdBy: $createdBy}){
      durations{
          id
          number
      }
  }
}
`;
export const fetchPatientDiseasesQuery = gql`
mutation($number:Int, $createdBy:ID){
  durationsCreate(input:{number: $number, createdBy: $createdBy}){
      durations{
          id
          number
      }
  }
}
`;


export const fetchPrioritiesQuery = gql`
query($langId: ID){
  priorities {
    id
    name
    prioritylangSet(lang_Id: $langId) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
}`

export const createAppointmentPriorityQuery = gql`
mutation ($appointmentId: ID, $priorityId: ID, $createdById: ID, $updatedById: ID) {
 createAppointmentPriority(
   input: {
     appointment: $appointmentId
     priority: $priorityId
     createdBy: $createdById
     updatedBy: $updatedById
   }
 ) {
   appointmentPriority {
     id
   }
 }
}`
export const updateAppointmentPriorityQuery = gql`
mutation (
 $id: ID
 $appointmentId: ID
 $priorityId: ID
 $createdById: ID
 $updatedById: ID
) {
 updateAppointmentPriority(
   input: {
     id: $id
     appointment: $appointmentId
     priority: $priorityId
     createdBy: $createdById
     updatedBy: $updatedById
   }
 ) {
   appointmentPriority {
     id
   }
 }
}`

export const deleteAppointmentPriorityQuery = gql`
mutation ($id: ID) {
 deleteAppointmentPriority(id: $id) {
   appointmentPriority {
     id
   }
 }
}`

export const createAppointmentSpecializationQuery = gql`
mutation (
 $appointmentId: ID
 $specializationId: ID
 $createdById: ID
 $updatedById: ID
) {
 createAppointmentSpecialization(
   input: {
     appointment: $appointmentId
     specialization: $specializationId
     createdBy: $createdById
     updatedBy: $updatedById
   }
 ) {
   appointmentSpecialization {
     id
   }
 }
}`
export const updateAppointmentSpecializationQuery = gql`
mutation (
 $id: ID
 $appointmentId: ID
 $specializationId: ID
 $createdById: ID
 $updatedById: ID
) {
 updateAppointmentSpecialization(
   input: {
     id: $id
     appointment: $appointmentId
     specialization: $specializationId
     createdBy: $createdById
     updatedBy: $updatedById
   }
 ) {
   appointmentSpecialization {
     id
   }
 }
}`
export const deleteAppointmentSpecializationQuery = gql`
mutation ($id: ID) {
  deleteAppointmentSpecialization(id: $id) {
    appointmentSpecialization {
      id
    }
  }
}`

export const createAppointmentFileQuery = gql`
mutation (
    $name: String
    $file: Upload
    $appointmentId: ID
    $doctorId: ID
    $createdById: ID
    $updatedById: ID
  ) {
    createAppointmentFile(
      input: {
        name: $name
        file: $file
        appointment: $appointmentId
        doctor: $doctorId
        createdBy: $createdById
        updatedBy: $updatedById
      }
    ) {
      appointmentFile {
        id
        name
        file
      }
    }
  }`

export const createAppointmentSurveyQuery = gql`
mutation (
  $surveyId: ID
  $appointmentId: ID
  $createdById: ID
  $updatedById: ID
) {
  createAppointmentSurvey(
    input: {
      appointment: $appointmentId
      survey: $surveyId
      createdBy: $createdById
      updatedBy: $updatedById
    }
  ) {
    appointmentSurvey {
      id
    }
  }
}`
export const updateAppointmentSurveyQuery = gql`
mutation (
  $appointmentSurveyId: ID
  $surveyId: ID
  $appointmentId: ID
  $createdById: ID
  $updatedById: ID
) {
  updateAppointmentSurvey(
    input: {
      id: $appointmentSurveyId
      appointment: $appointmentId
      survey: $surveyId
      createdBy: $createdById
      updatedBy: $updatedById
    }
  ) {
    appointmentSurvey {
      id
    }
  }
}`
export const deleteAppointmentSurveyQuery = gql`
mutation($appointmentSurveyId:ID){
 deleteAppointmentSurvey(id:$appointmentSurveyId){
   appointmentSurvey{
     id
   }
 }
}`
// export const example = 

