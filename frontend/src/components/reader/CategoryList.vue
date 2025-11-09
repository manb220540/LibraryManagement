<template>
  <div class="category-list container mt-4">
    <LoadingSpinner :show="loading" />

    <h2 class="mb-4">Danh sách thể loại</h2>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Tìm kiếm nâng cao -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Tìm kiếm & Lọc thể loại</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleAdvancedSearch">
              {{ showAdvancedSearch ? 'Ẩn' : 'Hiện' }} bộ lọc
            </button>
          </div>
          <div class="card-body" v-show="showAdvancedSearch">
            <div class="row g-3">
              <!-- Tên thể loại -->
              <div class="col-md-4">
                <label class="form-label">Tên thể loại</label>
                <input
                  type="text"
                  class="form-control"
                  v-model.trim="filters.tenTheLoai"
                  placeholder="Nhập tên thể loại"
                />
              </div>
              <!-- Mã thể loại -->
              <div class="col-md-4">
                <label class="form-label">Mã thể loại</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="filters.maTheLoai"
                  placeholder="VD: 1"
                />
              </div>
              <!-- Sắp xếp -->
              <div class="col-md-4">
                <label class="form-label">Sắp xếp theo</label>
                <select class="form-select" v-model="sortBy">
                  <option value="tenTheLoai-asc">Tên thể loại (A-Z)</option>
                  <option value="tenTheLoai-desc">Tên thể loại (Z-A)</option>
                  <option value="maTheLoai-asc">Mã thể loại (tăng dần)</option>
                  <option value="maTheLoai-desc">Mã thể loại (giảm dần)</option>
                </select>
              </div>
              <!-- Nút điều khiển -->
              <div class="col-12 text-end mt-3">
                <button class="btn btn-outline-secondary me-2" @click="resetFilters">Xóa bộ lọc</button>
                <button class="btn btn-primary" @click="applyFilters">Áp dụng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
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

    <!-- Danh sách thể loại -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="category in categories" :key="category.maTheLoai">
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ category.tenTheLoai }}</h5>
            <p class="card-text">
              <small class="text-muted">Mã thể loại: {{ category.maTheLoai }}</small>
            </p>
            <p class="card-text">
              <strong>Số sách:</strong>
              <span class="badge bg-success">{{ category.soLuongSach || 0 }}</span>
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-outline-primary btn-sm w-100" @click="showCategoryBooks(category)">
              Xem danh sách sách
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Danh sách sách -->
    <div
      class="modal fade"
      :class="{ show: showBooksModal, 'd-block': showBooksModal }"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Sách thuộc thể loại <strong>{{ selectedCategory?.tenTheLoai }}</strong>
            </h5>
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
                    <th>Số quyển</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in categoryBooks" :key="book.maSach">
                    <td>{{ book.maSach }}</td>
                    <td>{{ book.tenSach }}</td>
                    <td>{{ book.namXuatBan }}</td>
                    <td>
                      <span :class="book.soLuongHienCo > 0 ? 'badge bg-success' : 'badge bg-danger'">
                        {{ book.soLuongHienCo }}
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
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError } from '@/utils/notifications';

export default {
  name: 'CategoryList',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();

    // === State ===
    const loading = computed(() => store.getters['category/isLoading']);
    const error = computed(() => store.getters['category/error']);
    const showAdvancedSearch = ref(false);
    const showBooksModal = ref(false);
    const selectedCategory = ref(null);

    // === Filters & Sorting ===
    const filters = ref({
      tenTheLoai: '',
      maTheLoai: null,
    });
    const sortBy = ref('tenTheLoai-asc');

    // === Pagination ===
    const pagination = ref({
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1
    });

    // === Computed ===
    const categories = computed(() => store.getters['category/allCategories'] || []);
    const categoryBooks = computed(() => selectedCategory.value?.Sach || []);
    const totalPages = computed(() => pagination.value.totalPages || 1);

    // === Methods ===
    const toggleAdvancedSearch = () => showAdvancedSearch.value = !showAdvancedSearch.value;

    const applyFilters = async () => {
      try {
        const params = {};
        if (filters.value.tenTheLoai?.trim()) params.tenTheLoai = filters.value.tenTheLoai.trim();
        if (filters.value.maTheLoai !== null) params.maTheLoai = filters.value.maTheLoai;

        const [field, dir] = sortBy.value.split('-');
        params.sortBy = field;
        params.order = dir.toUpperCase();
        params.limit = pagination.value.limit;
        params.page = pagination.value.page;

        const result = await store.dispatch('category/searchCategories', params);
        pagination.value.total = result.total;
        pagination.value.page = result.page;
        pagination.value.limit = result.limit;
        pagination.value.totalPages = result.totalPages;
      } catch (err) {
        showError('Lỗi tìm kiếm thể loại: ' + (err.response?.data?.message || err.message));
      }
    };

    const resetFilters = () => {
      filters.value = { tenTheLoai: '', maTheLoai: null };
      sortBy.value = 'tenTheLoai-asc';
      pagination.value.page = 1;
      applyFilters();
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      pagination.value.page = page;
      applyFilters();
    };

    const showCategoryBooks = (category) => {
      selectedCategory.value = category;
      showBooksModal.value = true;
    };

    const closeBooksModal = () => {
      showBooksModal.value = false;
      selectedCategory.value = null;
    };

    const clearError = () => {
      store.commit('category/SET_ERROR', null);
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
    };

    // === Watch ===
    watch([filters, sortBy], () => {
      pagination.value.page = 1;
      applyFilters();
    }, { deep: true });

    // === Mounted ===
    onMounted(() => {
      applyFilters();
    });

    return {
      loading,
      error,
      showAdvancedSearch,
      showBooksModal,
      selectedCategory,
      categoryBooks,
      filters,
      sortBy,
      pagination,
      totalPages,
      categories,
      toggleAdvancedSearch,
      resetFilters,
      applyFilters,
      changePage,
      showCategoryBooks,
      closeBooksModal,
      clearError,
      formatCurrency
    };
  }
};
</script>

<style scoped>
.card {
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.hover-shadow {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.hover-shadow:hover {
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15) !important;
}

.badge {
  font-size: 0.9em;
}

.modal.show {
  display: block;
}

.table th {
  font-weight: 600;
  color: #495057;
}
</style>
