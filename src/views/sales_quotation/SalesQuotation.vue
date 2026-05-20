<template>
  <div class="sales-quotation-page">
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
            <path d="M8 6H14C16.2091 6 18 7.79086 18 10V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M8 18H14C16.2091 18 18 16.2091 18 14V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span>Process Stages</span>
        </router-link>

        <router-link to="/sales-quotation" class="nav-item active">
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
            <div class="user-avatar">{{ user?.username?.charAt(0).toUpperCase() || 'U' }}</div>
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
            <h1>Sales Quotation</h1>
            <p>Pull sales quotation data by date range</p>
          </div>
          <button class="btn-primary" @click="openFetchModal">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V15M3 9H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Pull Data
          </button>
        </div>

        <div class="groups-section">
          <div class="section-header">
            <h2>Pull History</h2>
            <button class="btn-refresh" @click="loadGroups" :disabled="loadingGroups">
              <svg width="15" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 2.5V6H9.5M13 8C12.5 11.5 9.5 14 6 14C2.5 14 0 11.5 0 8C0 4.5 2.5 2 6 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Refresh
            </button>
          </div>

          <div v-if="loadingGroups" class="loading-state">
            <div class="spinner"></div>
            <p>Loading groups...</p>
          </div>

          <div v-else-if="groups.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L4 12L24 20L44 12L24 4Z" stroke="#d1d5db" stroke-width="1.5"/>
              <path d="M4 24L24 32L44 24" stroke="#d1d5db" stroke-width="1.5"/>
              <path d="M4 34L24 42L44 34" stroke="#d1d5db" stroke-width="1.5"/>
            </svg>
            <p>No pull history found</p>
          </div>

          <div v-else class="groups-grid">
            <div v-for="group in groups" :key="group.id" class="group-card" @click="viewGroupDetail(group)">
              <div class="card-header">
                <div class="card-title">
                  <span class="group-id">#{{ group.id }}</span>
                  <span :class="['status-badge', getStatusClass(group.status)]">
                    {{ group.status }}
                  </span>
                </div>
                <button class="card-delete" @click.stop="deleteGroup(group)">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4H3.33333H14M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="card-body">
                <div class="date-range">
                  <span class="label">Period:</span>
                  <span>{{ formatDate(group.tanggal_mulai) }} - {{ formatDate(group.tanggal_akhir) }}</span>
                </div>
                <div class="total-data">
                  <span class="label">Total Data:</span>
                  <span class="total-count">{{ group.total_data }} items</span>
                </div>
                <div class="created-at">
                  <span class="label">Created:</span>
                  <span>{{ formatDateTime(group.createdAt) }}</span>
                </div>
                <div v-if="group.error_message" class="error-message">
                  <span class="label">Error:</span>
                  <span>{{ group.error_message }}</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="view-detail">Click to view details →</span>
              </div>
            </div>
          </div>

          <div v-if="pagination.totalPages > 1" class="pagination">
            <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1">
              Previous
            </button>
            <span class="page-info">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
            <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showFetchModal" class="modal-overlay" @click="closeFetchModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Pull Sales Quotation Data</h3>
          <button class="close-btn" @click="closeFetchModal">×</button>
        </div>
        <form @submit.prevent="submitFetchData">
          <div class="modal-body">
            <div class="form-group">
              <label>Tanggal Mulai <span class="required">*</span></label>
              <input 
                type="date" 
                v-model="fetchForm.tanggal_mulai" 
                class="form-input"
                :max="fetchForm.tanggal_akhir"
                required
              />
            </div>
            <div class="form-group">
              <label>Tanggal Akhir <span class="required">*</span></label>
              <input 
                type="date" 
                v-model="fetchForm.tanggal_akhir" 
                class="form-input"
                :min="fetchForm.tanggal_mulai"
                required
              />
            </div>
            <div class="info-note">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="#8B5CF6" stroke-width="1.5"/>
                <path d="M8 4V8L10 10" stroke="#8B5CF6" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <span>Data akan ditarik secara background. Anda akan mendapatkan notifikasi saat selesai.</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeFetchModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="fetching">
              {{ fetching ? 'Processing...' : 'Start Pull' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="selectedGroup" class="modal-overlay modal-large" @click="closeDetailModal">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <h3 style="margin: 0;">Group Detail #{{ selectedGroup.id }}</h3>
            <span :class="['status-badge', getStatusClass(selectedGroup.status)]">
              {{ selectedGroup.status }}
            </span>
          </div>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-summary">
            <div class="summary-item">
              <span class="label">Period:</span>
              <span>{{ formatDate(selectedGroup.tanggal_mulai) }} - {{ formatDate(selectedGroup.tanggal_akhir) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total Data:</span>
              <span>{{ selectedGroup.total_data }} items</span>
            </div>
            <div class="summary-item">
              <span class="label">Created:</span>
              <span>{{ formatDateTime(selectedGroup.createdAt) }}</span>
            </div>
          </div>

          <div class="transactions-table-wrapper">
            <div class="table-header">
              <h4>Sales Quotations</h4>
              <div class="search-box">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input type="text" v-model="searchDetail" placeholder="Search quotations...">
              </div>
            </div>
            
            <div v-if="loadingDetail" class="loading-state small">
              <div class="spinner small"></div>
              <p>Loading quotations...</p>
            </div>
            
            <div v-else-if="filteredDetails.length === 0" class="empty-state small">
              <p>No quotations found</p>
            </div>
            
            <div v-else class="table-container">
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in filteredDetails" :key="detail.id">
                    <td>{{ detail.number || '-' }}</td>
                    <td>{{ formatDate(detail.transDate) }}</td>
                    <td class="item-name">{{ detail.name || '-' }}</td>
                    <td class="actions">
                      <button class="action-btn delete" @click="deleteDetail(detail)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4H3.33333H14M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeDetailModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const groups = ref([])
const loadingGroups = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const showFetchModal = ref(false)
const fetching = ref(false)
const fetchForm = ref({
  tanggal_mulai: '',
  tanggal_akhir: ''
})

const selectedGroup = ref(null)
const loadingDetail = ref(false)
const searchDetail = ref('')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID')
}

const getStatusClass = (status) => {
  const classes = {
    'PENDING': 'status-pending',
    'IN_PROGRESS': 'status-progress',
    'COMPLETED': 'status-completed',
    'FAILED': 'status-failed'
  }
  return classes[status] || 'status-pending'
}

const loadGroups = async () => {
  loadingGroups.value = true
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales-quotation/groups`, {
      params: {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    groups.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Failed to load groups:', error)
    if (error.response?.status === 401) {
      logout()
    }
  } finally {
    loadingGroups.value = false
  }
}

const changePage = (newPage) => {
  pagination.value.page = newPage
  loadGroups()
}

const openFetchModal = () => {
  fetchForm.value = {
    tanggal_mulai: '',
    tanggal_akhir: ''
  }
  showFetchModal.value = true
}

const closeFetchModal = () => {
  showFetchModal.value = false
  fetching.value = false
}

const submitFetchData = async () => {
  if (!fetchForm.value.tanggal_mulai || !fetchForm.value.tanggal_akhir) {
    alert('Tanggal mulai dan tanggal akhir wajib diisi')
    return
  }
  
  fetching.value = true
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/fetch`,
      fetchForm.value,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Proses penarikan data dimulai! Silahkan refresh halaman untuk melihat progress.')
      closeFetchModal()
      loadGroups()
      
      let attempts = 0
      const interval = setInterval(() => {
        if (attempts < 12) {
          loadGroups()
          attempts++
        } else {
          clearInterval(interval)
        }
      }, 5000)
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    alert(error.response?.data?.error || 'Gagal memulai proses penarikan data')
  } finally {
    fetching.value = false
  }
}

const viewGroupDetail = (group) => {
  router.push(`/sales-quotation/group/${group.id}`)
}

const closeDetailModal = () => {
  selectedGroup.value = null
  searchDetail.value = ''
}

const filteredDetails = computed(() => {
  if (!selectedGroup.value?.details) return []
  if (!searchDetail.value) return selectedGroup.value.details
  
  const query = searchDetail.value.toLowerCase()
  return selectedGroup.value.details.filter(detail => 
    (detail.number && detail.number.toLowerCase().includes(query)) ||
    (detail.name && detail.name.toLowerCase().includes(query))
  )
})

const deleteDetail = async (detail) => {
  if (!confirm(`Hapus quotation ${detail.number || 'ini'}?`)) return
  
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/details/${detail.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Quotation berhasil dihapus')
      if (selectedGroup.value) {
        await viewGroupDetail(selectedGroup.value)
      }
      loadGroups()
    }
  } catch (error) {
    console.error('Failed to delete detail:', error)
    alert('Gagal menghapus quotation')
  }
}

const deleteGroup = async (group) => {
  if (!confirm(`Hapus group #${group.id} beserta semua transaksinya?`)) return
  
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/groups/${group.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Group berhasil dihapus')
      loadGroups()
    }
  } catch (error) {
    console.error('Failed to delete group:', error)
    alert('Gagal menghapus group')
  }
}

