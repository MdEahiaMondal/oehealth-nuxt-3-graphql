import { cloneDeep } from "lodash-es";
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { fetchUserRequestQuery, fetchPatientsQuery, } from '~/query/patient'


export const usePatientStore = defineStore('patient', () => {
    const authUserStore = useAuthStore()
    const patients = ref<any[]>([])
    const patientDoctors = ref<any[]>([])
    const patientRequests = ref<any[]>([])
    const appointmentPatients = ref<any[]>([])

    const authUser = computed(() => authUserStore.getUserProfile.value)
    const getMyPatients = computed(() => {
        const patientInvitations = patients.value.map((item: any) => {
            return {
                id: item.node?.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
                doctorId: item.node.doctor?.id,
                doctorName: item.node.doctor?.name,
                userId: item.node.user?.id,
                name: item.node.user?.name,
                email: item.node.user?.email,
                phone: item.node.user?.phone,
                dateOfBirth: item.node.user?.dateOfBirth,
                requestedAt: item.node.requestedAt,
                joinedDatetime: item.node.joinedDatetime,
                status: item.node.status,
                approvalBy: item.node.approvalBy,
            }
        })        
        return patientInvitations.filter((item: any) => {
            return item.status.name !== 'Pending'
        })
    })


    const getUserRequest = computed(() => {
        const newPatientRequests = patientRequests.value.map((item: any) => {
            return {
                id: item.node?.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
                doctorId: item.node.doctor?.id,
                doctorName: item.node.doctor?.name,
                userId: item.node.user?.id,
                name: item.node.user?.name,
                email: item.node.user?.email,
                phone: item.node.user?.phone,
                dateOfBirth: item.node.user?.dateOfBirth,
                requestedAt: item.node.requestedAt,
                joinedDatetime: item.node.joinedDatetime,
                status: item.node.status,
                approvalBy: item.node.approvalBy,
            }
        })

        return newPatientRequests.filter((item: any) => {
            return item.status.name !== 'Pending'
        })
    })

    const getMyApprovedPatients = computed(() => {
        const patientInvitations = patients.value.map((item: any) => {
            return {
                id: item.node?.id,
                company_id: item.node.company?.id,
                company: item.node.company?.name,
                requestedBy: item.node.requestedBy?.name,
                requestedById: item.node.requestedBy?.id,
                doctorId: item.node.doctor?.id,
                doctorName: item.node.doctor?.name,
                userId: item.node.user?.id,
                name: item.node.user?.name,
                email: item.node.user?.email,
                phone: item.node.user?.phone,
                dateOfBirth: item.node.user?.dateOfBirth,
                requestedAt: item.node.requestedAt,
                joinedDatetime: item.node.joinedDatetime,
                status: item.node.status,
                approvalBy: item.node.approvalBy,
            }
        })

        return patientInvitations.filter((item: any) => {
            return item.status.name === 'Approve'
        })
    })


    const getMyApprovedPatientsForMessage = computed(() => {
        const patientInvitations = patients.value.map((item: any) => {
            return {
                status: item.node.status,
                ...item.node.user,
                lastConversation: item.node.lastConversation
            }
        })

        const approvedPatients = patientInvitations.filter((item: any) => {
            return item.status.name === 'Approve'
        })

        //get unique patients
        return [...new Map(approvedPatients.map((item: any) =>
            [item['id'], item])).values()];
    })


    const getPatientDoctors = computed(() => {
        const newPatients = patientDoctors.value.map((item: any) => {
            return {
                ...item.node.doctor,
                lastConversation: item.node.lastConversation
            }
        })

        //get unique doctors
        return [...new Map(newPatients.map((item: any) =>
            [item['id'], item])).values()];
    })

    const getAppointmentPatients = computed(() => {
        return appointmentPatients.value
    })


    const UPDATED_STATUS = ({ status, id }: any) => {
        const patientIndex = patients.value.findIndex((item: any) => {
            return Number(item.node.id) === id
        })

        patients.value[patientIndex].node.status.name = status

        patients.value[patientIndex].node.approvalBy.id = authUser?.value.id
        patients.value[patientIndex].node.approvalBy.name = authUser?.value.name
    }

    const UPDATED_PATIENT_REQUEST_STATUS = ({ status, id }: any) => {
        const patientIndex = patientRequests.value.findIndex((item: any) => {
            return Number(item.node.id) === id
        })

        patientRequests.value[patientIndex].node.status.name = status
        patientRequests.value[patientIndex].node.approvalBy.id = authUser?.value.id
        patientRequests.value[patientIndex].node.approvalBy.name = authUser?.value.name
    }


    const SET_PATIENTS = (payload: any) => {
        patients.value = payload
    }



    const fetchUserRequest = async ({ groupName, userId }: any) => {
        const variables = { groupName, userId }
        const { onResult: fetchUserRequestDone } = useQuery(fetchUserRequestQuery, variables)

        fetchUserRequestDone(({ data }: any) => {
            const { userCompany } = data
            const deepClone = cloneDeep(userCompany)
            patientRequests.value = deepClone.edges

        })
    }

    const fetchPatients = async () => {
        const { onResult: fetchPatientsDone } = useQuery(fetchPatientsQuery)

        fetchPatientsDone(({ data }: any) => {
            const { users } = data
            const deepClone = cloneDeep(users)

            const newUsers = deepClone?.edges?.map((item: any) => {
                if (item.node) {
                    return item.node
                } else {
                    return []
                }
            })
            appointmentPatients.value = newUsers
        })
    }



    return {
        fetchUserRequest,
        getMyPatients,
        getUserRequest,
        getMyApprovedPatients,
        getMyApprovedPatientsForMessage,
        getPatientDoctors,
        UPDATED_STATUS,
        UPDATED_PATIENT_REQUEST_STATUS,
        SET_PATIENTS,
        fetchPatients,
        getAppointmentPatients,
    }
})
