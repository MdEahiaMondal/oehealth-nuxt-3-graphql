export interface TableHeader {
    text?: string;
    value?: string;
    sortable?: boolean;
    align?: string;
    width?: number;
}
export interface FileHeaderType {
    text?: string;
    value?: string;
    sortable?: boolean;
    align?: string;
    width?: number;
}

export interface OldPriorityType {
    appointmentPriorityId: string | number;
    id: string | number;
    name: string | number;
}

export interface OldSpecializationType {
    appointmentSpecializationId: string | number;
    id: string | number;
    name: string | number;
}

export interface AppointmentCodeType {
    id: string;
    name: string;
    codeType: string;
}
export interface Tooth {
    id?: number | string,
    number?: number
}

export interface Diagnosis {
    id?: number | string,
    name?: string
}

export interface Treatment {
    id?: number | string,
    name?: string
}

export interface Appointment {
    id?: number
    tooth?: Tooth
    diagnosis?: string | Diagnosis
    treatment?: string | Treatment
    duration?: string | number,
    startDate?: string,
    patient?: string,
    doctor?: string,
}

export interface AppointmentDetail {
    id?: number
    appointment?: Appointment
    tooth?: Tooth
    diagnosis?: Diagnosis
    treatment?: Treatment
}
export interface DoctorDetail {
    id?: number | string,
    name: string
}
export interface PatientType {
    id?: number | string,
    userId?: number | string,
    name?: string,
    username?: string,
    email?: string,
    dateOfBirth?: string,
    isActive?: boolean
}