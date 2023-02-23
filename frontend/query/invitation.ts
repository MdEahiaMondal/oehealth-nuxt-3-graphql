
export const acceptPatientInvitationMutation = gql`
mutation(
    $id:ID,
    $doctorId:ID,
    $approvalById:ID,
    $status:String,
    $joinedDatetime:DateTime,
    $approvalAt:DateTime,
    $requestType: String
    ) {
    updateCompanyUser(input: {
      id:$id,
      doctor:$doctorId,
      status: $status,
      joinedDatetime:$joinedDatetime,
      approvalBy:$approvalById,
      approvalAt:$approvalAt
      requestType: $requestType
    }) {
      companyuserUpdate{
        id
        joinedDatetime
        approvalAt
         doctor{
          id
          email
        }
        status{
          id
          name
        }
      }
    }
  }`

export const rejectPatientInvitationMutation = gql`
  mutation (
    $id: ID
    $doctorId: ID
    $approvalById: ID
    $status: String
    $approvalAt: DateTime
    $requestType: String
  ) {
    updateCompanyUser(
      input: {
        id: $id
        doctor: $doctorId
        status: $status
        approvalBy: $approvalById
        approvalAt: $approvalAt
        requestType: $requestType
      }
    ) {
      companyuserUpdate {
        id
        joinedDatetime
        approvalAt
        doctor {
          id
          email
        }
        group {
          id
          name
        }
        company {
          id
          name
        }
        status {
          id
          name
        }
      }
    }
  }
`;

export const fetchDoctorInvitationsQuery = gql`
query (
  $companyId: ID
  $groupName: String
  $statusId: ID
) {
  userCompany(
    company_Id: $companyId
    group_Name: $groupName
    status_Id: $statusId
  ) {
    edges {
      node {
        id
        user {
          id
          name
          username
          isActive
          email
          phone
          dateOfBirth
          avatar
          groups{
            edges{
              node{
                id
                name
              }
            }
          }
          userspecializationSet{
            edges{
              node{
                id
                specialization{
                  id
                  name
                }
              }
            }
          }
        }
        company {
          id
          name
        }
        group {
          id
          name
        }
        doctor {
          id
          name
        }
        status {
          id
          name
        }
        approvalBy {
          id
          name
        }
        requestedAt
        joinedDatetime
        isOwner
        isActive
        requestedBy {
          id
          email
          name
        }
      }
    }
  }
}`


export const fetchClinicInvitationsQuery = gql`
query (
  $userId: ID
  $groupName: String
  $statusId: ID
  $isOwner: Boolean
) {
  userCompany(
    user_Id: $userId
    group_Name: $groupName
    status_Id: $statusId
    isOwner: $isOwner
  ) {
    edges {
      node {
        id
        user {
          id
          name
          email
          phone
          dateOfBirth
        }
        company {
          id
          name
        }
        group {
          id
          name
        }
        doctor {
          id
          name
        }
        status {
          id
          name
        }
        approvalBy {
          id
          name
        }
        requestedAt
        joinedDatetime
        isOwner
        isActive
        requestedBy{
          id
          email
          name
        }
      }
    }
  }
}
`

export const fetchPatientInvitationsQuery = gql`
query (
  $companyId: ID
  $groupName: String
  $doctorId: ID
  $statusId: ID
  $userId: ID
) {
  userCompany(
    company_Id: $companyId
    group_Name: $groupName
    doctor_Id: $doctorId
    status_Id: $statusId
    user_Id: $userId
  ) {
    edges {
      node {
        id
        user {
          id
          name
          username
          isActive
          email
          phone
          dateOfBirth
          avatar
          groups{
            edges{
              node{
                id
                name
              }
            }
          }
          userspecializationSet{
            edges{
              node{
                id
                specialization{
                  id
                  name
                }
              }
            }
          }
        }
        company {
          id
          name
        }
        group {
          id
          name
        }
        doctor {
          id
          name
        }
        status {
          id
          name
        }
        approvalBy {
          id
          name
        }
        requestedAt
        joinedDatetime
        isOwner
        isActive
        requestedBy {
          id
          email
          name
        }
      }
    }
  }
}`