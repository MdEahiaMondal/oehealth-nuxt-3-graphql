import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import {
    fetchAppointmentsQuery,
    fetchAppointmentCodesQuery,
    fetchSingleAppointmentQuery,
    fetchAppointmentDurationQuery,
    createAppointmentQuery,
    updateAppointmentQuery,
    deleteAppointmentQuery,
    createAppointmentDetailsQuery,
    createAppointmentShortCodeQuery,
    updateAppointmentDetailsQuery,
    deleteAppointmentDetailsQuery,
    deleteAppointmentShortCodeQuery,
    fetchToothsQuery,
    fetchDiagnosticsQuery,
    fetchTreatmentsQuery,
    createToothQuery,
    createDiagnosticQuery,
    createTreatmentQuery,
    createAppointmentDurationQuery,
    fetchPatientDiseasesQuery,
    fetchPrioritiesQuery,
    createAppointmentPriorityQuery,
    updateAppointmentPriorityQuery,
    deleteAppointmentPriorityQuery,
    createAppointmentSpecializationQuery,
    updateAppointmentSpecializationQuery,
    deleteAppointmentSpecializationQuery,
    createAppointmentFileQuery,
    createAppointmentSurveyQuery,
    updateAppointmentSurveyQuery,
    deleteAppointmentSurveyQuery,
} from '~/query/appointment'

