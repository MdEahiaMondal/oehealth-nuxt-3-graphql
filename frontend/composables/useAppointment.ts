import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useAppointmentStore } from "~~/stores/appointment";

export const useAppointment = () => {
    const toast = useToast();
    const appointmentStore = useAppointmentStore();
    const {
        fetchAppointments,
        fetchAppointmentCodes,
        fetchSingleAppointment,
        fetchAppointmentDuration,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        createAppointmentDetails,
        createAppointmentShortCode,
        updateAppointmentDetails,
        deleteAppointmentDetails,
        deleteAppointmentShortCode,
        fetchTooths,
        fetchDiagnostics,
        fetchTreatments,
        createTooth,
        createDiagnostic,
        createTreatment,
        createAppointmentDuration,
        fetchPatientDiseases,
        fetchPriorities,
        createAppointmentPriority,
        updateAppointmentPriority,
        deleteAppointmentPriority,
        createAppointmentSpecialization,
        updateAppointmentSpecialization,
        deleteAppointmentSpecialization,
        createAppointmentFile,
        createAppointmentSurvey,
        updateAppointmentSurvey,
        deleteAppointmentSurvey,
    } = appointmentStore;

    const {
        getAppointments,
        getAppointmentCodes,
        getTooths,
        getDiagnostics,
        getTreatments,
        getDurations,
        getTypeOfAppointments,
        getPatientDiseases,

    } = storeToRefs(appointmentStore);




    return {
        fetchAppointments,
        fetchAppointmentCodes,
        fetchSingleAppointment,
        fetchAppointmentDuration,
        createAppointment,
        updateAppointment,
        deleteAppointment,
        createAppointmentDetails,
        createAppointmentShortCode,
        updateAppointmentDetails,
        deleteAppointmentDetails,
        deleteAppointmentShortCode,
        fetchTooths,
        fetchDiagnostics,
        fetchTreatments,
        createTooth,
        createDiagnostic,
        createTreatment,
        createAppointmentDuration,
        fetchPatientDiseases,
        fetchPriorities,
        createAppointmentPriority,
        updateAppointmentPriority,
        deleteAppointmentPriority,
        createAppointmentSpecialization,
        updateAppointmentSpecialization,
        deleteAppointmentSpecialization,
        createAppointmentFile,
        createAppointmentSurvey,
        updateAppointmentSurvey,
        deleteAppointmentSurvey,

        getAppointments,
        getAppointmentCodes,
        getTooths,
        getDiagnostics,
        getTreatments,
        getDurations,
        getTypeOfAppointments,
        getPatientDiseases,
    }

}