const viewQuotationDetail = (detail) => {
  alert(`Detail Quotation:\nNumber: ${detail.number}\nDate: ${detail.transDate}\nName: ${detail.name}\nID: ${detail.id}`)
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadGroups()
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

.sales-quotation-page {
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
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.groups-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-refresh:hover {
  background: #e9ecef;
  color: #8B5CF6;
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.group-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.group-card:hover {
  border-color: #8B5CF6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-id {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-progress {
  background: #dbeafe;
  color: #2563eb;
}

.status-completed {
  background: #dcfce7;
  color: #16a34a;
}

.status-failed {
  background: #fee;
  color: #dc3545;
}

.card-delete {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  color: #dc3545;
}

.card-delete:hover {
  background: #fee;
  color: #dc3545;
}

.card-body {
  margin-bottom: 12px;
}

.card-body .label {
  font-size: 11px;
  color: #6c757d;
  display: inline-block;
  width: 70px;
}

.date-range, .total-data, .created-at {
  font-size: 13px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.total-count {
  font-weight: 600;
  color: #8B5CF6;
}

.error-message {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #fee;
  color: #dc3545;
  font-size: 12px;
}

.card-footer {
  text-align: right;
}

.view-detail {
  font-size: 12px;
  color: #8B5CF6;
  font-weight: 500;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.pagination button {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
}

.loading-state.small {
  padding: 20px;
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

.spinner.small {
  width: 20px;
  height: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

.modal-overlay.modal-large {
  align-items: flex-start;
  padding: 40px;
  overflow-y: auto;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal.modal-large {
  max-width: 900px;
  width: 90%;
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

.modal-body {
  padding: 24px;
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
}

.btn-secondary:hover {
  background: #e9ecef;
}

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

.form-group .required {
  color: #dc3545;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  font-size: 14px;
}

.info-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f3e8ff;
  border-radius: 10px;
  font-size: 12px;
  color: #6B21A5;
  margin-top: 16px;
}

.detail-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-item .label {
  font-size: 10px;
  font-weight: 500;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transactions-table-wrapper {
  margin-top: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
}

.table-container {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  border-bottom: 1px solid #e9ecef;
}

.transactions-table td {
  padding: 12px;
  font-size: 13px;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  color: #adb5bd;
}

.action-btn.view:hover {
  background: #e9d5ff;
  color: #8B5CF6;
}

.action-btn.delete:hover {
  background: #fee;
  color: #dc3545;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  .modal.modal-large {
    width: 95%;
  }
  
  .user-details {
    display: none;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>