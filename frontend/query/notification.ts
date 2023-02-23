export const fetchNotificationsQuery = gql`
  query ($userId: Int) {
    notifications(userId: $userId) {
      id
      isRead
      createdBy {
        name
      }
      createdFor {
        name
      }
      company {
        name
      }
      notificationType
      createdAt
    }
  }
`;

export const updateNotificationsMutation = gql`
  mutation ($id: ID, $isRead: Boolean) {
    updateNotification(input: { id: $id, isRead: $isRead }) {
      notification {
        isRead
      }
    }
  }
`;

export const deleteNotificationsMutation = gql`
  mutation ($id: ID) {
    deleteNotification(input: $id) {
      notification {
        id
      }
    }
  }
`;
