export const fetchCountriesQuery = gql`
  query {
    countryList {
      code
      name
    }
  }
`;

export const fetchLanguagesQuery = gql`
  query {
    multiLanguage {
      id
      name
      code
    }
  }
`;

export const fetchSpecialtiesQuery = gql`
  query ($langId: ID) {
    specializations {
      id
      name
      specializationlangSet(lang_Id: $langId) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const fetchGroupsQuery = gql`
  query {
    groups {
      id
      name
    }
  }
`;

export const fetchNationalitiesQuery = gql`
  query {
    nationalityList {
      code
      name
    }
  }
`;
