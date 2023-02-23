export const fetchUserRequestQuery = gql`
query ($groupName: String, $userId: ID) {
    userCompany(group_Name: $groupName, user_Id: $userId) {
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
            doctor {
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
            approvalBy {
            id
            name
            }
            joinedDatetime
        }
        }
    }
}`

export const fetchPatientsQuery = gql`
query{
  users(input:"Patient") {
    edges {
      node {
        id
        username
        isActive
        email
        name
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
}`
