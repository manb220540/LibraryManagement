<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="card-header">
        <h2 class="card-title">Thông tin cá nhân</h2>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="loading-center">
          <div class="spinner">
            <i class="bi bi-arrow-repeat"></i>
          </div>
        </div>

        <!-- Error Alert -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="clearError"></button>
        </div>

        <!-- Profile Form -->
        <div v-else class="profile-details">
          <form @submit.prevent="handleUpdateProfile" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-person me-2"></i>Họ lót <span class="required">*</span>
                </label>
                <input
                  type="text"
                  class="form-input"
                  :class="{ 'is-invalid': errors.hoLot }"
                  v-model="userProfile.hoLot"
                  placeholder="Nhập họ lót"
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
                  v-model="userProfile.ten"
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
                  <i class="bi bi-calendar me-2"></i>Ngày sinh
                </label>
                <input
                  type="date"
                  class="form-input"
                  :class="{ 'is-invalid': errors.ngaySinh }"
                  v-model="userProfile.ngaySinh"
                  @input="validateField('ngaySinh')"
                />
                <div class="error-message" v-if="errors.ngaySinh">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.ngaySinh }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="bi bi-gender-ambiguous me-2"></i>Giới tính
                </label>
                <select
                  class="form-input"
                  :class="{ 'is-invalid': errors.phai }"
                  v-model="userProfile.phai"
                  @change="validateField('phai')"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <div class="error-message" v-if="errors.phai">
                  <i class="bi bi-exclamation-circle"></i> {{ errors.phai }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-geo-alt me-2"></i>Địa chỉ
              </label>
              <input
                type="text"
                class="form-input"
                :class="{ 'is-invalid': errors.diaChi }"
                v-model="userProfile.diaChi"
                placeholder="Nhập địa chỉ"
                @input="validateField('diaChi')"
              />
              <div class="error-message" v-if="errors.diaChi">
                <i class="bi bi-exclamation-circle"></i> {{ errors.diaChi }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-telephone me-2"></i>Số điện thoại
              </label>
              <input
                type="tel"
                class="form-input"
                :class="{ 'is-invalid': errors.dienThoai }"
                v-model="userProfile.dienThoai"
                placeholder="Nhập số điện thoại"
                @input="validateField('dienThoai')"
              />
              <div class="error-message" v-if="errors.dienThoai">
                <i class="bi bi-exclamation-circle"></i> {{ errors.dienThoai }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-envelope me-2"></i>Email
              </label>
              <input
                type="email"
                class="form-input"
                :class="{ 'is-invalid': errors.email }"
                v-model="userProfile.email"
                placeholder="example@email.com"
                @input="validateField('email')"
              />
              <div class="error-message" v-if="errors.email">
                <i class="bi bi-exclamation-circle"></i> {{ errors.email }}
              </div>
            </div>

            <div class="form-group">
              <router-link to="/forgot-password" class="text-link">
                <i class="bi bi-key me-1"></i>Nhấn vào đây để đổi mật khẩu.
              </router-link>
            </div>

            <!-- Success Message -->
            <div v-if="message" class="alert alert-success" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              {{ message }}
              <button type="button" class="btn-close" @click="clearMessage"></button>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="cancelUpdate">
                <i class="bi bi-x-circle me-2"></i>Hủy
              </button>
              <button type="submit" class="btn-submit" :disabled="loading || Object.keys(errors).length > 0">
                <span v-if="loading">
                  <i class="bi bi-hourglass-split me-2"></i>Đang lưu...
                </span>
                <span v-else>
                  <i class="bi bi-check-circle me-2"></i>Cập nhật thông tin
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { showError, showSuccess } from '@/utils/notifications';
import { useRouter } from 'vue-router';

export default {
  name: 'UserProfile',
  setup() {
    const store = useStore();
    const router = useRouter();
    const userProfile = ref({
      hoLot: '',
      ten: '',
      ngaySinh: '',
      phai: 'Nam',
      diaChi: '',
      dienThoai: '',
      email: ''
    });
    const errors = ref({});
    const loading = ref(false);
    const error = ref(null);
    const message = ref('');
    const isReader = computed(() => store.getters['auth/isReader']);

    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      return dateStr.split('T')[0];
    };

    const validateField = (field) => {
      const newErrors = { ...errors.value };
      const currentDate = new Date();
      const inputDate = new Date(userProfile.value.ngaySinh);

      if (field === 'hoLot') {
        if (!userProfile.value.hoLot.trim()) {
          newErrors.hoLot = 'Họ lót là bắt buộc';
        } else {
          delete newErrors.hoLot;
        }
      }
      if (field === 'ten') {
        if (!userProfile.value.ten.trim()) {
          newErrors.ten = 'Tên là bắt buộc';
        } else {
          delete newErrors.ten;
        }
      }
      if (field === 'ngaySinh' && userProfile.value.ngaySinh) {
        if (isNaN(inputDate) || inputDate > currentDate) {
          newErrors.ngaySinh = 'Ngày sinh không hợp lệ hoặc không được trong tương lai';
        } else {
          delete newErrors.ngaySinh;
        }
      }
      if (field === 'phai') {
        if (!['Nam', 'Nữ', 'Khác'].includes(userProfile.value.phai)) {
          newErrors.phai = 'Giới tính không hợp lệ';
        } else {
          delete newErrors.phai;
        }
      }
      if (field === 'dienThoai' && userProfile.value.dienThoai) {
        if (!/^\d{10}$/.test(userProfile.value.dienThoai)) {
          newErrors.dienThoai = 'Số điện thoại phải gồm 10 chữ số';
        } else {
          delete newErrors.dienThoai;
        }
      }
      if (field === 'email' && userProfile.value.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.value.email)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email;
        }
      }

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      const currentDate = new Date();
      const inputDate = new Date(userProfile.value.ngaySinh);

      if (!userProfile.value.hoLot.trim()) newErrors.hoLot = 'Họ lót là bắt buộc';
      if (!userProfile.value.ten.trim()) newErrors.ten = 'Tên là bắt buộc';
      if (userProfile.value.ngaySinh && (isNaN(inputDate) || inputDate > currentDate)) {
        newErrors.ngaySinh = 'Ngày sinh không hợp lệ hoặc không được trong tương lai';
      }
      if (userProfile.value.phai && !['Nam', 'Nữ', 'Khác'].includes(userProfile.value.phai)) {
        newErrors.phai = 'Giới tính không hợp lệ';
      }
      if (userProfile.value.dienThoai && !/^\d{10}$/.test(userProfile.value.dienThoai)) {
        newErrors.dienThoai = 'Số điện thoại phải gồm 10 chữ số';
      }
      if (userProfile.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.value.email)) {
        newErrors.email = 'Email không hợp lệ';
      }

      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const fetchProfile = async () => {
      if (!isReader.value) {
        error.value = 'Trang này chỉ dành cho độc giả';
        return;
      }
      try {
        loading.value = true;
        error.value = null;
        const response = await store.dispatch('auth/getProfile');
        userProfile.value = {
          ...response.data,
          ngaySinh: formatDate(response.data.ngaySinh)
        };
        console.log('Fetched profile:', userProfile.value);
      } catch (err) {
        error.value = err.response?.data?.error || 'Không thể tải thông tin cá nhân';
        showError(error.value);
      } finally {
        loading.value = false;
      }
    };

    const handleUpdateProfile = async () => {
      if (!isReader.value) {
        error.value = 'Trang này chỉ dành cho độc giả';
        return;
      }
      if (!validateForm()) return;
      try {
        loading.value = true;
        error.value = null;
        const allowedFields = ['hoLot', 'ten', 'ngaySinh', 'phai', 'diaChi', 'dienThoai', 'email'];
        const updateData = Object.fromEntries(
          Object.entries(userProfile.value).filter(([key]) => allowedFields.includes(key))
        );
        console.log('Sending update data:', updateData);
        await store.dispatch('auth/updateProfile', updateData);
        message.value = 'Cập nhật thông tin thành công';
        showSuccess(message.value);
      } catch (err) {
        error.value = err.response?.data?.error || 'Cập nhật thông tin thất bại';
        if (err.response?.data?.errors) {
          errors.value = err.response.data.errors;
          error.value = Object.values(err.response.data.errors)[0] || error.value;
        }
        console.error('Update profile error:', err.response?.data || err.message);
        showError(error.value);
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      errors.value = {};
      store.commit('auth/SET_ERROR', null);
    };

    const clearMessage = () => {
      message.value = '';
    };

    const cancelUpdate = () => {
      fetchProfile();
      clearError();
      clearMessage();
    };

    onMounted(fetchProfile);

    return {
      userProfile,
      errors,
      loading,
      error,
      message,
      isReader,
      validateField,
      handleUpdateProfile,
      cancelUpdate,
      clearError,
      clearMessage
    };
  }
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
}

.profile-card {
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

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  font-size: 2.5rem;
  color: #8b7a9a;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.alert-success {
  background: #f0fdf4;
  border: 1px solid #86efac;
  color: #166534;
}

.btn-close {
  position: absolute;
  top: 0.875rem;
  right: 0.875rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
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

.profile-details {
  max-width: 100%;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e53e3e;
  font-size: 0.825rem;
  margin-top: 0.4rem;
}

.text-link {
  display: inline-flex;
  align-items: center;
  color: #8b7a9a;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.text-link:hover {
  color: #6b5b7b;
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn-cancel {
  background: rgba(139, 122, 154, 0.15);
  color: #6b5b7b;
}

.btn-cancel:hover {
  background: rgba(139, 122, 154, 0.25);
}

.btn-submit {
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
  color: #5a4a6a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .profile-card {
    border-radius: 16px;
  }
  
  .card-header,
  .card-body {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
  
  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>