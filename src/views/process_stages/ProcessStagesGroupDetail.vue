<template>
  <AppLayout>
    <div class="back-button-wrapper">
      <button class="btn-back" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Pull History
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading group details...</p>
    </div>

    <div v-else-if="!selectedGroup" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L4 12L24 20L44 12L24 4Z" stroke="#d1d5db" stroke-width="1.5"/>
        <path d="M4 24L24 32L44 24" stroke="#d1d5db" stroke-width="1.5"/>
        <path d="M4 34L24 42L44 34" stroke="#d1d5db" stroke-width="1.5"/>
      </svg>
      <p>Group not found</p>
    </div>

    <div v-else class="detail-content">
      <div class="detail-header">
        <div class="detail-title">
          <h2>Group Detail #{{ selectedGroup.id }}</h2>
          <span :class="['status-badge', getStatusClass(selectedGroup.status)]">
            {{ selectedGroup.status }}
          </span>
        </div>
      </div>

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
          <h4>Transactions</h4>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input type="text" v-model="searchDetail" placeholder="Search transactions...">
          </div>
        </div>
        
        <div v-if="filteredDetails.length === 0" class="empty-state small">
          <p>No transactions found</p>
        </div>
        
        <div v-else class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Work Order</th>
                <th>Date</th>
                <th>Item No</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Export Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detail in filteredDetails" :key="detail.id">
                <td>{{ detail.number || '-' }}</td>
                <td>{{ detail.workOrderNumber || '-' }}</td>
                <td>{{ formatDate(detail.transDate) }}</td>
                <td>{{ detail.itemNo || '-' }}</td>
                <td class="item-name">{{ detail.itemName || '-' }}</td>
                <td class="item-qty">{{ formatNumber(detail.quantity) }}</td>
                <td class="export-status">
                  <span :class="['export-badge', getExportStatusClass(detail.export_status)]">
                    {{ detail.export_status || 'PENDING' }}
                  </span>
                  <div v-if="detail.export_error_message" class="export-error-tooltip">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#dc3545" stroke-width="1.2"/>
                      <path d="M7 4V7M7 10H7.01" stroke="#dc3545" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                    <span class="tooltip-text">{{ detail.export_error_message }}</span>
                  </div>
                </td>
                <td class="actions">
                  <button 
                    v-if="detail.export_status !== 'SUCCESS'"
                    class="action-btn export" 
                    @click="exportTransaction(detail)"
                    :disabled="exportingId === detail.id"
                    title="Export"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1V11M8 11L11 8M8 11L5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M2 13H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </button>
                  
                  <button class="action-btn delete" @click="deleteTransaction(detail)" title="Delete">
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
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const user = ref(null)
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const selectedGroup = ref(null)
const loading = ref(false)
const searchDetail = ref('')
const exportingId = ref(null)

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

const goBack = () => {
  router.push('/process-stages')
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID')
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID')
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
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

const getExportStatusClass = (status) => {
  const classes = {
    'PENDING': 'status-pending',
    'IN_PROGRESS': 'status-progress',
    'SUCCESS': 'status-success',
    'FAILED': 'status-failed'
  }
  return classes[status] || 'status-pending'
}

const loadGroupDetail = async () => {
  const groupId = route.params.id
  if (!groupId) {
    router.push('/process-stages')
    return
  }
  
  loading.value = true
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/process-stages/groups/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    selectedGroup.value = response.data.data
  } catch (error) {
    console.error('Failed to load group detail:', error)
    alert('Gagal memuat detail group')
    router.push('/process-stages')
  } finally {
    loading.value = false
  }
}

const filteredDetails = computed(() => {
  if (!selectedGroup.value?.details) return []
  if (!searchDetail.value) return selectedGroup.value.details
  
  const query = searchDetail.value.toLowerCase()
  return selectedGroup.value.details.filter(detail => 
    (detail.number && detail.number.toLowerCase().includes(query)) ||
    (detail.workOrderNumber && detail.workOrderNumber.toLowerCase().includes(query)) ||
    (detail.itemName && detail.itemName.toLowerCase().includes(query)) ||
    (detail.itemNo && detail.itemNo.toLowerCase().includes(query))
  )
})

const deleteTransaction = async (detail) => {
  if (!confirm(`Hapus transaksi ${detail.number || 'ini'}?`)) return
  
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/process-stages/details/${detail.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Transaksi berhasil dihapus')
      loadGroupDetail()
    }
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    alert('Gagal menghapus transaksi')
  }
}

const exportTransaction = async (detail) => {
  if (!confirm(`Export transaction ${detail.number || detail.id} to Accurate?`)) return
  
  exportingId.value = detail.id
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/process-stages/export/${detail.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      alert('Export successful! Transaction created in Accurate.')
      loadGroupDetail()
    }
  } catch (error) {
    console.error('Failed to export:', error)
    const errorMsg = error.response?.data?.error || 'Failed to export transaction'
    alert(`Export failed: ${errorMsg}`)
    loadGroupDetail()
  } finally {
    exportingId.value = null
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadGroupDetail()
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

.back-button-wrapper {
  margin-bottom: 24px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-back:hover {
  background: #f8f9fa;
  color: #8B5CF6;
  border-color: #8B5CF6;
}

.detail-header {
  margin-bottom: 15px;
}

.detail-title {
  display: flex;
  margin-left: 15px;
  align-items: center;
  gap: 12px;
}

.detail-title h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
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

.detail-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-item .label {
  font-size: 10px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-item span:last-child {
  font-size: 15px;
  font-weight: 600;
  color: #8B5CF6;
}

.transactions-table-wrapper {
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  font-family: 'Plus Jakarta Sans', sans-serif;
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

.item-qty {
  text-align: center;
}

.export-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.status-success {
  background: #dcfce7;
  color: #16a34a;
}

.export-status {
  position: relative;
}

.export-error-tooltip {
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  cursor: help;
  position: relative;
}

.export-error-tooltip .tooltip-text {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 12px;
  font-weight: normal;
}

.export-error-tooltip:hover .tooltip-text {
  visibility: visible;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  color: #adb5bd;
}

.action-btn.export {
  color: #8B5CF6;
}

.action-btn.export:hover {
  background: #f3e8ff;
  color: #6B21A5;
}

.action-btn.delete {
  color: #dc3545;
}

.action-btn.delete:hover {
  background: #fee;
  color: #dc3545;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
}

.empty-state.small {
  padding: 40px;
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

@media (max-width: 768px) {
  .detail-summary {
    grid-template-columns: 1fr;
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