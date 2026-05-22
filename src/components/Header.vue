<template>
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
          <div class="dropdown-item logout" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5C2 2.67157 2.67157 2 3.5 2H6M11 11L14 8L11 5M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>Logout</span>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>