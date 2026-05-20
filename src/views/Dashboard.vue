<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">B</div>
          <span class="logo-text">Bamboo</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 10H17.5M2.5 10L10 2.5L17.5 10M4.16667 8.33333V15.8333C4.16667 16.2754 4.52283 16.6317 4.965 16.6667H7.5V12.5H12.5V16.6667H15.035C15.4772 16.6317 15.8333 16.2754 15.8333 15.8333V8.33333M7.5 16.6667H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/companies" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33333 3.33333H16.6667V16.6667H3.33333V3.33333Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6.66667 6.66667H13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M6.66667 10H13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M6.66667 13.3333H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Companies</span>
        </router-link>

        <router-link to="/process-stages" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="18" cy="12" r="2" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="6" cy="18" r="2" stroke="currentColor" stroke-width="1.8"/>

            <path d="M8 6H14C16.2091 6 18 7.79086 18 10V10" 
            stroke="currentColor" 
            stroke-width="1.8" 
            stroke-linecap="round"/>

            <path d="M8 18H14C16.2091 18 18 16.2091 18 14V14" 
            stroke="currentColor" 
            stroke-width="1.8" 
            stroke-linecap="round"/>
        </svg>

        <span>Process Stages</span>
        </router-link>

        <router-link to="/sales-quotation" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21M7 3V21M17 3V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          <span>Sales Quotation</span>
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-bar">

        <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
          <div class="user-info">
            <div class="user-avatar">
              {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="user-details">
              <p class="user-name">{{ user?.username }}</p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
            <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          
          <transition name="dropdown">
            <div v-if="isDropdownOpen" class="dropdown-menu">
              <div class="dropdown-item" @click="goToProfile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 14V12.5C13 11.5717 12.6313 10.6815 11.9749 10.0251C11.3185 9.36875 10.4283 9 9.5 9H6.5C5.57174 9 4.6815 9.36875 4.02513 10.0251C3.36875 10.6815 3 11.5717 3 12.5V14M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Profile</span>
              </div>
              <div class="dropdown-item" @click="goToSettings">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6.66667 1.66667L4.66667 3.66667H2V6.33333L4 8.33333L2 10.3333V13H4.66667L6.66667 15L8.66667 13H11.3333V10.3333L13.3333 8.33333L11.3333 6.33333V3.66667H8.66667L6.66667 1.66667Z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="8" cy="8.33333" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <span>Settings</span>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout" @click="logout">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5C2 2.67157 2.67157 2 3.5 2H6M11 11L14 8L11 5M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>Logout</span>
              </div>
            </div>
          </transition>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="page-title">
          <h1>Dashboard</h1>
          <p>Welcome back, {{ user?.username }}!</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
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
}

body {
  margin: 0;
  padding: 0;
  background: #f8f9fa;
}

.dashboard {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #6c757d;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 14px;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #8B5CF6;
}

.nav-item.active {
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  color: white;
}

.nav-item.active svg {
  color: white;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  background: #f8f9fa;
}

.top-bar {
  display: flex;
  justify-content: flex-end; 
  align-items: center;
  background: white;
  padding: 10px 32px;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
}

.content-wrapper {
  padding: 32px;
}

.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: #f8f9fa;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.user-details {
  text-align: left;
}

.user-name {
  font-weight: 600;
  margin-bottom: -5px;
  color: #1a1a1a;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #6c757d;
}

.dropdown-arrow {
  color: #6c757d;
  transition: transform 0.2s ease;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #1a1a1a;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background: #fee;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 4px 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .stats-wrapper {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item.full-width {
    grid-column: span 1;
  }
  
  .top-bar {
    flex-direction: row;
    gap: 16px;
  }
  
  .search-box {
    width: 200px;
  }
  
  .user-details {
    display: none;
  }
}
</style>