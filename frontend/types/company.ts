export interface Company {
  id?: string | number
  name?: string
}

export interface DoctorType {
  id?: string | number,
  doctorId?: string | number,
  username?: string,
  isActive?: boolean,
  email?: string,
  name?: string,
  dateOfBirth?: string,
  avatar?: string,
  groups?: any,
  companyUserid?: string | number
  joinedDatetime?: string | number
}

export interface GroupType {
  id?: string | number,
  name?: string
}

export interface PatientInvitationsType {
  id?: string | number,
  user?: any,
  company?: any,
  isOwner?: boolean,
  isActive?: boolean,
  status?: any,
  requestedAt?: string
}
