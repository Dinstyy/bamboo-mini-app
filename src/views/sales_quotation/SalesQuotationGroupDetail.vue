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
          <div class="title-group">
            <h2>Group Detail #{{ selectedGroup.id }}</h2>
            <span :class="['status-badge', getStatusClass(selectedGroup.status)]">
              {{ selectedGroup.status }}
            </span>
          </div>
          <button class="btn-export-group" @click="exportGroupData" :disabled="exportingGroup">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V11M8 11L11 8M8 11L5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M2 13H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ exportingGroup ? 'Exporting...' : 'Export' }}
          </button>
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
          <h4>Sales Quotations</h4>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input type="text" v-model="searchDetail" placeholder="Search quotations...">
          </div>
        </div>
        
        <div v-if="filteredDetails.length === 0" class="empty-state small">
          <p>No quotations found</p>
        </div>
        
        <div v-else class="table-container">
          <table class="transactions-table">
            <thead>
              <tr>
                <th style="width: 40px;">
                  <div class="custom-checkbox" @click="toggleSelectAll">
                    <svg v-if="isAllSelected" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="15" rx="3" fill="#8B5CF6" stroke="#8B5CF6"/>
                      <path d="M4 8L7 11L12 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="15" rx="3" fill="white" stroke="#d1d5db"/>
                    </svg>
                  </div>
                </th>
                <th>Number</th>
                <th>Date</th>
                <th>Name</th>
                <th>Export Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="detail in filteredDetails" 
                :key="detail.id"
                :class="{ 'selected-row': selectedItems.includes(detail.id) }"
              >
                <td>
                  <div class="custom-checkbox" @click="toggleItemSelection(detail.id)">
                    <svg v-if="selectedItems.includes(detail.id)" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="15" rx="3" fill="#8B5CF6" stroke="#8B5CF6"/>
                      <path d="M4 8L7 11L12 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="0.5" y="0.5" width="15" height="15" rx="3" fill="white" stroke="#d1d5db"/>
                    </svg>
                  </div>
                </td>
                <td>{{ detail.number || '-' }}</td>
                <td>{{ formatDate(detail.transDate) }}</td>
                <td class="item-name">{{ detail.name || '-' }}</td>
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
                  <button class="action-btn view" @click="viewQuotationDetail(detail)" title="View Detail">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3C4 3 2 8 2 8C2 8 4 13 8 13C12 13 14 8 14 8C14 8 12 3 8 3Z" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </button>
                  <button class="action-btn delete" @click="deleteDetail(detail)" title="Delete">
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
const exportingGroup = ref(false)

const selectedGroup = ref(null)
const loading = ref(false)
const searchDetail = ref('')
const selectedItems = ref([])

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
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

const isAllSelected = computed(() => {
  if (!selectedGroup.value?.details || selectedGroup.value.details.length === 0) return false
  const currentDetails = filteredDetails.value
  return currentDetails.length > 0 && currentDetails.every(item => selectedItems.value.includes(item.id))
})

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    const currentIds = filteredDetails.value.map(item => item.id)
    selectedItems.value = currentIds
  }
}

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index === -1) {
    selectedItems.value.push(itemId)
  } else {
    selectedItems.value.splice(index, 1)
  }
}

const exportGroupData = async () => {
  if (selectedItems.value.length === 0) {
    alert('Pilih minimal satu quotation untuk diexport')
    return
  }

  exportingGroup.value = true
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/bulk-export`,
      {
        ids: selectedItems.value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    await loadGroupDetail()
    
    selectedItems.value = []
    
  } catch (error) {
    console.error('Failed to bulk export:', error)
    alert(error.response?.data?.error || 'Gagal melakukan export')
  } finally {
    exportingGroup.value = false
  }
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
  router.push('/sales-quotation')
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

const loadGroupDetail = async () => {
  const groupId = route.params.id
  if (!groupId) {
    router.push('/sales-quotation')
    return
  }
  
  loading.value = true
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/groups/${groupId}`,
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
    router.push('/sales-quotation')
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
      loadGroupDetail()
    }
  } catch (error) {
    console.error('Failed to delete detail:', error)
    alert('Gagal menghapus quotation')
  }
}

const viewQuotationDetail = (detail) => {
  console.log('Clicked view for detail:', detail)
  console.log('accurate_id:', detail.accurate_id)
  console.log('route.params.id:', route.params.id)
  
  router.push({
    path: '/sales-quotation/detail',
    query: { 
      id: detail.accurate_id,
      groupId: route.params.id
    }
  })
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

.custom-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.custom-checkbox svg {
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.custom-checkbox:hover svg rect {
  stroke: #8B5CF6;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #8B5CF6;
  border-radius: 1px;
}

.selected-row {
  background: rgba(139, 92, 246, 0.08) !important;
  transition: background 0.2s ease;
}

.selected-row:hover {
  background: rgba(139, 92, 246, 0.12) !important;
}

.transactions-table th,
.transactions-table td {
  padding: 12px;
  font-size: 13px;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.transactions-table th:first-child,
.transactions-table td:first-child {
  text-align: center;
  width: 40px;
}

.sales-quotation-detail-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.export-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.status-pending {
  background: #fef3c7;
  color: #d97706;
}

.status-progress {
  background: #dbeafe;
  color: #2563eb;
}

.status-success {
  background: #dcfce7;
  color: #16a34a;
}

.status-failed {
  background: #fee;
  color: #dc3545;
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
  margin-bottom: 24px;
}

.detail-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-group h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.btn-export-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.btn-export-group:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-export-group:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.detail-title h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  margin-left: 17px;
  font-weight: 700;
  color: #1a1a1a;
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

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #C4E2F5;
  color: #3b82f6;
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
  
  .user-details {
    display: none;
  }
}
</style>