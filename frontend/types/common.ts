export interface CreatedBy {
  id?: string
  name?: string
}

export interface CreatedFor {
  id?: string
  name?: string
}

export interface UpdatedBy {
  id?: string
  name?: string
}

export interface Country {
  code?: string
  name?: string
  __typename?: string
}

export interface NationalityListType {
  code?: string
  name?: string
  __typename?: string
}

export interface CityType {
  text?: string,
  value?: string
}

export interface Language {
  id?: string | number
  code?: string
  name?: string
  __typename?: string
}
export interface Specialties {
  id?: string | number
  name?: string
  specializationlangSet?: any
}
export interface Group {
  id?: string
  name?: string
}
export interface ApprovalStatus {
  id?: string 
  name?: string
  __typename?: string
}
export interface userLookupType {
  id?: string | number,
  name?: string
}
export interface fetchAuthUserCompaniesTypes {
  userId?: number,
  groupName?: string,
  statusId?: number,
  isOwner?: boolean,
  approvalById?: any,
  langId?: number,
}