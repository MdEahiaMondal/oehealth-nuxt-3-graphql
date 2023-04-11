export interface CreatedBy {
    name?: string
}

export interface CreatedFor {
    name?: string
}

export interface Notifications {
    id?: number | string
    company?: string
    createdAt?: number | string
    createdBy?: CreatedBy
    createdFor?: CreatedFor
    isRead?: boolean
    notificationType?: string
}