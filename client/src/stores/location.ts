import type { CityInfo } from '@/api/city'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLocationStore = defineStore(
  'location',
  () => {
    const location = ref<CityInfo>({
      id: '101010100',
      name: '北京',
      adm1: '北京市',
      adm2: '北京',
      country: '中国',
      lat: '39.90499',
      lon: '116.40529'
    })

    function setLocation(city: CityInfo) {
      location.value = city
    }

    return {
      location,
      setLocation
    }
  },
  {
    persist: true
  }
)
