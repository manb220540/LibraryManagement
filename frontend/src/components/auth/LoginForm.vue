<template>
  <div class="login-container">
    <LoadingSpinner :show="loading" />

    <div class="login-card">
      <div class="card-header">
        <h2 class="card-title">Đăng nhập</h2>
        <div class="user-type-toggle">
          <button 
            class="toggle-btn" 
            :class="{ active: userType === 'reader' }" 
            @click="userType = 'reader'"
          >
            <i class="bi bi-person"></i>
            Độc giả
          </button>
          <button 
            class="toggle-btn" 
            :class="{ active: userType === 'staff' }" 
            @click="userType = 'staff'"
          >
            <i class="bi bi-briefcase"></i>
            Nhân viên
          </button>
        </div>
      </div>

      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
          <div v-if="loginAttempts >= 5" class="mt-2">
            <router-link to="/forgot-password" class="alert-link">
              <i class="bi bi-key"></i> Quên mật khẩu? Nhấn vào đây để đổi mật khẩu.
            </router-link>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-group" v-if="userType === 'staff'">
            <label class="form-label">
              <i class="bi bi-person-badge me-2"></i>Tên nhân viên <span class="required">*</span>
            </label>
            <input 
              type="text" 
              class="form-input"
              :class="{ 'is-invalid': errors.hoTenNV }"
              v-model="credentials.hoTenNV" 
              placeholder="Nhập tên nhân viên"
              required
              @input="validateField('hoTenNV')"
            >
            <div class="error-message" v-if="errors.hoTenNV">
              <i class="bi bi-exclamation-circle"></i> {{ errors.hoTenNV }}
            </div>
          </div>

          <div class="form-group" v-if="userType === 'reader'">
            <label class="form-label">
              <i class="bi bi-envelope me-2"></i>Email <span class="required">*</span>
            </label>
            <input 
              type="email" 
              class="form-input"
              :class="{ 'is-invalid': errors.email }"
              v-model="credentials.email" 
              placeholder="example@gmail.com"
              required
              @input="validateField('email')"
            >
            <div class="error-message" v-if="errors.email">
              <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock me-2"></i>Mật khẩu <span class="required">*</span>
            </label>
            <div class="password-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-input"
                :class="{ 'is-invalid': errors.password }"
                v-model="credentials.password" 
                placeholder="Nhập mật khẩu"
                required
                @input="validateField('password')"
              >
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div class="error-message" v-if="errors.password">
              <i class="bi bi-exclamation-circle"></i> {{ errors.password }}
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">
              <i class="bi bi-hourglass-split me-2"></i>Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
            </span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <p class="footer-text">
          Chưa có tài khoản? 
          <router-link to="/register" class="footer-link">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError } from '@/utils/notifications';

export default {
  name: 'LoginForm',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userType = ref('reader');
    const credentials = ref({
      hoTenNV: '',
      email: '',
      password: ''
    });
    const errors = ref({});
    const loginAttempts = ref(0);
    const showPassword = ref(false);

    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);

    const validateField = (field) => {
      const newErrors = { ...errors.value };

      if (field === 'hoTenNV' && userType.value === 'staff') {
        if (!credentials.value.hoTenNV) {
          newErrors.hoTenNV = 'Tên nhân viên là bắt buộc';
        } else {
          delete newErrors.hoTenNV;
        }
      }

      if (field === 'email' && userType.value === 'reader') {
        if (!credentials.value.email) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email;
        }
      }

      if (field === 'password') {
        if (!credentials.value.password) {
          newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (credentials.value.password.length < 5) {
          newErrors.password = 'Mật khẩu phải có ít nhất 5 ký tự';
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(credentials.value.password)) {
          newErrors.password = 'Mật khẩu phải chứa cả chữ và số';
        } else {
          delete newErrors.password;
        }
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      if (userType.value === 'staff' && !credentials.value.hoTenNV) {
        newErrors.hoTenNV = 'Tên nhân viên là bắt buộc';
      }
      if (userType.value === 'reader' && !credentials.value.email) {
        newErrors.email = 'Email là bắt buộc';
      } else if (userType.value === 'reader' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.value.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
      if (!credentials.value.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (credentials.value.password.length < 5) {
        newErrors.password = 'Mật khẩu phải có ít nhất 5 ký tự';
      } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(credentials.value.password)) {
        newErrors.password = 'Mật khẩu phải chứa cả chữ và số';
      }
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      try {
        loginAttempts.value += 1;
        if (userType.value === 'staff') {
          await store.dispatch('auth/loginStaff', {
            hoTenNV: credentials.value.hoTenNV,
            password: credentials.value.password
          });
          router.push('/admin');
        } else {
          await store.dispatch('auth/loginReader', {
            email: credentials.value.email,
            password: credentials.value.password
          });
          router.push('/reader');
        }
        loginAttempts.value = 0;
        errors.value = {};
      } catch (err) {
        showError(err);
      }
    };

    const clearError = () => {
      store.commit('auth/SET_ERROR', null);
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      userType,
      credentials,
      loading,
      error,
      errors,
      loginAttempts,
      showPassword,
      togglePasswordVisibility,
      handleSubmit,
      clearError,
      validateField
    };
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  padding: 2rem 2rem 1.5rem;
  background: linear-gradient(135deg, rgba(241, 226, 160, 0.3) 0%, rgba(211, 196, 225, 0.3) 100%);
}

.card-title {
  margin: 0 0 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: #5a4a6a;
}

.user-type-toggle {
  display: flex;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 0.5rem;
  border-radius: 12px;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #6b5b7b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.8);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
  color: #5a4a6a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-danger {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #c53030;
  opacity: 0.6;
  padding: 0;
  width: 24px;
  height: 24px;
}

.btn-close:hover {
  opacity: 1;
}

.alert-link {
  color: #c53030;
  text-decoration: underline;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #5a4a6a;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.required {
  color: #e53e3e;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e8e1ef;
  border-radius: 12px;
  font-size: 1rem;
  color: #4a4a4a;
  background: white;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #c4b5d1;
  box-shadow: 0 0 0 4px rgba(211, 196, 225, 0.2);
}

.form-input.is-invalid {
  border-color: #fc8181;
}

.form-input::placeholder {
  color: #a0aec0;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #8b7a9a;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #6b5b7b;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
  color: #5a4a6a;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-footer {
  padding: 1.5rem 2rem;
  background: rgba(241, 226, 160, 0.15);
  text-align: center;
  border-top: 1px solid rgba(211, 196, 225, 0.3);
}

.footer-text {
  margin: 0;
  color: #6b5b7b;
  font-size: 0.95rem;
}

.footer-link {
  color: #8b7a9a;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #6b5b7b;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 16px;
  }
  
  .card-header,
  .card-body,
  .card-footer {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .toggle-btn {
    font-size: 0.875rem;
    padding: 0.625rem 0.75rem;
  }
}
</style>