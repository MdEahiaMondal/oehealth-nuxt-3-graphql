import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { fetchDoctorsQuery } from '@/query/user'

export const useUserStore = defineStore('user', () => {
  const authUserStore = useAuthStore()

  const doctors = ref([])

  const getAllDoctors = computed(() => doctors.value)
  const getAllDoctorWithOutAuthUser = computed(() => {
    const authUser = authUserStore.getUserProfile
    const items = doctors.value?.filter((doctor: any) => {
      return Number(doctor.id) !== Number(authUser.id)
    })   
    return items.map((item: any) => {
      return {
        ...item.node
      }
    })
  })

  const fetchDoctors = ({ email }: any) => {
    const variables = { email }
    const { onResult: onFetchDoctorsDone }: any = useQuery(
      fetchDoctorsQuery,
      variables
    );
    onFetchDoctorsDone(({ data }: any) => {
      const { users } = data;
      doctors.value = users?.edges.length > 0 ? users?.edges : [];
    })   
  }

  return {
    fetchDoctors,
    getAllDoctors,
    getAllDoctorWithOutAuthUser
  }
})
