<template>
  <div class="register-container">
    <LoadingSpinner :show="loading" />

    <div class="register-card">
      <div class="card-header">
        <h2 class="card-title">Đăng ký tài khoản độc giả</h2>
      </div>

      <div class="card-body">
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-person me-2"></i>Họ <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                :class="{ 'is-invalid': errors.hoLot }"
                v-model="formData.hoLot" 
                placeholder="Nhập họ"
                @input="validateField('hoLot')"
                required
              />
              <div class="error-message" v-if="errors.hoLot">
                <i class="bi bi-exclamation-circle"></i> {{ errors.hoLot }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-person me-2"></i>Tên <span class="required">*</span>
              </label>
              <input 
                type="text" 
                class="form-input"
                :class="{ 'is-invalid': errors.ten }"
                v-model="formData.ten" 
                placeholder="Nhập tên"
                @input="validateField('ten')"
                required
              />
              <div class="error-message" v-if="errors.ten">
                <i class="bi bi-exclamation-circle"></i> {{ errors.ten }}
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-calendar me-2"></i>Ngày sinh <span class="required">*</span>
              </label>
              <input 
                type="date" 
                class="form-input"
                :class="{ 'is-invalid': errors.ngaySinh }"
                v-model="formData.ngaySinh" 
                @input="validateField('ngaySinh')"
                required
              />
              <div class="error-message" v-if="errors.ngaySinh">
                <i class="bi bi-exclamation-circle"></i> {{ errors.ngaySinh }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-gender-ambiguous me-2"></i>Giới tính <span class="required">*</span>
              </label>
              <select 
                class="form-input"
                :class="{ 'is-invalid': errors.phai }"
                v-model="formData.phai" 
                @change="validateField('phai')"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
              <div class="error-message" v-if="errors.phai">
                <i class="bi bi-exclamation-circle"></i> {{ errors.phai }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-geo-alt me-2"></i>Địa chỉ <span class="required">*</span>
            </label>
            <input 
              type="text" 
              class="form-input"
              :class="{ 'is-invalid': errors.diaChi }"
              v-model="formData.diaChi" 
              placeholder="Nhập địa chỉ"
              @input="validateField('diaChi')"
              required
            />
            <div class="error-message" v-if="errors.diaChi">
              <i class="bi bi-exclamation-circle"></i> {{ errors.diaChi }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-telephone me-2"></i>Số điện thoại <span class="required">*</span>
            </label>
            <input 
              type="tel" 
              class="form-input"
              :class="{ 'is-invalid': errors.dienThoai }"
              v-model="formData.dienThoai" 
              placeholder="Nhập số điện thoại"
              @input="validateField('dienThoai')"
              required
            />
            <div class="error-message" v-if="errors.dienThoai">
              <i class="bi bi-exclamation-circle"></i> {{ errors.dienThoai }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-envelope me-2"></i>Email <span class="required">*</span>
            </label>
            <input 
              type="email" 
              class="form-input"
              :class="{ 'is-invalid': errors.email }"
              v-model="formData.email" 
              placeholder="example@gmail.com"
              @input="validateField('email')"
              required
            />
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
                v-model="formData.password" 
                placeholder="Nhập mật khẩu"
                @input="validateField('password')"
                required
              />
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

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock-fill me-2"></i>Xác nhận mật khẩu <span class="required">*</span>
            </label>
            <div class="password-wrapper">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                class="form-input"
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="formData.confirmPassword" 
                placeholder="Nhập lại mật khẩu"
                @input="validateField('confirmPassword')"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
                :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div class="error-message" v-if="errors.confirmPassword">
              <i class="bi bi-exclamation-circle"></i> {{ errors.confirmPassword }}
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">
              <i class="bi bi-hourglass-split me-2"></i>Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-person-plus me-2"></i>Đăng ký
            </span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <p class="footer-text">
          Đã có tài khoản? 
          <router-link to="/login" class="footer-link">Đăng nhập</router-link>
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
import { showError, showSuccess } from '@/utils/notifications';

export default {
  name: 'RegisterForm',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const router = useRouter();
    const formData = ref({
      hoLot: '',
      ten: '',
      ngaySinh: '',
      phai: 'Nam',
      diaChi: '',
      dienThoai: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const errors = ref({});
    const loading = computed(() => store.state.auth.loading);
    const error = computed(() => store.state.auth.error);
    const showPassword = ref(false);

    const validateField = (field) => {
      const newErrors = { ...errors.value };

      if (field === 'hoLot') {
        if (!formData.value.hoLot) {
          newErrors.hoLot = 'Họ là bắt buộc';
        } else {
          delete newErrors.hoLot;
        }
      }

      if (field === 'ten') {
        if (!formData.value.ten) {
          newErrors.ten = 'Tên là bắt buộc';
        } else {
          delete newErrors.ten;
        }
      }

      if (field === 'ngaySinh') {
        if (!formData.value.ngaySinh) {
          newErrors.ngaySinh = 'Ngày sinh là bắt buộc';
        } else {
          delete newErrors.ngaySinh;
        }
      }

      if (field === 'phai') {
        if (!formData.value.phai) {
          newErrors.phai = 'Giới tính là bắt buộc';
        } else {
          delete newErrors.phai;
        }
      }

      if (field === 'diaChi') {
        if (!formData.value.diaChi) {
          newErrors.diaChi = 'Địa chỉ là bắt buộc';
        } else {
          delete newErrors.diaChi;
        }
      }

      if (field === 'dienThoai') {
        if (!formData.value.dienThoai) {
          newErrors.dienThoai = 'Số điện thoại là bắt buộc';
        } else if (!/^[0][0-9]{9}$/.test(formData.value.dienThoai)) {
          newErrors.dienThoai = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số';
        } else {
          delete newErrors.dienThoai;
        }
      }

      if (field === 'email') {
        if (!formData.value.email) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email;
        }
      }

      if (field === 'password') {
        if (!formData.value.password) {
          newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.value.password.length < 5) {
          newErrors.password = 'Mật khẩu phải có ít nhất 5 ký tự';
        } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(formData.value.password)) {
          newErrors.password = 'Mật khẩu phải chứa cả chữ và số';
        } else {
          delete newErrors.password;
        }
        if (formData.value.confirmPassword && formData.value.confirmPassword !== formData.value.password) {
          newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu phải khớp';
        } else if (formData.value.confirmPassword) {
          delete newErrors.confirmPassword;
        }
      }

      if (field === 'confirmPassword') {
        if (!formData.value.confirmPassword) {
          newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.value.confirmPassword !== formData.value.password) {
          newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu phải khớp';
        } else {
          delete newErrors.confirmPassword;
        }
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.value.hoLot) {
        newErrors.hoLot = 'Họ là bắt buộc';
      }
      if (!formData.value.ten) {
        newErrors.ten = 'Tên là bắt buộc';
      }
      if (!formData.value.ngaySinh) {
        newErrors.ngaySinh = 'Ngày sinh là bắt buộc';
      }
      if (!formData.value.phai) {
        newErrors.phai = 'Giới tính là bắt buộc';
      }
      if (!formData.value.diaChi) {
        newErrors.diaChi = 'Địa chỉ là bắt buộc';
      }
      if (!formData.value.dienThoai) {
        newErrors.dienThoai = 'Số điện thoại là bắt buộc';
      } else if (!/^[0][0-9]{9}$/.test(formData.value.dienThoai)) {
        newErrors.dienThoai = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số';
      }
      if (!formData.value.email) {
        newErrors.email = 'Email là bắt buộc';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
      if (!formData.value.password) {
        newErrors.password = 'Mật khẩu là bắt buộc';
      } else if (formData.value.password.length < 5) {
        newErrors.password = 'Mật khẩu phải có ít nhất 5 ký tự';
      } else if (!/(?=.*[A-Za-z])(?=.*\d).+/.test(formData.value.password)) {
        newErrors.password = 'Mật khẩu phải chứa cả chữ và số';
      }
      if (!formData.value.confirmPassword) {
        newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      } else if (formData.value.confirmPassword !== formData.value.password) {
        newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu phải khớp';
      }
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      const payload = {
        hoLot: formData.value.hoLot.trim(),
        ten: formData.value.ten.trim(),
        ngaySinh: formData.value.ngaySinh,
        phai: formData.value.phai,
        diaChi: formData.value.diaChi,
        dienThoai: formData.value.dienThoai,
        email: formData.value.email,
        password: formData.value.password
      };

      try {
        await store.dispatch('auth/registerReader', payload);
        showSuccess('Đăng ký thành công');
        errors.value = {};
        router.push('/reader');
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
      formData,
      loading,
      error,
      errors,
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
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
}

.register-card {
  width: 100%;
  max-width: 720px;
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
  padding: 1.5rem 2rem 1.25rem;
  background: linear-gradient(135deg, rgba(241, 226, 160, 0.3) 0%, rgba(211, 196, 225, 0.3) 100%);
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #5a4a6a;
}

.card-body {
  padding: 1.5rem 2rem;
}

.alert {
  padding: 0.875rem;
  border-radius: 12px;
  margin-bottom: 1rem;
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
  top: 0.875rem;
  right: 0.875rem;
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

.btn-close::before {
  content: '×';
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row .form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #5a4a6a;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.required {
  color: #e53e3e;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e8e1ef;
  border-radius: 12px;
  font-size: 0.95rem;
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

select.form-input {
  cursor: pointer;
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
  font-size: 0.825rem;
  margin-top: 0.4rem;
}

.btn-submit {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
  color: #5a4a6a;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.25rem;
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
  padding: 1.25rem 2rem;
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .register-card {
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
}
</style>