export const fetchPatientByDoctorQuery = gql`
  query (
    $companyId: ID
    $groupName: String
    $doctorId: ID
    $statusName: String
    $statusId: ID
  ) {
    userCompany(
      company_Id: $companyId
      group_Name: $groupName
      doctor_Id: $doctorId
      status_Name: $statusName
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
            groups {
              edges {
                node {
                  id
                  name
                }
              }
            }
            userspecializationSet {
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
  }
`;

export const fetchDoctorsByPatientQuery = gql`
  query ($groupName: String, $statusId: ID, $userId: ID) {
    userCompany(
      group_Name: $groupName
      status_Id: $statusId
      user_Id: $userId
    ) {
      edges {
        node {
          user {
            id
            name
          }
          doctor {
            id
            name
            username
            isActive
            email
            phone
            dateOfBirth
            avatar
            groups {
              edges {
                node {
                  id
                  name
                }
              }
            }
            userspecializationSet {
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
          }
        }
      }
    }
  }
`;

export const createConnectionMutation = gql`
  mutation ($sender: ID, $receiver: ID) {
    createConnection(input: { sender: $sender, receiver: $receiver }) {
      connection {
        id
      }
    }
  }
`;

export const checkConnectionQuery = gql`
  query ($sender: ID, $receiver: ID) {
    checkConnection(sender: $sender, receiver: $receiver) {
      id
    }
  }
`;

export const fetchConnectedUserQuery = gql`
  query ($userId: ID) {
    connections(id: $userId) {
      id
      sender {
        id
        firstName
        lastName
        name
        email
        username
        avatar
      }
      receiver {
        id
        firstName
        lastName
        name
        email
        username
        avatar
      }
      coversationConnectionId(last: 1) {
        edges {
          node {
            message
          }
        }
      }
    }
  }
`;

export const fetchConversationsQuery = gql`
  query ($connectionId: ID) {
    conversations(connection_Id: $connectionId) {
      edges {
        node {
          id
          connection {
            id
          }
          message
          datetime
          sender {
            id
            name
            username
            avatar
          }
          isSeen
          isEdited
          isAutoMessage
        }
      }
    }
  }
`;
