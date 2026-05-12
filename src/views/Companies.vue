<template>
  <div class="companies-page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">B</div>
          <span class="logo-text">Bamboo</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 10H17.5M2.5 10L10 2.5L17.5 10M4.16667 8.33333V15.8333C4.16667 16.2754 4.52283 16.6317 4.965 16.6667H7.5V12.5H12.5V16.6667H15.035C15.4772 16.6317 15.8333 16.2754 15.8333 15.8333V8.33333M7.5 16.6667H12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/companies" class="nav-item active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33333 3.33333H16.6667V16.6667H3.33333V3.33333Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6.66667 6.66667H13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M6.66667 10H13.3333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M6.66667 13.3333H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>Companies</span>
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
        <div class="page-header">
          <div>
            <h1>Companies</h1>
            <p>Manage all registered companies</p>
          </div>
          <button class="btn-primary" @click="openAddModal">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Add Company
          </button>
        </div>

        <!-- Search & Filter -->
        <div class="table-controls">
        <div class="search-wrapper">
            <div class="search-box-table">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.25 12.5C10.1495 12.5 12.5 10.1495 12.5 7.25C12.5 4.35051 10.1495 2 7.25 2C4.35051 2 2 4.35051 2 7.25C2 10.1495 4.35051 12.5 7.25 12.5Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14 14L11 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search companies..." 
                @input="filterCompanies"
            >
            </div>
            <div class="filter-buttons">
            <button 
                @click="currentFilter = 'all'" 
                :class="['filter-btn', { active: currentFilter === 'all' }]">
                All
            </button>
            <button 
                @click="currentFilter = 'mine'" 
                :class="['filter-btn', { active: currentFilter === 'mine' }]">
                My Company
            </button>
            </div>
        </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading companies...</p>
        </div>

        <!-- Companies Table -->
        <div v-else class="table-container">
          <table class="companies-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="company in filteredCompanies" :key="company.id">
                <td class="company-name">
                  <div class="company-avatar">
                    {{ company.company_name?.charAt(0).toUpperCase() || 'C' }}
                  </div>
                  <span class="name-text">{{ company.company_name }}</span>
                  <span v-if="company.id === user?.company_id" class="badge">Your Company</span>
                </td>
                <td>{{ company.phone || '-' }}</td>
                <td class="address-cell">{{ company.address || '-' }}</td>
                <td class="actions">
                  <button class="action-btn view" @click="viewCompany(company)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3C4 3 2 8 2 8C2 8 4 13 8 13C12 13 14 8 14 8C14 8 12 3 8 3Z" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </button>
                    <button class="action-btn edit" @click="editCompany(company)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.3333 1.99996L14 4.66663M2 11.3333L10.6667 2.66663L13.3333 5.33329L4.66667 14H2V11.3333Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    </button>
                  <button class="action-btn delete" @click="deleteCompany(company)">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4H3.33333H14M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredCompanies.length === 0">
                <td colspan="5" class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4L4 12L24 20L44 12L24 4Z" stroke="#d1d5db" stroke-width="1.5"/>
                    <path d="M4 24L24 32L44 24" stroke="#d1d5db" stroke-width="1.5"/>
                    <path d="M4 34L24 42L44 34" stroke="#d1d5db" stroke-width="1.5"/>
                  </svg>
                  <p>No companies found</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- View Company Modal -->
        <div v-if="selectedCompany" class="modal-overlay" @click="closeModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h3>Company Details</h3>
              <button class="close-btn" @click="closeModal">×</button>
            </div>
            <div class="modal-body">
              <div class="detail-row">
                <label>Company Name</label>
                <p>{{ selectedCompany.company_name }}</p>
              </div>
              <div class="detail-row">
                <label>Phone</label>
                <p>{{ selectedCompany.phone || '-' }}</p>
              </div>
              <div class="detail-row">
                <label>Address</label>
                <p>{{ selectedCompany.address || '-' }}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>

        <!-- Add Company Modal - DIPINDAHKAN KE LUAR -->
        <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h3>Add New Company</h3>
              <button class="close-btn" @click="closeAddModal">×</button>
            </div>
            <form @submit.prevent="submitAddCompany">
              <div class="modal-body">
                <div class="form-group">
                  <label>Company Name <span>*</span></label>
                  <input 
                    type="text" 
                    v-model="newCompany.company_name" 
                    class="form-input"
                    required
                    placeholder="Enter company name"
                  />
                </div>
                <div class="form-group">
                  <label>Phone <span>*</span></label>
                  <input 
                    type="text" 
                    v-model="newCompany.phone" 
                    class="form-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div class="form-group">
                  <label>Address <span>*</span></label>
                  <textarea 
                    v-model="newCompany.address" 
                    class="form-input"
                    rows="3"
                    placeholder="Enter company address"
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn-secondary" @click="closeAddModal">Cancel</button>
                <button type="submit" class="btn-primary" :disabled="adding">
                  {{ adding ? 'Adding...' : 'Add Company' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Edit Company Modal -->
<div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
  <div class="modal" @click.stop>
    <div class="modal-header">
      <h3>Edit Company</h3>
      <button class="close-btn" @click="closeEditModal">×</button>
    </div>
    <form @submit.prevent="submitEditCompany">
      <div class="modal-body">
        <div class="form-group">
          <label>Company Name <span>*</span></label>
          <input 
            type="text" 
            v-model="editCompanyData.company_name" 
            class="form-input"
            required
            placeholder="Enter company name"
          />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input 
            type="text" 
            v-model="editCompanyData.phone" 
            class="form-input"
            placeholder="Enter phone number"
          />
        </div>
        <div class="form-group">
          <label>Address</label>
          <textarea 
            v-model="editCompanyData.address" 
            class="form-input"
            rows="3"
            placeholder="Enter company address"
          ></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-secondary" @click="closeEditModal">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="editing">
          {{ editing ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</div>
      </div>
    </main>
  </div>


</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)
const companies = ref([])
const loading = ref(true)
const searchQuery = ref('')
const currentFilter = ref('all')
const selectedCompany = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

// Add Company variables
const showAddModal = ref(false)
const adding = ref(false)
const newCompany = ref({
  company_name: '',
  phone: '',
  address: ''
})

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

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const loadCompanies = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/companies`)
    companies.value = response.data
  } catch (error) {
    console.error('Failed to load companies:', error)
  } finally {
    loading.value = false
  }
}

const filteredCompanies = computed(() => {
  let filtered = companies.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(company => 
      company.company_name?.toLowerCase().includes(query) ||
      company.phone?.includes(query)
    )
  }
  
  if (currentFilter.value === 'mine' && user.value?.company_id) {
    filtered = filtered.filter(company => company.id === user.value.company_id)
  }
  
  return filtered
})

const filterCompanies = () => {}

const viewCompany = (company) => {
  selectedCompany.value = company
}

const editCompany = (company) => {
  alert(`Edit company: ${company.company_name}`)
}

const deleteCompany = (company) => {
  if (confirm(`Are you sure you want to delete ${company.company_name}?`)) {
    alert(`Delete company: ${company.company_name}`)
  }
}

const closeModal = () => {
  selectedCompany.value = null
}

// Add Company functions
const openAddModal = () => {
  newCompany.value = {
    company_name: '',
    phone: '',
    address: ''
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  adding.value = false
}

const submitAddCompany = async () => {
  if (!newCompany.value.company_name) {
    alert('Company name is required')
    return
  }
  
  adding.value = true
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/companies/add`, newCompany.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.data.success || response.data.id) {
      alert('Company added successfully!')
      closeAddModal()
      loadCompanies()
    }
  } catch (error) {
    console.error('Failed to add company:', error)
    alert(error.response?.data?.error || 'Failed to add company')
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadCompanies()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const showEditModal = ref(false)
const editing = ref(false)
const editCompanyData = ref({
  id: null,
  company_name: '',
  phone: '',
  address: ''
})

// Edit Company functions
const openEditModal = (company) => {
  editCompanyData.value = {
    id: company.id,
    company_name: company.company_name,
    phone: company.phone || '',
    address: company.address || ''
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editing.value = false
  editCompanyData.value = {
    id: null,
    company_name: '',
    phone: '',
    address: ''
  }
}

const submitEditCompany = async () => {
  if (!editCompanyData.value.company_name) {
    alert('Company name is required')
    return
  }
  
  editing.value = true
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/companies/${editCompanyData.value.id}`, 
      {
        company_name: editCompanyData.value.company_name,
        phone: editCompanyData.value.phone,
        address: editCompanyData.value.address
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Company updated successfully!')
      closeEditModal()
      loadCompanies() // Refresh the list
    }
  } catch (error) {
    console.error('Failed to update company:', error)
    alert(error.response?.data?.error || 'Failed to update company')
  } finally {
    editing.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

/* Form styles untuk modal */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-group label span {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  font-size: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

textarea.form-input {
  resize: vertical;
}

.companies-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Sidebar */
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

/* Main Content */
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

/* User Dropdown */
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

/* Dropdown Menu */
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

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.page-header p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Table Controls */
.table-controls {
  margin-bottom: 24px;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box-table {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 10px 16px;
  flex: 1;
  max-width: 320px;
}

.search-box-table svg {
  color: #adb5bd;
}

.search-box-table input {
  border: none;
  outline: none;
  font-size: 14px;
  flex: 1;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: transparent;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.filter-btn:hover {
  background: #f8f9fa;
}

.filter-btn.active {
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  color: white;
  border-color: transparent;
}

/* Table */
.table-container {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
  overflow-x: auto;
}

.companies-table {
  width: 100%;
  border-collapse: collapse;
}

.companies-table thead tr {
  border-bottom: 1px solid #e9ecef;
}

.companies-table th {
  text-align: left;
  padding: 16px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.companies-table td {
  padding: 16px 20px;
  font-size: 14px;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.companies-table tbody tr:hover {
  background: #f8f9fa;
}

.company-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  font-weight: 600;
  font-size: 14px;
}

.name-text {
  font-weight: 500;
}

.badge {
  padding: 4px 8px;
  background: #e9d5ff;
  color: #6B21A5;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
}

.address-cell {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
}

.action-btn.view:hover {
  background: #e9d5ff;
  color: #8B5CF6;
}

.action-btn.edit:hover {
  background: #dbeafe;
  color: #3b82f6;
}

.action-btn.delete:hover {
  background: #fee;
  color: #dc3545;
}

.empty-state {
  text-align: center;
  padding: 60px !important;
  color: #adb5bd;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 60px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-top-color: #8B5CF6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
}

.close-btn:hover {
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  margin-bottom: 16px;
}

.detail-row label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.detail-row p {
  font-size: 15px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 500;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-secondary:hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box-table {
    width: 100%;
  }
  
  .companies-table th,
  .companies-table td {
    padding: 12px;
  }
  
  .address-cell {
    display: none;
  }
  
  .user-details {
    display: none;
  }
}
</style>