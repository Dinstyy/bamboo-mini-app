<template>
  <AppLayout>
    <div class="page-header">
      <div>
        <h1>Master Customer</h1>
        <p>Pull master customer data by date range</p>
      </div>
      <button class="btn-primary" @click="openFetchConfirm">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3V15M3 9H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Pull Data
      </button>
    </div>

    <div class="groups-section">
    <div class="section-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <h2>Pull History</h2>
      </div>
      <button class="btn-refresh" @click="handleRefresh" :disabled="loadingGroups">
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
            <div class="created-at">
              <span class="label">Created:</span>
              <span>{{ formatDateTime(group.createdAt) }}</span>
            </div>
            <div class="total-data">
              <span class="label">Total Data:</span>
              <span class="total-count">{{ group.total_data }} customers</span>
            </div>
            <div class="total-page">
              <span class="label">Total Page:</span>
              <span v-if="group.status === 'IN_PROGRESS'">
                {{ group.current_page || 0 }} pages
              </span>
              <span v-else>
                {{ group.total_pages }} pages
              </span>
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

    <div v-if="showConfirmDialog" class="modal-overlay" @click="closeConfirmDialog">
      <div class="confirm-modal" @click.stop>
        <div class="confirm-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="#8B5CF6" stroke-width="1.5"/>
            <path d="M24 16V24M24 32H24.01" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <h3>Confirm Pull Data</h3>
        <p class="info-text">This will fetch the latest customer data from the source.</p>
        <div class="confirm-buttons">
          <button class="btn-confirm-cancel" @click="closeConfirmDialog">Cancel</button>
          <button class="btn-confirm-yes" @click="confirmFetchData" :disabled="fetching">
            {{ fetching ? 'Processing...' : 'Yes, Pull Data' }}
          </button>
        </div>
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
              <h4>Customer Data</h4>
              <div class="search-box">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <input type="text" v-model="searchDetail" placeholder="Search customers...">
              </div>
            </div>
            
            <div v-if="loadingDetail" class="loading-state small">
              <div class="spinner small"></div>
              <p>Loading customers...</p>
            </div>
            
            <div v-else-if="filteredDetails.length === 0" class="empty-state small">
              <p>No customers found</p>
            </div>
            
            <div v-else class="table-container">
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th>Customer No</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in filteredDetails" :key="detail.id">
                    <td>{{ detail.customerNo || '-' }}</td>
                    <td class="item-name">{{ detail.customerName || '-' }}</td>
                    <td>{{ detail.phone || '-' }}</td>
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
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref(null)

const groups = ref([])
const loadingGroups = ref(false)
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const showConfirmDialog = ref(false)
const fetching = ref(false)
let refreshInterval = null  
let activeRefresh = false   

const selectedGroup = ref(null)
const loadingDetail = ref(false)
const searchDetail = ref('')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
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
  if (activeRefresh) return
  
  activeRefresh = true
  loadingGroups.value = true
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/master-customer/groups`, {
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
    
    const hasInProgress = groups.value.some(group => group.status === 'IN_PROGRESS')
    
    if (hasInProgress) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }
    
  } catch (error) {
    console.error('Failed to load groups:', error)
    if (error.response?.status === 401) {
      logout()
    }
  } finally {
    loadingGroups.value = false
    activeRefresh = false
  }
}

const startAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  refreshInterval = setInterval(() => {
    loadGroups()
  }, 3000) 
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

const changePage = (newPage) => {
  pagination.value.page = newPage
  loadGroups()
}

const openFetchConfirm = () => {
  showConfirmDialog.value = true
}

const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  fetching.value = false
}

const confirmFetchData = async () => {
  fetching.value = true
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/master-customer/fetch`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Proses penarikan data dimulai! Angka akan berubah secara real-time.')
      closeConfirmDialog()
      
      await loadGroups()
      
      startAutoRefresh()
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    alert(error.response?.data?.error || 'Gagal memulai proses penarikan data')
    closeConfirmDialog()
  } finally {
    fetching.value = false
  }
}

const viewGroupDetail = (group) => {
  router.push(`/master-customer/group/${group.id}`)
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
    (detail.customerNo && detail.customerNo.toLowerCase().includes(query)) ||
    (detail.customerName && detail.customerName.toLowerCase().includes(query)) ||
    (detail.phone && detail.phone.toLowerCase().includes(query))
  )
})

const deleteDetail = async (detail) => {
  if (!confirm(`Hapus customer ${detail.customerName || 'ini'}?`)) return
  
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/master-customer/details/${detail.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Customer berhasil dihapus')
      if (selectedGroup.value) {
        await viewGroupDetail(selectedGroup.value)
      }
      loadGroups()
    }
  } catch (error) {
    console.error('Failed to delete detail:', error)
    alert('Gagal menghapus customer')
  }
}

const deleteGroup = async (group) => {
  if (!confirm(`Hapus group #${group.id} beserta semua datanya?`)) return
  
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/master-customer/groups/${group.id}`,
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

const handleRefresh = () => {
  loadGroups()
  const hasInProgress = groups.value.some(group => group.status === 'IN_PROGRESS')
  if (hasInProgress) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadGroups()
  
  const hasInProgress = groups.value.some(group => group.status === 'IN_PROGRESS')
  if (hasInProgress) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', sans-serif;
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
  transition: all 0.2s ease;
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
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: #e9ecef;
  color: #8B5CF6;
}

.auto-refresh-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e0e7ff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  color: #4f46e5;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #4f46e5;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
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

.total-page {
  font-size: 13px;
  color: #1a1a1a;
  margin-bottom: 8px;
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
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #6c757d;
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

.confirm-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  padding: 28px 24px;
  text-align: center;
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.confirm-icon {
  margin-bottom: 20px;
}

.confirm-modal h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.confirm-modal p {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.confirm-modal .info-text {
  font-size: 12px;
  color: #8B5CF6;
  background: #f3e8ff;
  padding: 8px 12px;
  border-radius: 8px;
  margin: 12px 0 0 0;
}

.confirm-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-confirm-cancel {
  flex: 1;
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-confirm-cancel:hover {
  background: #e9ecef;
}

.btn-confirm-yes {
  flex: 1;
  padding: 10px 16px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-confirm-yes:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-confirm-yes:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-secondary:hover {
  background: #e9ecef;
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
  width: 200px;
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

.action-btn.delete:hover {
  background: #fee;
  color: #dc3545;
}

@media (max-width: 768px) {
  .groups-grid {
    grid-template-columns: 1fr;
  }
  
  .modal.modal-large {
    width: 95%;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .search-box input {
    width: 100%;
  }
}
</style>