<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>Create account</h1>
          <p>Get started with your free account</p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Username</label>
            <input 
              type="text" 
              v-model="form.username" 
              class="form-control"
              placeholder="Choose a username"
              required 
            />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              v-model="form.email" 
              class="form-control"
              placeholder="your@email.com"
              required 
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="password-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="form.password" 
                class="form-control"
                placeholder="Create a password"
                required 
              />
              <button type="button" @click="showPassword = !showPassword" class="toggle-password">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3C5 3 3 8 3 8C3 8 5 13 9 13C13 13 15 8 15 8C15 8 13 3 9 3Z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="9" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2L16 16M9 13C5 13 3 8 3 8C3 8 4.5 5 7 4M12.5 6.5C13.5 7.5 15 8 15 8C15 8 13 13 9 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="9" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Company Option</label>
            <select v-model="form.companyOption" class="form-control" @change="onCompanyOptionChange">
              <option value="new">Create New Company</option>
              <option value="existing">Use Existing Company</option>
            </select>
          </div>

          <!-- New Company Form -->
          <div v-if="form.companyOption === 'new'" class="company-section">
            <div class="section-title">
              <span>Company Details</span>
            </div>
            <div class="form-group">
              <label>Company Name <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.companyName" 
                class="form-control"
                placeholder="Enter company name"
                required 
              />
            </div>
            <div class="form-group">
              <label>Address<span class="required">*</span></label>
              <textarea 
                v-model="form.companyAddress" 
                class="form-control"
                rows="3"
                placeholder="Enter company address"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Phone<span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.companyPhone" 
                class="form-control"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <!-- Existing Company Selection -->
          <div v-if="form.companyOption === 'existing'" class="company-section">
            <div class="section-title">
              <span>Select Company</span>
            </div>
            <div class="form-group">
              <label>Choose Company</label>
              <select v-model="form.existingCompanyId" class="form-control" required>
                <option value="">Select a company</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.company_name }}
                </option>
              </select>
            </div>
            <div v-if="selectedCompany" class="company-preview">
              <p><strong>Address:</strong> {{ selectedCompany.address || '-' }}</p>
              <p><strong>Phone:</strong> {{ selectedCompany.phone || '-' }}</p>
              <p><strong>Email:</strong> {{ selectedCompany.email || '-' }}</p>
            </div>
          </div>

          <button type="submit" class="btn-register" :disabled="loading">
            <span v-if="!loading">Create account</span>
            <div v-else class="spinner"></div>
          </button>
        </form>

        <div class="register-footer">
          Already have an account? <router-link to="/login">Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const companies = ref([])

const form = ref({
  username: '',
  email: '',
  password: '',
  companyOption: 'new',
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  existingCompanyId: ''
})

const selectedCompany = computed(() => {
  if (!form.value.existingCompanyId) return null
  return companies.value.find(c => c.id === parseInt(form.value.existingCompanyId))
})

const onCompanyOptionChange = () => {
  form.value.existingCompanyId = ''
  form.value.companyName = ''
  form.value.companyAddress = ''
  form.value.companyPhone = ''
}

const loadCompanies = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/public/companies`)
        companies.value = response.data
    } catch (error) {
        console.error('Failed to load companies:', error)
    }
}

const handleRegister = async () => {
  loading.value = true
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, form.value)
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Registration failed:', error)
    alert(error.response?.data?.error || 'Registration failed')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 520px;
}

.register-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  padding: 40px;
  transition: all 0.2s ease;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.register-header p {
  font-size: 14px;
  color: #6c757d;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.form-group label .required {
  color: #dc3545;
}

.form-control {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s ease;
  background: white;
  color: #1a1a1a;
}

.form-control:focus {
  outline: none;
  border-color: #8B5CF6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

textarea.form-control {
  resize: vertical;
}

.password-wrapper {
  position: relative;
}

.password-wrapper .form-control {
  padding-right: 45px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #adb5bd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.toggle-password:hover {
  color: #8B5CF6;
}

.company-section {
  margin-top: 8px;
}

.section-title {
  text-align: center;
  margin: 20px 0 16px;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
}

.section-title span {
  background: white;
  padding: 0 12px;
  font-size: 12px;
  color: #6c757d;
  position: relative;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.company-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  border: 1px solid #e9ecef;
}

.company-preview p {
  font-size: 13px;
  color: #1a1a1a;
  margin: 6px 0;
}

.company-preview strong {
  color: #6c757d;
  font-weight: 600;
}

.btn-register {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #8B5CF6 0%, #6B21A5 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
}

.btn-register:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6c757d;
}

.register-footer a {
  color: #8B5CF6;
  text-decoration: none;
  font-weight: 600;
}

.register-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
  }
  
  .register-header h1 {
    font-size: 24px;
  }
}
</style>