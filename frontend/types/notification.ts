import { CreatedBy, CreatedFor } from "./common"
import { Company } from "./company"

export interface Notification {
  id: string
  notificationType: string
  createdAt: string
  company: Company
  createdBy: CreatedBy
  createdFor: CreatedFor
}

export type NotificationResult = {
  notifications: Notification[]
}
