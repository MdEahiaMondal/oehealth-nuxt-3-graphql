export const fetchAuthUserProfileQuery = gql`
  query ($token: String!, $langId: ID) {
    viewer(token: $token) {
      username
      id
      firstName
      lastName
      email
      street
      street2
      city
      country
      avatar
      accessSurvey
      userlangSet(lang_Id: $langId) {
        edges {
          node {
            firstName
            lastName
            name
            gender
            phone
            street
            street2
            state
            city
            zip
          }
        }
      }
      lang {
        id
        name
        code
      }
      dateOfBirth
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
            specialization {
              id
              name
            }
          }
        }
      }
    }
    approvalStatuses {
      id
      name
    }
  }
`;

export const logInMutation = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      token
      user {
        id
        isFirstLogin
      }
    }
  }
`;

export const SignUpMutation = gql`
  mutation (
    $firstName: String!
    $lastName: String
    $username: String
    $email: String!
    $password: String!
    $birthdate: Date!
    $address: String!
    $addressTwo: String
    $country: String!
    $nationality: Int!
    $language: ID
    $isCaregiver: Boolean!
  ) {
    createUser(
      input: {
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        password: $password
        dateOfBirth: $birthdate
        street: $address
        street2: $addressTwo
        country: $country
        nationality: $nationality
        lang: $language
        isCaregiver: $isCaregiver
      }
    ) {
      user {
        id
        email
        username
        lang {
          id
          name
        }
      }
    }
  }
`;

export const logOutMutation = gql`
  mutation {
    deleteTokenCookie {
      deleted
    }
  }
`;

export const updateUserProfileMutation = gql`
  mutation (
    $id: ID
    $firstName: String
    $lastName: String
    $username: String
    $email: String
    $phone: String
    $gender: String
    $street: String
    $street2: String
    $city: String
    $zip: String
    $country: String
    $avatar: String
    $nationality: Int
    $dateOfBirth: Date
    $lang: ID
    $isCaregiver: Boolean
    $accessSurvey: Boolean
  ) {
    updateUser(
      input: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        username: $username
        email: $email
        phone: $phone
        gender: $gender
        street: $street
        street2: $street2
        city: $city
        zip: $zip
        country: $country
        avatar: $avatar
        nationality: $nationality
        dateOfBirth: $dateOfBirth
        lang: $lang
        isCaregiver: $isCaregiver
        accessSurvey: $accessSurvey
      }
    ) {
      user {
        id
      }
    }
  }
`;

export const updateUserGroupMutation = gql`
  mutation ($userId: ID, $group: String) {
    updateUserGroup(input: { id: $userId, group: $group }) {
      user {
        id
        username
        name
        firstName
        groups {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const deleteUserSpecializationMutation = gql`
  mutation ($userId: ID) {
    deleteUserSpecialization(user: $userId) {
      deleteSpecialization {
        id
      }
    }
  }
`;

export const createUserSpecializationMutation = gql`
  mutation ($userId: ID, $specialitiesId: ID) {
    createUserSpecialization(
      input: { user: $userId, specialization: $specialitiesId }
    ) {
      userspecialization {
        id
      }
    }
  }
`;
