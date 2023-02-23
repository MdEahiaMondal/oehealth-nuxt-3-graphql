export const fetchDoctorsQuery = gql`
  query ($email: String) {
    users(input: "Doctor", email: $email) {
      edges {
        node {
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
`;
