import { storeToRefs } from "pinia";
import { usePatientStore } from "~~/stores/patient";

export const usePatient = () => {
    const patientStore = usePatientStore();
    const {
        fetchUserRequest,
        UPDATED_STATUS,
        UPDATED_PATIENT_REQUEST_STATUS,
        SET_PATIENTS,
        fetchPatients,
    } = patientStore;

    const {
        getMyPatients,
        getUserRequest,
        getMyApprovedPatients,
        getMyApprovedPatientsForMessage,
        getPatientDoctors,
        getAppointmentPatients,
    } = storeToRefs(patientStore);


    return {
        fetchUserRequest,
        getMyPatients,
        getUserRequest,
        getMyApprovedPatients,
        getMyApprovedPatientsForMessage,
        getPatientDoctors,
        getAppointmentPatients,
        UPDATED_STATUS,
        UPDATED_PATIENT_REQUEST_STATUS,
        SET_PATIENTS,
        fetchPatients,
    }

}




