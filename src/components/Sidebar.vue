<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">B</div>
        <span class="logo-text">Bamboo</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        to="/dashboard"
        class="nav-item"
        :class="{ active: isActive('/dashboard') }"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2.5 10H17.5M2.5 10L10 2.5L17.5 10M4.16667 8.33333V15.8333C4.16667 16.2754 4.52283 16.6317 4.965 16.6667H7.5V12.5H12.5V16.6667H15.035C15.4772 16.6317 15.8333 16.2754 15.8333 15.8333V8.33333M7.5 16.6667H12.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <span>Dashboard</span>
      </router-link>

      <router-link
        to="/companies"
        class="nav-item"
        :class="{ active: isActive('/companies') }"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M3.33333 3.33333H16.6667V16.6667H3.33333V3.33333Z"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M6.66667 6.66667H13.3333"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M6.66667 10H13.3333"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M6.66667 13.3333H10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <span>Companies</span>
      </router-link>

      <div class="nav-dropdown">
        <div
          class="nav-item dropdown-toggle"
          :class="{ 'dropdown-open': openDropdowns.transaction }"
          @click.stop="toggleDropdown('transaction')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 4H20V20H4V4Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M8 8H16M8 12H16M8 16H12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>

          <span class="dropdown-title">Transaction</span>

          <svg
            class="dropdown-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            :style="{
              transform: openDropdowns.transaction ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div v-show="openDropdowns.transaction" class="dropdown-menu">
          <router-link
            to="/process-stages"
            class="dropdown-item"
            :class="{ active: isActive('/process-stages') }"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="6" cy="6" r="2" stroke="currentColor" stroke-width="1.8" />
              <circle cx="18" cy="12" r="2" stroke="currentColor" stroke-width="1.8" />
              <circle cx="6" cy="18" r="2" stroke="currentColor" stroke-width="1.8" />
              <path
                d="M8 6H14C16.2091 6 18 7.79086 18 10V10"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <path
                d="M8 18H14C16.2091 18 18 16.2091 18 14V14"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span>Process Stages</span>
          </router-link>

          <router-link
            to="/sales-quotation"
            class="dropdown-item"
            :class="{ active: isActive('/sales-quotation') }"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6H21M3 12H21M3 18H21M7 3V21M17 3V21"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <rect
                x="6"
                y="4"
                width="12"
                height="16"
                rx="1"
                stroke="currentColor"
                stroke-width="1.5"
              />
            </svg>
            <span>Sales Quotation</span>
          </router-link>
        </div>
      </div>

      <div class="nav-dropdown">
        <div
          class="nav-item dropdown-toggle"
          :class="{ 'dropdown-open': openDropdowns.master }"
          @click.stop="toggleDropdown('master')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>

          <span class="dropdown-title">Master</span>

          <svg
            class="dropdown-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            :style="{
              transform: openDropdowns.master ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <div v-show="openDropdowns.master" class="dropdown-menu">
          <router-link
            to="/master-customer"
            class="dropdown-item"
            :class="{ active: isActive('/master-customer') }"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <span>Master Customer</span>
          </router-link>

          <router-link
            to="/master-branch"
            class="dropdown-item"
            :class="{ active: isActive('/master-branch') }"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 13.17 12 22 12 22C12 22 19 13.17 19 9C19 5.13 15.87 2 12 2Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <span>Master Branch</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const openDropdowns = reactive({
  transaction: false,
  master: false
})

const toggleDropdown = (dropdown) => {
  openDropdowns[dropdown] = !openDropdowns[dropdown]
}

const isActive = (path) => {
  if (path === '/process-stages' && route.path.startsWith('/process-stages')) {
    return true
  }
  if (path === '/sales-quotation' && route.path.startsWith('/sales-quotation')) {
    return true
  }
  if (path === '/master-customer' && route.path.startsWith('/master-customer')) {
    return true
  }
  if (path === '/master-branch' && route.path.startsWith('/master-branch')) {
    return true
  }
  return route.path === path
}

const handleClickOutside = (event) => {
  const sidebar = document.querySelector('.sidebar')
  if (sidebar && !sidebar.contains(event.target)) {
    openDropdowns.transaction = false
    openDropdowns.master = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
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
  z-index: 100;
}

.sidebar-header {
  padding: 22px;
  border-bottom: 1px solid #e9ecef;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
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

.nav-dropdown {
  display: flex;
  flex-direction: column;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-title {
  flex: 1;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.dropdown-toggle.dropdown-open {
  background: #f8f9fa;
  color: #8B5CF6;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  margin-left: 32px;
  margin-top: 4px;
  margin-bottom: 4px;
  gap: 4px;
  border-left: 1px solid #e9ecef;
  padding-left: 12px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: #6c757d;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 13px;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #8B5CF6;
}

.dropdown-item.active {
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  color: white;
}

.dropdown-item.active svg {
  color: white;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
}
</style>