export const useAppointmentStore = defineStore('appointment', () => {
    const loading = ref(false)
    const tooths = ref<any[]>([])
    const diagnostics = ref<any[]>([])
    const treatments = ref<any[]>([])
    const appointments = ref<any[]>([])
    const appointmentDurations = ref<any[]>([])
    const typeOfAppointments = ref<any[]>([])
    const patientDiseases = ref<any[]>([])
    const appointmentCodes = ref<any[]>([])

    const getAppointments = computed(() => {
        return appointments.value?.map((item: any) => {
            return {
              id: item.node.id,
              duration: item.node.duration,
              startDate: item.node.startDate,
              isActive: item.node.isActive,
              patient: item.node.patient.name,
              doctorId: item.node.doctor.id,
              doctor: item.node.doctor.name,
              appointmentDetails: item.node.appointmentDetails,
              appointmentprioritySet: item.node.appointmentprioritySet,
              companyId: item.node.company.id,
              companyName: item.node.company.name,
              survey: item.node.appointmentSurvey,
            };
        })
    })

    const getAppointmentCodes = computed(() => appointmentCodes.value)
    const getTooths = computed(() => tooths.value)
    const getDiagnostics = computed(() => diagnostics.value)
    const getTreatments = computed(() => treatments.value)
    const getDurations = computed(() => {
        return appointmentDurations.value?.map((item: any) => {
            if (item.number >= 60) {
                item.text = Math.ceil(item.number / 60) + 'h'
            } else {
                item.text = Math.ceil(item.number) + 'm'
            }
            return item
        })
    })
    const getTypeOfAppointments = computed(() => typeOfAppointments.value)
    const getPatientDiseases = computed(() => patientDiseases.value)

    const fetchAppointments = async ({ patientId, doctorId, companyId, langId, isActive }: any) => {
        const variables = { patientId, doctorId, companyId, langId, isActive };
        const { onResult: fetchAppointmentsDone } = useQuery(fetchAppointmentsQuery, variables)
        fetchAppointmentsDone(({ data }: any) => {
            const { appointments: newData } = data
            const deepClone = cloneDeep(newData);
            appointments.value = deepClone.edges
        })
    }

    const fetchAppointmentCodes = async () => {
        const { data } = await useAsyncQuery(fetchAppointmentCodesQuery)
        const { appointmentCode }: any = data.value
        appointmentCodes.value = appointmentCode
    }

    const fetchSingleAppointment = async ({ id, langId }: any) => {
        try {
            const variables = { id, langId }
            return await useAsyncQuery(fetchSingleAppointmentQuery, variables)
        } catch (error) {
            console.log(error);
        }
    }

    const fetchAppointmentDuration = async () => {
        const { onResult: fetchAppointmentDurationDone } = useQuery(fetchAppointmentDurationQuery)
        fetchAppointmentDurationDone(({ data }: any) => {
            const { durations: newData } = data
            const deepClone = cloneDeep(newData)
            appointmentDurations.value = deepClone
        })
    }


    const createAppointment = async ({ companyId, patientId, doctorId, startDate, duration, note, createdBy, updatedBy }: any) => {
        const variables = { companyId, patientId, doctorId, startDate, duration, note, createdBy, updatedBy }
        const { mutate: setCreateAppointment } = useMutation(createAppointmentQuery, { variables })
        return await setCreateAppointment()
    }

    const updateAppointment = async ({ id, companyId, patientId, doctorId, startDate, duration, note, updatedBy }: any) => {
        const variables = { id, companyId, patientId, doctorId, startDate, duration, note, updatedBy }
        const { mutate: setUpdateAppointment } = useMutation(updateAppointmentQuery, { variables })
        return await setUpdateAppointment()
    }

    const deleteAppointment = async ({ id }: any) => {
        const variables = { id }
        const { mutate: setDeleteAppointment } = useMutation(deleteAppointmentQuery, { variables })
        return await setDeleteAppointment()
    }

    const createAppointmentDetails = async ({ appointmentId, toothId, diagnosticId, treatmentId, createdBy, updatedBy }: any) => {
        const variables = { appointmentId, toothId, diagnosticId, treatmentId, createdBy, updatedBy }
        const { mutate: setCreateAppointmentDetails } = useMutation(createAppointmentDetailsQuery, { variables })
        return await setCreateAppointmentDetails()
    }

    const createAppointmentShortCode = async ({ appointmentId, codeId, createdBy, updatedBy }: any) => {
        const variables = { appointmentId, codeId, createdBy, updatedBy }
        const { mutate: setCreateAppointmentShortCode } = useMutation(createAppointmentShortCodeQuery, { variables })
        return await setCreateAppointmentShortCode()
    }

    const updateAppointmentDetails = async ({ id, appointmentId, toothId, diagnosticId, treatmentId, updatedBy }: any) => {
        const variables = { id, appointmentId, toothId, diagnosticId, treatmentId, updatedBy }
        const { mutate: setUpdateAppointmentDetails } = useMutation(updateAppointmentDetailsQuery, { variables })
        return await setUpdateAppointmentDetails()
    }

    const deleteAppointmentDetails = async ({ id }: any) => {
        const variables = { id }
        const { mutate: setDeleteAppointmentDetails } = useMutation(deleteAppointmentDetailsQuery, { variables })
        return await setDeleteAppointmentDetails()
    }

    const deleteAppointmentShortCode = async ({ id }: any) => {
        const variables = { id }
        const { mutate: setDeleteAppointmentShortCode } = useMutation(deleteAppointmentShortCodeQuery, { variables })
        return await setDeleteAppointmentShortCode()
    }

    const fetchTooths = async () => {
        const { onResult: fetchToothsDone } = useQuery(fetchToothsQuery)
        fetchToothsDone(({ data }: any) => {
            const { teeth: newData } = data
            const deepClone = cloneDeep(newData)
            tooths.value = deepClone
        })
    }

    const fetchDiagnostics = async ({ langId }: any) => {
        const variables = { langId }
        const { onResult: fetchDiagnosticsDone } = useQuery(fetchDiagnosticsQuery, variables)
        fetchDiagnosticsDone(({ data }: any) => {
            const { diagnostics: newData } = data
            const deepClone = cloneDeep(newData)
            const newDiagnostic = deepClone.map((item: any) => {
                if (item.diagnosticlangSet && item.diagnosticlangSet.edges?.length > 0) {
                    return {
                        id: item.id,
                        name: item.diagnosticlangSet.edges[0]?.node?.name
                    }
                } else {
                    return {
                        id: item.id,
                        name: item.name
                    }
                }
            })
            diagnostics.value = newDiagnostic
        })
    }

    const fetchTreatments = async ({ langId }: any) => {
        try {
            const variables = { langId }
            const { onResult: fetchTreatmentsDone } = useQuery(fetchTreatmentsQuery, variables)
            fetchTreatmentsDone(({ data }) => {
                const { treatments: newData }: any = data
                const deepClone = cloneDeep(newData)
                const newTreatments = deepClone.map((item: any) => {
                    if (item.treatmentlangSet && item.treatmentlangSet.edges?.length > 0) {
                        return {
                            id: item.id,
                            name: item.treatmentlangSet.edges[0]?.node?.name
                        }
                    } else {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    }
                })
                treatments.value = newTreatments
            })
        } catch (error) {
            console.log(error);
        }
    }

    const createTooth = async ({ number, createdBy }: any) => {
        try {
            const variables = { number, createdBy }
            const { mutate: setCreateTooth } = useMutation(createToothQuery, { variables })
            const { data }: any = await setCreateTooth()
            const { createTooth } = data
            if (createTooth) {
                const { tooth } = createTooth
                tooths.value.push(tooth)
                return tooth
            }
            return null
        } catch (error) {
            console.log(error);
        }

    }

    const createDiagnostic = async ({ name, createdBy }: any) => {
        try {
            const variables = { name, createdBy }
            const { mutate: setCreateDiagnostic } = useMutation(createDiagnosticQuery, { variables })
            const { data }: any = await setCreateDiagnostic()
            const { createDiagnostic } = data
            if (createDiagnostic) {
                const { diagnostic } = createDiagnostic
                diagnostics.value.push(diagnostic)
                return diagnostic
            }
            return null
        } catch (error) {
            console.log(error);
        }
    }

    const createTreatment = async ({ name, createdBy }: any) => {
        try {
            const variables = { name, createdBy }
            const { mutate: setCreateTreatment } = useMutation(createTreatmentQuery, { variables })
            const { data }: any = await setCreateTreatment()
            const { createTreatment } = data
            if (createTreatment) {
                const { treatment } = createTreatment
                treatments.value.push(treatment)
                return treatment
            }
            return null
        } catch (error) {
            console.log(error);
        }
    }

    const createAppointmentDuration = async ({ number, createdBy }: any) => {
        try {
            const variables = { number, createdBy }
            const { mutate: setCreateAppointmentDuration } = useMutation(createAppointmentDurationQuery, { variables })
            const { data }: any = await setCreateAppointmentDuration()
            const { createDuration } = data
            if (createDuration) {
                const { durations } = createDuration
                appointmentDurations.value.push(durations)
                return durations;
            }
            return null
        } catch (error) {
            return error
        }
    }

    const fetchPatientDiseases = async ({ patientId }: any) => {
        try {
            const variables = { patientId }
            const { onDone: fetchPatientDiseasesDone } = useMutation(fetchPatientDiseasesQuery, { variables })
            fetchPatientDiseasesDone(({ data }) => {
                const { diseases } = data
                const deepClone = cloneDeep(diseases)
                patientDiseases.value = deepClone
            })
        } catch (error) {
            console.log(error);
        }
    }


    const fetchPriorities = async ({ langId }: any) => {
        try {
            const variables = { langId }
            const { onResult: fetchPrioritiesDone } = useQuery(fetchPrioritiesQuery, variables)
            fetchPrioritiesDone(({ data }) => {
                const { priorities }: any = data
                const newPriorities = priorities.map((item: any) => {
                    if (item.prioritylangSet && item.prioritylangSet.edges?.length > 0) {
                        return {
                            id: item.id,
                            name: item.prioritylangSet.edges[0]?.node?.name
                        }
                    } else {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    }
                })
                typeOfAppointments.value = newPriorities
            })
        } catch (error) {
            console.log(error);
        }
    }

    const createAppointmentPriority = async ({ appointmentId, priorityId, createdById, updatedById }: any) => {
        try {
            const variables = { appointmentId, priorityId, createdById, updatedById }
            const { mutate: setCreateAppointmentPriority } = useMutation(createAppointmentPriorityQuery, { variables })
            return await setCreateAppointmentPriority()
        } catch (error) {
            console.log(error);
        }
    }

    const updateAppointmentPriority = async ({ id, appointmentId, priorityId, createdById, updatedById }: any) => {
        try {
            const variables = { id, appointmentId, priorityId, createdById, updatedById }
            const { mutate: setUpdateAppointmentPriority } = useMutation(updateAppointmentPriorityQuery, { variables })
            return await setUpdateAppointmentPriority()
        } catch (error) {
            console.log(error);
        }
    }


    const deleteAppointmentPriority = async ({ id }: any) => {
        try {
            const variables = { id }
            const { mutate: setDeleteAppointmentPriority } = useMutation(deleteAppointmentPriorityQuery, { variables })
            return await setDeleteAppointmentPriority()
        } catch (error) {
            console.log(error);
        }
    }

    const createAppointmentSpecialization = async ({ appointmentId, specializationId, createdById, updatedById }: any) => {
        try {
            const variables = { appointmentId, specializationId, createdById, updatedById }
            const { mutate: setCreateAppointmentSpecialization } = useMutation(createAppointmentSpecializationQuery, { variables })
            return await setCreateAppointmentSpecialization()
        } catch (error) {
            console.log(error);
        }
    }

    const updateAppointmentSpecialization = async ({ id, appointmentId, specializationId, createdById, updatedById }: any) => {
        try {
            const variables = { id, appointmentId, specializationId, createdById, updatedById }
            const { mutate: setUpdateAppointmentSpecialization } = useMutation(updateAppointmentSpecializationQuery, { variables })
            return await setUpdateAppointmentSpecialization()
        } catch (error) {
            console.log(error);
        }
    }


    const deleteAppointmentSpecialization = async ({ id }: any) => {
        try {
            const variables = { id }
            const { mutate: setDeleteAppointmentSpecialization } = useMutation(deleteAppointmentSpecializationQuery, { variables })
            return await setDeleteAppointmentSpecialization()
        } catch (error) {
            console.log(error);
        }
    }


    const createAppointmentFile = async ({ name, file, appointmentId, doctorId, createdById, updatedById }: any) => {
        try {
            const variables = { name, file, appointmentId, doctorId, createdById, updatedById }
            const { mutate: setCreateAppointmentFile } = useMutation(createAppointmentFileQuery, { variables })
            return await setCreateAppointmentFile()
        } catch (error) {
            console.log(error);
        }
    }

    const createAppointmentSurvey = async ({ surveyId, appointmentId, createdById, updatedById }: any) => {
        try {
            const variables = { surveyId, appointmentId, createdById, updatedById }
            const { mutate: setCreateAppointmentSurvey } = useMutation(createAppointmentSurveyQuery, { variables })
            return await setCreateAppointmentSurvey()
        } catch (error) {
            console.log(error);
        }
    }

    const updateAppointmentSurvey = async ({ appointmentSurveyId, surveyId, appointmentId, createdById, updatedById }: any) => {
        try {
            const variables = { appointmentSurveyId, surveyId, appointmentId, createdById, updatedById }
            const { mutate: setUpdateAppointmentSurvey } = useMutation(updateAppointmentSurveyQuery, { variables })
            return await setUpdateAppointmentSurvey()
        } catch (error) {
            console.log(error);
        }
    }

    const deleteAppointmentSurvey = async ({ appointmentSurveyId }: any) => {
        try {
            const variables = { appointmentSurveyId }
            const { mutate: setDeleteAppointmentSurvey } = useMutation(deleteAppointmentSurveyQuery, { variables })
            return await setDeleteAppointmentSurvey()
        } catch (error) {
            console.log(error);
        }
    }





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
})
