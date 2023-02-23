import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { useAuth } from '~~/composables/useAuth'
import { usePatient } from '~/composables/usePatient'
import {
    acceptPatientInvitationMutation,
    rejectPatientInvitationMutation,
    fetchDoctorInvitationsQuery,
    fetchClinicInvitationsQuery,
    fetchPatientInvitationsQuery
} from '~/query/invitation'

export const useInvitationStore = defineStore('invitation', () => {
    const { getUserProfile } = useAuth()
    const { SET_PATIENTS } = usePatient()

    const patientsInvitations = ref([])
    const doctorInvitations = ref([])
    const clinicInvitations = ref([])

    const authUser = computed(() => getUserProfile.value)

    const getAllPatientsInvitations = computed(() => {
        return patientsInvitations.value?.map((item: any) => {
            return {
                id: item.node?.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
                name: item.node.user?.name,
                email: item.node.user?.email,
                phone: item.node.user?.phone,
                requestedAt: item.node.requestedAt,
            }
        })
    })


    const getAllDoctorInvitations = computed(() => {
        let invitations: any = doctorInvitations.value?.filter((item: any) => {
            if (item.node.status.name == 'Pending' && item.node.requestedBy?.id !== authUser.value.id) {
                return item
            }
        })

        invitations = invitations.map((item: any) => {
            return {
                id: item.node.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
                name: item.node.user?.name,
                email: item.node.user?.email,
                phone: item.node.user?.phone,
                requestedAt: item.node.requestedAt,
            }
        })
        return [...new Map(invitations.map((item: any) =>
            [item['id'], item])).values()];

    })


    const getClinicInvitations = computed(() => {
        let newInvitations = clinicInvitations.value?.map((item: any) => {
            return {
                id: item.node?.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
            }
        })

        newInvitations = newInvitations.filter((item: any) => {
            if (item.requestedById !== authUser.value.id) {
                return item
            }
        })

        return [...new Map(newInvitations.map((item: any) => [item['id'], item])).values()]
    })


    const REMOVE_PATIENT = ({ id }: any) => {
        patientsInvitations.value = patientsInvitations.value.filter((item: any) => {
            return Number(item.node.id) !== id
        })
    }


    const REMOVE_CLINIC_INVITATION = ({ id }: any) => {
        clinicInvitations.value = clinicInvitations.value.filter((item: any) => {
            return Number(item.node.id) !== id
        })
    }

    const REMOVE_DOCTOR_INVITATION = ({ id }: any) => {
        doctorInvitations.value = doctorInvitations.value.filter((item: any) => {
            return Number(item.node.id) !== id
        })
    }


    const SET_DOCTOR_INVITATIONS_EMPTY = () => {
        doctorInvitations.value = []
    }

    const SET_PATIENT_INVITATIONS = (payload: any) => {
        patientsInvitations.value = payload
    }

    const SET_DOCTOR_INVITATIONS = (payload: any) => {
        if (payload && payload.length > 0) {
            doctorInvitations.value = doctorInvitations.value.concat(payload)
        }
    }

    const {
        mutate: fetchUserLookup,
    } = useMutation(
        gql`
        query{
            approvalStatuses{
                id
                name
            }
        }`
    )


    const { mutate: acceptPatientInvitation } = useMutation(acceptPatientInvitationMutation)
    const { mutate: rejectPatientInvitation } = useMutation(rejectPatientInvitationMutation)

    const fetchDoctorInvitations = async ({ companyId, groupName, statusId }: any) => {
        const variables = { companyId, groupName, statusId }
        const { onResult: fetchDoctorInvitationsDone } = useQuery(fetchDoctorInvitationsQuery, variables)

        fetchDoctorInvitationsDone(({ data }: any) => {
            const { userCompany } = data
            const deepClone = cloneDeep(userCompany)
            if (deepClone.edges && deepClone.edges.length > 0) {
                doctorInvitations.value = doctorInvitations.value.concat(deepClone.edges)
            }
        })
    }

    const fetchClinicInvitations = async ({ userId, groupName, statusId, isOwner }: any) => {
        const variables = { userId, groupName, statusId, isOwner }
        const { onResult: fetchClinicInvitationsDone } = useQuery(fetchClinicInvitationsQuery, variables)
        fetchClinicInvitationsDone(({ data }: any) => {
            const { userCompany } = data
            const deepClone = cloneDeep(userCompany)
            if (deepClone.edges && deepClone.edges.length > 0) {
                clinicInvitations.value = clinicInvitations.value.concat(deepClone.edges)
            }
        })
    }

    const fetchPatientInvitations = async ({ companyId, groupName, doctorId, statusId, userId, from }: any) => {
        const variables = { companyId, groupName, doctorId, statusId, userId }
        const { onResult: fetchPatientInvitationsDone } = useQuery(fetchPatientInvitationsQuery, variables)
        fetchPatientInvitationsDone(({ data }: any) => {
            const { userCompany } = data
            const deepClone = cloneDeep(userCompany)
            if (from === 'patientInvitations') {
                SET_PATIENT_INVITATIONS(deepClone.edges)
            } else if (from === 'doctorInvitations') {
                SET_DOCTOR_INVITATIONS(deepClone.edges)
            } else if (from === 'myPatients') {
                SET_PATIENTS(deepClone.edges)
            } else if (from === 'message') {
                SET_PATIENTS(deepClone.edges)
            }
        })
    }


    return {
        fetchUserLookup,
        getAllPatientsInvitations,
        getAllDoctorInvitations,
        getClinicInvitations,
        acceptPatientInvitation,
        rejectPatientInvitation,
        REMOVE_PATIENT,
        REMOVE_CLINIC_INVITATION,
        REMOVE_DOCTOR_INVITATION,
        SET_DOCTOR_INVITATIONS_EMPTY,
        fetchDoctorInvitations,
        fetchClinicInvitations,
        fetchPatientInvitations,
    }
})
