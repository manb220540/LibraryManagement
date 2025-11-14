<template>
  <div class="login-container">
    <LoadingSpinner :show="loading" />

    <div class="login-card">
      <div class="card-header">
        <h2 class="card-title">Xác nhận đổi mật khẩu</h2>
      </div>

      <div class="card-body">

        <!-- Error -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <!-- Success -->
        <div v-if="message" class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle me-2"></i>
          {{ message }}
          <button type="button" class="btn-close" @click="clearMessage"></button>
        </div>

        <form @submit.prevent="confirmPasswordReset" novalidate>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-envelope me-2"></i>Email <span class="required">*</span>
            </label>
            <input
              type="email"
              class="form-input"
              v-model="email"
              disabled
            >
          </div>

          <!-- OTP -->
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-shield-lock me-2"></i>Mã xác nhận (OTP)
              <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-input"
              :class="{ 'is-invalid': errors.otp }"
              v-model="otp"
              @input="validateField('otp')"
            >
            <div class="error-message" v-if="errors.otp">
              <i class="bi bi-exclamation-circle"></i> {{ errors.otp }}
            </div>
          </div>

          <!-- New Password -->
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock me-2"></i>Mật khẩu mới <span class="required">*</span>
            </label>

            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'is-invalid': errors.newPassword }"
                v-model="newPassword"
                @input="validateField('newPassword')"
              >
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>

            <div class="error-message" v-if="errors.newPassword">
              <i class="bi bi-exclamation-circle"></i> {{ errors.newPassword }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock-fill me-2"></i>Xác nhận mật khẩu mới <span class="required">*</span>
            </label>

            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="confirmPassword"
                @input="validateField('confirmPassword')"
              >
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>

            <div class="error-message" v-if="errors.confirmPassword">
              <i class="bi bi-exclamation-circle"></i> {{ errors.confirmPassword }}
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">
              <i class="bi bi-hourglass-split me-2"></i>Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-check2-circle me-2"></i>Xác nhận
            </span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <router-link to="/login" class="footer-link">
          <i class="bi bi-arrow-left"></i> Quay lại đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import api from '@/services/api';

export default {
  name: 'ConfirmPasswordForm',
  components: { LoadingSpinner },
  setup() {
    const email = ref('');
    const otp = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const errors = ref({});
    const error = ref('');
    const message = ref('');
    const router = useRouter();
    const store = useStore();
    const showPassword = ref(false);

    onMounted(() => {
      const savedEmail = localStorage.getItem('resetEmail');
      if (savedEmail) email.value = savedEmail;
      else error.value = 'Không tìm thấy email. Vui lòng thử lại.';
    });

    /* ---------- KEEP LOGIC FROM OLD VERSION ---------- */
    const validateField = (field) => {
      const newErrors = { ...errors.value };

      if (field === 'otp') {
        if (!otp.value.trim()) newErrors.otp = 'Mã xác nhận là bắt buộc';
        else delete newErrors.otp;
      }

      if (field === 'newPassword') {
        if (!newPassword.value.trim()) newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
        else if (newPassword.value.length < 5) newErrors.newPassword = 'Mật khẩu phải có ít nhất 5 ký tự';
        else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(newPassword.value))
          newErrors.newPassword = 'Mật khẩu phải chứa cả chữ và số';
        else delete newErrors.newPassword;

        if (confirmPassword.value && confirmPassword.value !== newPassword.value)
          newErrors.confirmPassword = 'Mật khẩu mới và xác nhận phải giống nhau';
        else if (confirmPassword.value) delete newErrors.confirmPassword;
      }

      if (field === 'confirmPassword') {
        if (!confirmPassword.value) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        else if (confirmPassword.value !== newPassword.value)
          newErrors.confirmPassword = 'Mật khẩu mới và xác nhận phải giống nhau';
        else delete newErrors.confirmPassword;
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      if (!otp.value.trim()) newErrors.otp = 'Mã xác nhận là bắt buộc';

      if (!newPassword.value.trim()) newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
      else if (newPassword.value.length < 5) newErrors.newPassword = 'Mật khẩu phải có ít nhất 5 ký tự';
      else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(newPassword.value))
        newErrors.newPassword = 'Mật khẩu phải chứa cả chữ và số';

      if (!confirmPassword.value) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      else if (confirmPassword.value !== newPassword.value)
        newErrors.confirmPassword = 'Mật khẩu mới và xác nhận phải giống nhau';

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const confirmPasswordReset = async () => {
      if (!validateForm()) return;

      loading.value = true;
      try {
        await api.post('/auth/reader/password/reset', {
          email: email.value,
          otp: otp.value,
          newPassword: newPassword.value,
        });

        message.value = 'Đổi mật khẩu thành công. Đang chuyển đến trang đăng nhập...';
        localStorage.removeItem('resetEmail');

        if (store.getters['auth/isAuthenticated']) {
          await store.dispatch('auth/logout');
        }

        setTimeout(() => router.push('/login'), 2000);
      } catch (err) {
        error.value = err.response?.data?.error || 'Có lỗi xảy ra';
      } finally {
        loading.value = false;
      }
    };

    /* ---------- KEEP OLD LOGIC ---------- */
    const clearError = () => (error.value = '');
    const clearMessage = () => (message.value = '');
    const togglePasswordVisibility = () => (showPassword.value = !showPassword.value);

    return {
      email,
      otp,
      newPassword,
      confirmPassword,
      loading,
      errors,
      error,
      message,
      validateField,
      validateForm,
      confirmPasswordReset,
      clearError,
      clearMessage,
      showPassword,
      togglePasswordVisibility
    };
  }
};
</script>

<style scoped>
/* Giữ toàn bộ UI bản mới */
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
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  padding: 2rem 2rem 1.5rem;
  background: linear-gradient(135deg, rgba(241, 226, 160, 0.3), rgba(211, 196, 225, 0.3));
}

.card-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #5a4a6a;
}

.card-body { padding: 2rem; }

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
}

.alert-danger {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
}

.alert-success {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  color: #2f855a;
}

.btn-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.form-group { margin-bottom: 1.5rem; }

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #5a4a6a;
}

.required { color: red; }

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e8e1ef;
  border-radius: 12px;
  background: #fff;
}

.form-input.is-invalid {
  border-color: #fc8181;
}

.password-wrapper { position: relative; }

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8b7a9a;
}

.error-message {
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  gap: 0.5rem;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #F1E2A0, #D3C4E1);
  color: #5a4a6a;
  font-weight: 700;
}

.card-footer {
  padding: 1.5rem 2rem;
  text-align: center;
}

.footer-link {
  color: #6b5b7b;
  font-weight: 600;
}
</style>
