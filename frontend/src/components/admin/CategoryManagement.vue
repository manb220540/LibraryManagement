<template>
  <div class="category-management container mt-4">
    <LoadingSpinner :show="loading" />
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý thể loại</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm thể loại mới
      </button>
    </div>
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>
    <div class="card shadow-sm mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Tìm kiếm & Lọc thể loại</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="showAdvancedSearch = !showAdvancedSearch">
          {{ showAdvancedSearch ? 'Ẩn' : 'Hiện' }} bộ lọc
        </button>
      </div>
      <div class="card-body" v-show="showAdvancedSearch">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Tên thể loại</label>
            <input type="text" class="form-control" v-model.trim="filters.tenTheLoai" placeholder="Nhập tên thể loại" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Mã thể loại</label>
            <input type="number" class="form-control" v-model.number="filters.maTheLoai" placeholder="VD: 1" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Sắp xếp theo</label>
            <select class="form-select" v-model="sortBy">
              <option value="tenTheLoai-asc">Tên thể loại (A-Z)</option>
              <option value="tenTheLoai-desc">Tên thể loại (Z-A)</option>
              <option value="maTheLoai-asc">Mã thể loại (tăng dần)</option>
              <option value="maTheLoai-desc">Mã thể loại (giảm dần)</option>
            </select>
          </div>
          <div class="col-12 text-end mt-3">
            <button class="btn btn-outline-secondary me-2" @click="resetFilters">Xóa bộ lọc</button>
            <button class="btn btn-primary" @click="applyFilters">Áp dụng</button> 
          </div>
        </div>
      </div>
    </div>
    <div class="table-responsive mb-4">
      <table class="table table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã thể loại</th>
            <th>Tên thể loại</th>
            <th>Số sách</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!categories.length">
            <td colspan="4" class="text-center text-muted">Không có thể loại nào</td>
          </tr>
          <tr v-for="category in categories" :key="category.maTheLoai">
            <td>{{ category.maTheLoai }}</td>
            <td>{{ category.tenTheLoai }}</td>
            <td><span class="badge bg-success">{{ category.Sach?.length || 0 }}</span></td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editCategory(category)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger me-2" @click="confirmDelete(category)">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn btn-sm btn-primary" @click="showCategoryBooks(category)">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation" class="mb-4" v-if="pagination.total > pagination.limit">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
          <button class="page-link" @click="changePage(pagination.page - 1)">Trước</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">Trang {{ pagination.page }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
          <button class="page-link" @click="changePage(pagination.page + 1)">Sau</button>
        </li>
      </ul>
    </nav>
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCategory ? 'Sửa thể loại' : 'Thêm thể loại mới' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3" v-if="editingCategory">
                <label class="form-label">Mã thể loại</label>
                <input type="text" class="form-control" v-model="categoryForm.maTheLoai" readonly />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên thể loại <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="categoryForm.tenTheLoai" :class="{ 'is-invalid': errors.tenTheLoai }" @input="validateField('tenTheLoai')" required />
                <div class="invalid-feedback">{{ errors.tenTheLoai }}</div>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="loading || Object.keys(errors).length > 0">
                  {{ loading ? 'Đang xử lý...' : (editingCategory ? 'Cập nhật' : 'Thêm mới') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa thể loại "<strong>{{ selectedCategory?.tenTheLoai }}</strong>" không?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button class="btn btn-danger" @click="handleDelete" :disabled="loading">{{ loading ? 'Đang xử lý...' : 'Xóa' }}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" :class="{ show: showBooksModal, 'd-block': showBooksModal }" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sách của thể loại <strong>{{ selectedCategory?.tenTheLoai }}</strong></h5>
            <button type="button" class="btn-close" @click="closeBooksModal"></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Mã sách</th>
                    <th>Tên sách</th>
                    <th>Năm XB</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in categoryBooks" :key="book.maSach">
                    <td>{{ book.maSach }}</td>
                    <td>{{ book.tenSach }}</td>
                    <td>{{ book.namXuatBan || '—' }}</td>
                    <td>
                      <span class="badge" :class="book.soLuongHienCo > 0 ? 'bg-success' : 'bg-danger'">
                        {{ book.soLuongHienCo || 0 }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(book.donGia) }}</td>
                  </tr>
                  <tr v-if="categoryBooks.length === 0">
                    <td colspan="5" class="text-center text-muted">Không có sách nào</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeBooksModal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal || showDeleteModal || showBooksModal"></div>
  </div>
</template>
<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError, showSuccess } from '@/utils/notifications';
export default {
  name: 'CategoryManagement',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    // Loading và error
    const loading = computed(() => store.getters['category/isLoading'] || false);
    const error = computed(() => store.getters['category/error']);
    // Modal và UI state
    const showAddModal = ref(false);
    const editingCategory = ref(null);
    const showDeleteModal = ref(false);
    const showBooksModal = ref(false);
    const showAdvancedSearch = ref(false);
    const selectedCategory = ref(null);
    // Form & validation
    const categoryForm = ref({ maTheLoai: '', tenTheLoai: '' });
    const errors = ref({});
    // Filters & sorting
    const filters = ref({ tenTheLoai: '', maTheLoai: null });
    const sortBy = ref('tenTheLoai-asc');
    // Pagination
    const pagination = ref({ total: 0, page: 1, limit: 10, totalPages: 1 });
    // Data
    const categories = computed(() => store.getters['category/allCategories'] || []);
    // Sửa lỗi 3: Giữ nguyên 'Sach' nếu API trả về property này, hoặc đổi thành 'books'
    const categoryBooks = computed(() => selectedCategory.value?.Sach || []); 
    const totalPages = computed(() => pagination.value.totalPages || 1);
    // Validation
    const validateField = (field) => {
      const e = { ...errors.value };
      if (field === 'tenTheLoai' && !categoryForm.value.tenTheLoai) e.tenTheLoai = 'Tên thể loại là bắt buộc';
      else delete e[field];
      errors.value = e;
    };
    const validateForm = () => {
      const e = {};
      if (!categoryForm.value.tenTheLoai) e.tenTheLoai = 'Tên thể loại là bắt buộc';
      errors.value = e;
      return Object.keys(e).length === 0;
    };
    // Fetch dữ liệu & Áp dụng filters (Sửa lỗi 1: Đưa logic lọc vào đây)
    const fetchData = async () => {
      try {
        const params = {
          limit: pagination.value.limit,
          page: pagination.value.page,
        };
        // Thêm Filters
        if (filters.value.tenTheLoai?.trim()) params.tenTheLoai = filters.value.tenTheLoai.trim();
        if (filters.value.maTheLoai !== null && filters.value.maTheLoai !== '') params.maTheLoai = filters.value.maTheLoai;

        // Thêm Sorting
        const [field, dir] = sortBy.value.split('-');
        params.sortBy = field;
        params.order = dir.toUpperCase();

        // Giả định store có action 'searchCategories' để xử lý lọc/phân trang
        const result = await store.dispatch('category/searchCategories', params); 
        
        // Cập nhật Pagination
        pagination.value.total = result.total || 0;
        pagination.value.page = result.page || 1;
        pagination.value.limit = result.limit || 10;
        pagination.value.totalPages = result.totalPages || 1;

      } catch (err) {
        showError('Lỗi khi tải dữ liệu: ' + (err.response?.data?.message || err.message));
      }
    };
    // Filters
    const applyFilters = () => {
      // Đặt lại trang về 1 khi áp dụng bộ lọc mới
      pagination.value.page = 1; 
      fetchData();
    };
    const resetFilters = () => {
      filters.value = { tenTheLoai: '', maTheLoai: null };
      sortBy.value = 'tenTheLoai-asc';
      pagination.value.page = 1;
      fetchData(); // Sửa: gọi fetchData sau khi reset
    };
    // Pagination
    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      pagination.value.page = page;
      fetchData(); // Sửa: gọi fetchData khi đổi trang
    };
    // Watch filters/sorting để tự động lọc khi thay đổi (tùy chọn, nếu không muốn dùng nút Áp dụng)
    // watch([filters, sortBy], () => {
    //   pagination.value.page = 1;
    //   fetchData();
    // }, { deep: true });
    // CRUD
    const editCategory = (category) => {
      editingCategory.value = category;
      categoryForm.value = { ...category };
      showAddModal.value = true;
    };
    const confirmDelete = (category) => {
      selectedCategory.value = category;
      showDeleteModal.value = true;
    };
    const handleDelete = async () => {
      try {
        await store.dispatch('category/deleteCategory', selectedCategory.value.maTheLoai);
        await fetchData();
        showSuccess('Xóa thể loại thành công');
      } catch (err) {
        showError('Lỗi khi xóa thể loại: ' + (err.response?.data?.message || err.message));
      } finally {
        showDeleteModal.value = false;
        selectedCategory.value = null;
      }
    };
    const handleSubmit = async () => {
      if (!validateForm()) {
        showError('Vui lòng kiểm tra lại các trường thông tin');
        return;
      }
      try {
        if (editingCategory.value) {
          await store.dispatch('category/updateCategory', { maTheLoai: editingCategory.value.maTheLoai, categoryData: categoryForm.value });
          showSuccess('Cập nhật thể loại thành công');
        } else {
          await store.dispatch('category/createCategory', categoryForm.value);
          showSuccess('Thêm thể loại thành công');
        }
        await fetchData();
        showAddModal.value = false;
        editingCategory.value = null;
        categoryForm.value = { maTheLoai: '', tenTheLoai: '' };
      } catch (err) {
        showError('Lỗi khi lưu thể loại: ' + (err.response?.data?.message || err.message));
      }
    };
    const closeModal = () => {
      showAddModal.value = false;
      editingCategory.value = null;
      categoryForm.value = { maTheLoai: '', tenTheLoai: '' };
      errors.value = {};
    };
    // Xem sách
    const showCategoryBooks = (category) => {
      selectedCategory.value = category;
      showBooksModal.value = true;
    };
    const closeBooksModal = () => {
      selectedCategory.value = null;
      showBooksModal.value = false;
    };
    // Utils
    const clearError = () => store.commit('category/SET_ERROR', null);
    const formatCurrency = val => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
    
    // Sửa lỗi: Gọi fetchData lần đầu khi component được mount
    onMounted(fetchData); 

    return {
      // State & refs
      loading, error, showAddModal, editingCategory, showDeleteModal, showBooksModal, selectedCategory, showAdvancedSearch,
      categoryForm, errors, categories, categoryBooks, totalPages, pagination, filters, sortBy,
      // Methods
      validateField, validateForm, closeModal, editCategory, confirmDelete, handleDelete,
      handleSubmit, showCategoryBooks, closeBooksModal, clearError, applyFilters, resetFilters, changePage, formatCurrency
    };
  }
};
</script>
<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.input-group {
  max-width: 400px;
}
.input-group-text {
  background-color: white;
  border-left: none;
}
.form-control:focus + .input-group-text {
  border-color: #86b7fe;
}
.form-control {
  border-right: none;
}
</style>