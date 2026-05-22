<template>
  <AppLayout>
    <div class="page-title">
      <h1>Dashboard</h1>
      <p>Welcome back, {{ user?.username }}!</p>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)
const company = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const goToProfile = () => {
  isDropdownOpen.value = false
}

const goToSettings = () => {
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const loadCompanyInfo = async () => {
  if (!user.value?.company_id) return
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/companies`)
    const companies = response.data
    company.value = companies.find(c => c.id === user.value.company_id)
  } catch (error) {
    console.error('Failed to load company info:', error)
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
    loadCompanyInfo()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.page-title {
  margin-bottom: 32px;
}

.page-title h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.page-title p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}
</style>