export interface User {
  id?: number | string
  userId?: number | string
  name?: string
  username?: string
  email?: string
  avatar?: string
  dateOfBirth?: string
  accessSurvey?: boolean
  isDentist?: boolean
  city?: string
  country?: string
  firstName?: string
  lastName?: string
  phone?: string
  state?: string
  street?: string
  street2?: string
  zip?: string
  groups?: any
  lang?: any
  patientsManaged?: any
  speciality?: Array<string>
  userlangSet?: any
  userspecializationSet?: any
} // database Properties name

export interface Patient extends User {
  address?: string
}

export type AuthResult = {
  tokenAuth: {
    token?: string
    user?: User
  }
}
