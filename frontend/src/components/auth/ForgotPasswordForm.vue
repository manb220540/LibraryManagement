<template>
  <div class="login-container">
    <LoadingSpinner :show="loading" />

    <div class="login-card">
      <div class="card-header">
        <h2 class="card-title">Đặt lại mật khẩu</h2>
        <p class="card-subtitle">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>

        <!-- Space giữ layout giống Login (không ảnh hưởng hệ thống) -->
        <div class="user-type-toggle placeholder-toggle"></div>
      </div>

      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <!-- Success Alert -->
        <div v-if="message" class="alert alert-success" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          {{ message }}
          <button type="button" class="btn-close" @click="clearMessage"></button>
        </div>

        <form @submit.prevent="requestPasswordReset" novalidate>
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-envelope me-2"></i>Email <span class="required">*</span>
            </label>
            <input
              type="email"
              class="form-input"
              :class="{ 'is-invalid': errors.email }"
              v-model="email"
              placeholder="example@gmail.com"
              required
              @input="validateField('email')"
            >
            <div class="error-message" v-if="errors.email">
              <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">
              <i class="bi bi-hourglass-split me-2"></i>Đang gửi...
            </span>
            <span v-else>
              <i class="bi bi-send me-2"></i>Gửi yêu cầu
            </span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <p class="footer-text">
          <router-link to="/login" class="footer-link">← Quay lại đăng nhập</router-link>
        </p>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'ForgotPasswordForm',
  components: { LoadingSpinner },
  setup() {
    const email = ref('');
    const loading = ref(false);
    const errors = ref({});
    const error = ref('');
    const message = ref('');
    const router = useRouter();

    const validateField = (field) => {
      const newErrors = { ...errors.value }; // Sao chép errors hiện tại

      if (field === 'email') {
        if (!email.value.trim()) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email; // Xóa lỗi nếu hợp lệ
        }
      }

      errors.value = newErrors; // Cập nhật errors
    };

    const validateForm = () => {
      const newErrors = {};
      if (!email.value.trim()) {
        newErrors.email = 'Email là bắt buộc';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        newErrors.email = 'Email không hợp lệ';
      }
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const requestPasswordReset = async () => {
      if (!validateForm()) {
        return;
      }

      loading.value = true;
      try {
        await api.post('/auth/reader/password/request-reset', { email: email.value });
        localStorage.setItem('resetEmail', email.value);
        message.value = 'Email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.';
        errors.value = {}; // Xóa lỗi khi gửi thành công
        setTimeout(() => router.push('/auth/reader/password/reset'), 2000);
      } catch (err) {
        error.value = err.response?.data?.error || 'Có lỗi xảy ra khi gửi yêu cầu';
        if (err.response?.data?.errors) {
          errors.value = err.response.data.errors;
        }
        console.error('Lỗi yêu cầu đặt lại mật khẩu:', err.response?.data || err.message);
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => { error.value = ''; };
    const clearMessage = () => { message.value = ''; };

    return {
      email,
      loading,
      errors,
      error,
      message,
      requestPasswordReset,
      clearError,
      clearMessage,
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
  text-align: center;
}

.card-title {
  margin: 0 0 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #5a4a6a;
}

.card-subtitle {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  color: #8b7a9a;
  font-weight: 500;
}

/* Placeholder toggle để giữ layout giống Login (không hiển thị) */
.placeholder-toggle {
  height: 0;
  margin-top: 1rem;
  visibility: hidden;
}

.card-body {
  padding: 2rem;
}

/* ALERT (copy từ login) */
.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.alert-danger {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.6;
}
.btn-close:hover { opacity: 1; }

/* FORM */
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

.required { color: #e53e3e; margin-left: 0.25rem; }

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

.error-message {
  margin-top: 0.5rem;
  color: #e53e3e;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* BUTTON */
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
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* FOOTER */
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
  text-decoration: none;
  font-weight: 600;
}

.footer-link:hover {
  color: #6b5b7b;
  text-decoration: underline;
}
</style>