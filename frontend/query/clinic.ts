export const fetchAuthUserCompaniesQuery = gql`
  query (
    $groupName: String
    $userId: ID
    $statusId: ID
    $isOwner: Boolean
    $approvalBy: ID
    $langId: ID
  ) {
    userCompany(
      group_Name: $groupName
      user_Id: $userId
      status_Id: $statusId
      isOwner: $isOwner
      approvalBy_Id: $approvalBy
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
            companylangSet(lang_Id: $langId) {
              edges {
                node {
                  name
                }
              }
            }
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
        }
      }
    }
  }
`;

export const fetchActiveCompanyForUserQuery = gql`
  query ($groupName: String, $userId: ID, $statusId: ID, $isActive: Boolean) {
    userCompany(
      group_Name: $groupName
      user_Id: $userId
      status_Id: $statusId
      isActive: $isActive
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
        }
      }
    }
  }
`;

export const createUserCompanyMutation = gql`
  mutation (
    $name: String
    $street: String
    $street2: String
    $state: String
    $city: String
    $zipcode: String
    $country: String
    $createdBy: ID
    $updatedBy: ID
  ) {
    createCompany(
      input: {
        name: $name
        state: $state
        street: $street
        street2: $street2
        city: $city
        zipcode: $zipcode
        country: $country
        createdBy: $createdBy
        updatedBy: $updatedBy
      }
    ) {
      company {
        id
      }
    }
  }
`;
export const updateUserCompanyMutation = gql`
  mutation (
    $id: ID
    $name: String
    $street: String
    $street2: String
    $state: String
    $city: String
    $zipcode: String
    $country: String
    $updatedBy: ID
  ) {
    updateCompany(
      input: {
        id: $id
        name: $name
        zipcode: $zipcode
        country: $country
        city: $city
        state: $state
        street: $street
        street2: $street2
        updatedBy: $updatedBy
      }
    ) {
      updateCompany {
        id
      }
    }
  }
`;
export const fetchSingleCompanyQuery = gql`
  query ($companyId: Int, $groupName: String) {
    company(companyId: $companyId) {
      id
      name
      code
      street
      street2
      state
      city
      zipcode
      country
      companyuserSet(group_Name: $groupName) {
        edges {
          node {
            id
            requestedBy {
              id
              name
            }
            status {
              id
              name
            }
            user {
              id
              username
              isActive
              email
              name
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
  }
`;

export const createCompanyUserForCompanyOwnerMutation = gql`
  mutation (
    $companyId: ID
    $userId: ID
    $doctorId: ID
    $groupId: ID
    $approvalById: ID
    $status: String
    $isOwner: Boolean
    $isActive: Boolean
    $joinedDatetime: DateTime
    $approvalAt: DateTime
    $requestedBy: ID
  ) {
    createCompanyUser(
      input: {
        company: $companyId
        user: $userId
        doctor: $doctorId
        group: $groupId
        status: $status
        isOwner: $isOwner
        isActive: $isActive
        approvalBy: $approvalById
        joinedDatetime: $joinedDatetime
        approvalAt: $approvalAt
        requestedBy: $requestedBy
      }
    ) {
      companyUser {
        id
        isOwner
        joinedDatetime
        requestedAt
        approvalAt
        isActive
      }
    }
  }
`;

export const createDoctorTypeUserForCompanyMutation = gql`
  mutation (
    $companyId: ID
    $userId: ID
    $groupId: ID
    $status: String
    $isOwner: Boolean
    $isActive: Boolean
    $requestedBy: ID
    $joinedDatetime: DateTime
    $requestType: String
  ) {
    createCompanyUser(
      input: {
        company: $companyId
        user: $userId
        group: $groupId
        status: $status
        isOwner: $isOwner
        isActive: $isActive
        requestedBy: $requestedBy
        joinedDatetime: $joinedDatetime
        requestType: $requestType
      }
    ) {
      companyUser {
        id
        isOwner
        joinedDatetime
        requestedAt
        approvalAt
        isActive
      }
    }
  }
`;

export const fetchCompaniesQuery = gql`
  query ($name: String, $langId: ID) {
    companies(name: $name) {
      edges {
        node {
          id
          name
          street
          street2
          state
          city
          zipcode
          country
          isActive
          code
          companyuserSet(isOwner: true) {
            edges {
              node {
                id
                user {
                  id
                  name
                }
                isOwner
              }
            }
          }
          companylangSet(lang_Id: $langId) {
            edges {
              node {
                name
                street
                street2
                state
                city
                zipcode
                country
                code
              }
            }
          }
        }
      }
    }
  }
`;

export const setCurrentActiveClinicMutation = gql`
  mutation ($companyUserId: ID, $isActive: Boolean, $status: String) {
    updateCompanyUser(
      input: { id: $companyUserId, isActive: $isActive, status: $status }
    ) {
      companyuserUpdate {
        id
        isActive
      }
    }
  }
`;

export const deleteUserCompanyMutation = gql`
  mutation ($userCompanyId: ID) {
    deleteCompanyUser(input: $userCompanyId) {
      companyuser {
        id
      }
    }
  }
`;

export const deleteCompanyUserMutation = gql`
  mutation ($companyUserId: ID) {
    deleteCompanyUser(input: $companyUserId) {
      companyuser {
        id
      }
    }
  }
`;

export const fetchRequestedDoctorListByAuthUserQuery = gql`
  query ($userId: ID) {
    userCompany(user_Id: $userId) {
      edges {
        node {
          id
          user {
            id
            firstName
            lastName
            name
            email
            phone
            avatar
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
          doctor {
            id
          }
          status {
            id
            name
          }
          company {
            id
            name
          }
        }
      }
    }
  }
`;

export const fetchDoctorListsQuery = gql`
  query (
    $groupName: String
    $statusId: ID
    $companyName: String
    $userName: String
    $userEmail: String
    $langId: ID
  ) {
    userCompany(
      group_Name: $groupName
      status_Id: $statusId
      company_Name: $companyName
      user_Name: $userName
      user_Email: $userEmail
    ) {
      edges {
        node {
          id
          user {
            id
            firstName
            lastName
            name
            email
            phone
            avatar
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
          doctor {
            id
          }
          company {
            id
            name
            companylangSet(lang_Id: $langId) {
              edges {
                node {
                  name
                }
              }
            }
          }
          group {
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
  }
`;

export const createPatientTypeUserForCompanyMutation = gql`
  mutation (
    $companyId: ID
    $userId: ID
    $doctorId: ID
    $groupId: ID
    $status: String
    $isOwner: Boolean
    $isActive: Boolean
    $requestedBy: ID
    $requestType: String
  ) {
    createCompanyUser(
      input: {
        company: $companyId
        user: $userId
        doctor: $doctorId
        group: $groupId
        status: $status
        isOwner: $isOwner
        isActive: $isActive
        requestedBy: $requestedBy
        requestType: $requestType
      }
    ) {
      companyUser {
        id
        isOwner
        joinedDatetime
        requestedAt
        approvalAt
        isActive
      }
    }
  }
`;
