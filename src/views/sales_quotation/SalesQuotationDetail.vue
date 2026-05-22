<template>
  <AppLayout>
    <div class="back-button-wrapper">
      <div class="quotation-title">
        <span>#{{ quotation?.number || 'Sales Quotation' }}</span>
      </div>
      <button class="btn-back" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Quotations
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading quotation details...</p>
    </div>

    <div v-else-if="error" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#dc3545" stroke-width="1.5"/>
        <path d="M24 14V24M24 30H24.01" stroke="#dc3545" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!quotation" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4L4 12L24 20L44 12L24 4Z" stroke="#d1d5db" stroke-width="1.5"/>
        <path d="M4 24L24 32L44 24" stroke="#d1d5db" stroke-width="1.5"/>
        <path d="M4 34L24 42L44 34" stroke="#d1d5db" stroke-width="1.5"/>
      </svg>
      <p>Quotation not found</p>
    </div>

    <div v-else class="detail-content">
      <div class="info-summary">
        <div class="info-item">
          <span class="label">Customer:</span>
          <span>{{ quotation.customerName }} ({{ quotation.customerNo }})</span>
        </div>
        <div class="info-item">
          <span class="label">Date:</span>
          <span>{{ formatDate(quotation.transDate) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Total Amount:</span>
          <span class="amount">Rp {{ formatNumber(quotation.totalAmount) }}</span>
        </div>
      </div>

      <div class="tab-navigation">
        <button 
          :class="['tab-btn', { active: activeTab === 'items' }]" 
          @click="switchTab('items')"
        >
          Items ({{ quotation.items?.length || 0 }})
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'expenses' }]" 
          @click="switchTab('expenses')"
        >
          Expenses ({{ quotation.expenses?.length || 0 }})
        </button>
      </div>

      <div v-if="activeTab === 'items'" class="table-wrapper">
        <div class="table-header">
          <h4>Item Details</h4>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="itemSearchQuery" 
              placeholder="Search items..." 
            />
          </div>
        </div>
        
        <div v-if="filteredItems.length === 0" class="empty-state small">
          <p>No items found</p>
        </div>
        
        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Item No</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredItems" :key="index">
                <td class="item-name">{{ item.itemName }}</td>
                <td>{{ item.itemNo }}</td>
                <td>{{ formatNumber(item.quantity) }}</td>
                <td>Rp {{ formatNumber(item.unitPrice) }}</td>
                <td>{{ item.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'expenses'" class="table-wrapper">
        <div class="table-header">
          <h4>Expense Details</h4>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6.5 11C9.53757 11 12 8.53757 12 5.5C12 2.46243 9.53757 0 6.5 0C3.46243 0 1 2.46243 1 5.5C1 8.53757 3.46243 11 6.5 11Z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input 
              type="text" 
              v-model="expenseSearchQuery" 
              placeholder="Search expenses..." 
            />
          </div>
        </div>
        
        <div v-if="filteredExpenses.length === 0" class="empty-state small">
          <p>No expenses found</p>
        </div>
        
        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Account No</th>
                <th>Account Name</th>
                <th class="text-right">Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(expense, index) in filteredExpenses" :key="index">
                <td>{{ expense.accountNo }}</td>
                <td>{{ expense.accountName }}</td>
                <td>Rp {{ formatNumber(expense.amount) }}</td>
                <td>{{ expense.description }}</td>
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

const quotation = ref(null)
const loading = ref(false)
const error = ref(null)
const activeTab = ref('items')
const itemSearchQuery = ref('')
const expenseSearchQuery = ref('')

const filteredItems = computed(() => {
  if (!quotation.value?.items) return []
  if (!itemSearchQuery.value) return quotation.value.items
  
  const query = itemSearchQuery.value.toLowerCase()
  return quotation.value.items.filter(item => 
    item.itemName?.toLowerCase().includes(query) ||
    item.itemNo?.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query)
  )
})

const filteredExpenses = computed(() => {
  if (!quotation.value?.expenses) return []
  if (!expenseSearchQuery.value) return quotation.value.expenses
  
  const query = expenseSearchQuery.value.toLowerCase()
  return quotation.value.expenses.filter(expense => 
    expense.accountNo?.toLowerCase().includes(query) ||
    expense.accountName?.toLowerCase().includes(query) ||
    expense.description?.toLowerCase().includes(query)
  )
})

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
  router.push('/sales-quotation/group/' + route.query.groupId || '/sales-quotation')
}

const formatDate = (date) => {
  if (!date) return '-'
  const parts = date.split('/')
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).toLocaleDateString('id-ID')
  }
  return new Date(date).toLocaleDateString('id-ID')
}

const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

const switchTab = (tab) => {
  activeTab.value = tab
  itemSearchQuery.value = ''
  expenseSearchQuery.value = ''
}

const loadQuotationDetail = async () => {
  const id = route.query.id
  if (!id) {
    error.value = 'No quotation ID provided'
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/sales-quotation/detail`,
      {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    
    if (response.data.success) {
      quotation.value = response.data.data
    } else {
      error.value = response.data.error || 'Failed to load quotation detail'
    }
  } catch (err) {
    console.error('Failed to load quotation detail:', err)
    error.value = err.response?.data?.error || 'Failed to load quotation detail'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadQuotationDetail()
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.quotation-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 5px;
}

.quotation-title span {
  color: #1a1a1a;
}

.tab-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.tab-btn:hover {
  color: #8B5CF6;
}

.tab-btn.active {
  color: #8B5CF6;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #8B5CF6;
}

.info-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
  padding: 16px 5px;
  background: #f8f9fa;
  border-radius: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span:last-child {
  font-size: 15px;
  font-weight: 600;
  color: #8B5CF6;
}

.info-item .amount {
  color: #8B5CF6;
}

.table-wrapper {
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
  flex-wrap: wrap;
  gap: 12px;
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
  min-width: 200px;
}

.search-box svg {
  color: #adb5bd;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  outline: none;
  font-size: 13px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: transparent;
  width: 100%;
}

.search-box input::placeholder {
  color: #adb5bd;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  border-bottom: 1px solid #e9ecef;
}

.data-table td {
  padding: 12px;
  font-size: 13px;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.item-name {
  font-weight: 500;
}

.text-right {
  text-align: right;
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
  .info-summary {
    grid-template-columns: 1fr;
  }
  
  .back-button-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>