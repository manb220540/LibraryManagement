<template>
  <div class="publisher-list container mt-4">
    <LoadingSpinner :show="loading" />

    <h2 class="mb-4">Danh sách nhà xuất bản</h2>

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
            <h5 class="mb-0">Tìm kiếm & Lọc nhà xuất bản</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleAdvancedSearch">
              {{ showAdvancedSearch ? 'Ẩn' : 'Hiện' }} bộ lọc
            </button>
          </div>
          <div class="card-body" v-show="showAdvancedSearch">
            <div class="row g-3">
              <!-- Tên NXB -->
              <div class="col-md-4">
                <label class="form-label">Tên nhà xuất bản</label>
                <input
                  type="text"
                  class="form-control"
                  v-model.trim="filters.tenNXB"
                  placeholder="Nhập tên NXB"
                />
              </div>
              <!-- Mã NXB -->
              <div class="col-md-4">
                <label class="form-label">Mã NXB</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="filters.maNXB"
                  placeholder="VD: 1"
                />
              </div>
              <!-- Địa chỉ -->
              <div class="col-md-4">
                <label class="form-label">Địa chỉ</label>
                <input
                  type="text"
                  class="form-control"
                  v-model.trim="filters.diaChi"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <!-- Năm xuất bản sách -->
              <div class="col-md-4">
                <label class="form-label">Năm xuất bản sách</label>
                <div class="row">
                  <div class="col">
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="filters.namMin"
                      placeholder="Từ"
                    />
                  </div>
                  <div class="col">
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="filters.namMax"
                      placeholder="Đến"
                    />
                  </div>
                </div>
              </div>
              <!-- Sắp xếp -->
              <div class="col-md-4">
                <label class="form-label">Sắp xếp theo</label>
                <select class="form-select" v-model="sortBy">
                  <option value="tenNXB-asc">Tên NXB (A-Z)</option>
                  <option value="tenNXB-desc">Tên NXB (Z-A)</option>
                  <option value="maNXB-asc">Mã NXB (tăng dần)</option>
                  <option value="maNXB-desc">Mã NXB (giảm dần)</option>
                </select>
              </div>
              <!-- Nút điều khiển -->
              <div class="col-12 text-end mt-3">
                <button class="btn btn-outline-secondary me-2" @click="resetFilters">
                  Xóa bộ lọc
                </button>
                <button class="btn btn-primary" @click="applyFilters">
                  Áp dụng
                </button>
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
          <button
            class="page-link"
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
          >
            Trước
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">
            Trang {{ pagination.page }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
          <button
            class="page-link"
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === totalPages"
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>

    <!-- Danh sách nhà xuất bản -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="publisher in publishers" :key="publisher.maNXB">
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ publisher.tenNXB }}</h5>
            <p class="card-text">
              <small class="text-muted">Mã NXB: {{ publisher.maNXB }}</small>
            </p>
            <p class="card-text">
              <strong>Địa chỉ:</strong> {{ publisher.diaChi }}
            </p>
            <p class="card-text">
              <strong>Số sách đã xuất bản:</strong>
              <span class="badge bg-success">{{ publisher.Sach?.length || 0 }}</span>
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <button
              class="btn btn-outline-primary btn-sm w-100"
              @click="showPublisherBooks(publisher)"
            >
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
              Sách của <strong>{{ selectedPublisher?.tenNXB }}</strong>
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
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="book in selectedPublisherBooks" :key="book.maSach">
                    <td>{{ book.maSach }}</td>
                    <td>{{ book.tenSach }}</td>
                    <td>{{ book.namXuatBan }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="book.soLuongHienCo > 0 ? 'bg-success' : 'bg-danger'"
                      >
                        {{ book.soLuongHienCo }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(book.donGia) }}</td>
                  </tr>
                  <tr v-if="!selectedPublisherBooks.length">
                    <td colspan="5" class="text-center text-muted">Không có sách nào</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeBooksModal">
              Đóng
            </button>
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
  name: 'PublisherList',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();

    // === State ===
    const loading = ref(false);
    const error = ref(null);
    const showAdvancedSearch = ref(false);
    const showBooksModal = ref(false);
    const selectedPublisher = ref(null);

    // === Bộ lọc & sắp xếp ===
    const filters = ref({
      tenNXB: '',
      maNXB: null,
      diaChi: '',
      namMin: null,
      namMax: null,
    });
    const sortBy = ref('tenNXB-asc');

    // === Phân trang ===
    const pagination = ref({
      total: 0,
      limit: 12,
      page: 1,
      totalPages: 1,
    });

    // === Danh sách ===
    const publishers = computed(() => store.getters['publisher/allPublishers'] || []);

    // === Computed ===
    const selectedPublisherBooks = computed(() => selectedPublisher.value?.Sach || []);
    const totalPages = computed(() => pagination.value.totalPages || 1);

    // === Hàm xử lý ===
    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    const resetFilters = () => {
      filters.value = {
        tenNXB: '',
        maNXB: null,
        diaChi: '',
        namMin: null,
        namMax: null,
      };
      sortBy.value = 'tenNXB-asc';
      pagination.value.page = 1;
      applyFilters();
    };

    const applyFilters = async () => {
      loading.value = true;
      try {
        const hasFilter = Object.values(filters.value).some(
          value => value !== null && value !== '' && value !== undefined
        );

        if (!hasFilter) {
          // Không có bộ lọc → lấy tất cả
          const result = await store.dispatch('publisher/fetchPublishers');
          pagination.value.total = result.pagination.total;
          pagination.value.page = result.pagination.page;
          pagination.value.limit = result.pagination.limit;
          pagination.value.totalPages = result.pagination.totalPages;
        } else {
          // Có bộ lọc → tìm kiếm nâng cao
          const params = {};
          if (filters.value.tenNXB?.trim()) params.tenNXB = filters.value.tenNXB.trim();
          if (filters.value.maNXB !== null) params.maNXB = filters.value.maNXB;
          if (filters.value.diaChi?.trim()) params.diaChi = filters.value.diaChi.trim();
          if (filters.value.namMin !== null) params.namMin = filters.value.namMin;
          if (filters.value.namMax !== null) params.namMax = filters.value.namMax;

          const [field, dir] = sortBy.value.split('-');
          params.sortBy = field;
          params.order = dir.toUpperCase();
          params.limit = pagination.value.limit;
          params.page = pagination.value.page;

          const result = await store.dispatch('publisher/searchPublishers', params);
          pagination.value.total = result.total;
          pagination.value.page = result.page;
          pagination.value.limit = result.limit;
          pagination.value.totalPages = result.totalPages;
        }
      } catch (err) {
        error.value = 'Không thể tải danh sách nhà xuất bản';
        showError('Lỗi: ' + (err.response?.data?.message || err.message));
      } finally {
        loading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      pagination.value.page = page;
      applyFilters();
    };

    const showPublisherBooks = (publisher) => {
      selectedPublisher.value = publisher;
      showBooksModal.value = true;
    };

    const closeBooksModal = () => {
      showBooksModal.value = false;
      selectedPublisher.value = null;
    };

    const clearError = () => {
      error.value = null;
      store.commit('publisher/SET_ERROR', null);
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value || 0);
    };

    // === Watch thay đổi filter → tự động tìm kiếm ===
    watch(
      [filters, sortBy],
      () => {
        pagination.value.page = 1;
        applyFilters();
      },
      { deep: true }
    );

    // === Khởi tạo ===
    onMounted(() => {
      applyFilters();
    });

    return {
      loading,
      error,
      showAdvancedSearch,
      showBooksModal,
      selectedPublisher,
      selectedPublisherBooks,
      publishers,
      filters,
      sortBy,
      pagination,
      totalPages,
      toggleAdvancedSearch,
      resetFilters,
      applyFilters,
      changePage,
      showPublisherBooks,
      closeBooksModal,
      clearError,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.publisher-list {
  max-width: 1400px;
  margin: 0 auto;
}

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