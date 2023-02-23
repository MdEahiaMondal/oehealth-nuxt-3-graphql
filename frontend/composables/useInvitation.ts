import { storeToRefs } from "pinia";
import { useToast } from "vue-toastification";
import { useInvitationStore } from "~~/stores/invitation";
import { usePatient } from '~/composables/usePatient'

export const useInvitation = () => {
    const toast = useToast();
    const { UPDATED_STATUS, UPDATED_PATIENT_REQUEST_STATUS } = usePatient();
    const invitationStore = useInvitationStore();
    const {
        acceptPatientInvitation: patientInvitationAccept,
        rejectPatientInvitation: patientInvitationReject,
        REMOVE_PATIENT,
        REMOVE_CLINIC_INVITATION,
        REMOVE_DOCTOR_INVITATION,
        SET_DOCTOR_INVITATIONS_EMPTY,
        fetchDoctorInvitations,
        fetchClinicInvitations,
        fetchPatientInvitations,
    } = invitationStore;

    const {
        getAllPatientsInvitations,
        getAllDoctorInvitations,
        getClinicInvitations,
    } = storeToRefs(invitationStore);



    const acceptPatientInvitation = async ({ id, doctorId, approvalById, status, joinedDatetime, approvalAt, from, requestType }: any) => {
        try {
            await patientInvitationAccept({ id, doctorId, approvalById, status, joinedDatetime, approvalAt, requestType })

            if (from === 'myInvitation') {
                REMOVE_PATIENT({ id })
            } else if (from === 'myPatient') {
                UPDATED_STATUS({ status, id })
            } else if (from === 'accessManagement') {
                UPDATED_PATIENT_REQUEST_STATUS({ status, id })
            } else if (from === 'doctorInvitations') {
                REMOVE_DOCTOR_INVITATION({ id })
            } else if (from === 'clinicInvitations') {
                REMOVE_CLINIC_INVITATION({ id })
            }

            toast.success('Invitations Successfully Accepted!')
        } catch (error: any) {
            toast.error(error.response?.errors[0]?.message || 'Something wrong!')
        }
    }


    const rejectPatientInvitation = async ({ id, doctorId, approvalById, status, approvalAt, from, requestType }: any) => {
        try {
            await patientInvitationReject({ id, doctorId, approvalById, status, approvalAt, requestType })

            if (from === 'myInvitation') {
                REMOVE_PATIENT({ id })
            } else if (from === 'myPatient') {
                UPDATED_STATUS({ status, id })
            } else if (from === 'accessManagement') {
                UPDATED_PATIENT_REQUEST_STATUS({ status, id })
            } else if (from === 'doctorInvitations') {
                REMOVE_DOCTOR_INVITATION({ id })
            } else if (from === 'clinicInvitations') {
                REMOVE_CLINIC_INVITATION({ id })
            }

            toast.success('Invitations Successfully Rejected!')

        } catch (error: any) {
            toast.error(error.response?.errors[0]?.message || 'Something wrong!')
        }
    }


    return {
        acceptPatientInvitation,
        rejectPatientInvitation,
        fetchDoctorInvitations,
        fetchClinicInvitations,
        fetchPatientInvitations,
        getAllPatientsInvitations,
        getAllDoctorInvitations,
        getClinicInvitations,
        SET_DOCTOR_INVITATIONS_EMPTY,
    }

}




