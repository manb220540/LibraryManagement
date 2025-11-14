<template>
  <div class="author-list container mt-4">
    <LoadingSpinner :show="loading" />

    <h2 class="mb-4">Danh sách Tác giả</h2>

    <!-- Thông báo lỗi -->
    <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Bộ lọc nâng cao -->
    <div class="card shadow-sm mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Tìm kiếm & Lọc tác giả</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="toggleAdvancedSearch">
          {{ showAdvancedSearch ? 'Ẩn' : 'Hiện' }} bộ lọc
        </button>
      </div>

      <div class="card-body" v-show="showAdvancedSearch">
        <div class="row g-3">
          <!-- Tên tác giả -->
          <div class="col-md-4">
            <label class="form-label">Tên tác giả</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="filters.tenTacGia"
              placeholder="Nhập tên tác giả"
            />
          </div>

          <!-- Mã tác giả -->
          <div class="col-md-4">
            <label class="form-label">Mã tác giả</label>
            <input
              type="number"
              class="form-control"
              v-model.number="filters.maTacGia"
              placeholder="VD: 1"
            />
          </div>

          <!-- Quốc tịch -->
          <div class="col-md-4">
            <label class="form-label">Địa chỉ</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="filters.diaChi"
              placeholder="Nhập địa chỉ"
            />
          </div>

          <!-- Năm xuất bản -->
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
              <option value="tenTacGia-asc">Tên tác giả (A-Z)</option>
              <option value="tenTacGia-desc">Tên tác giả (Z-A)</option>
              <option value="maTacGia-asc">Mã tác giả (tăng dần)</option>
              <option value="maTacGia-desc">Mã tác giả (giảm dần)</option>
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

    <!-- Danh sách tác giả -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div v-for="author in authors" :key="author.maTacGia" class="col">
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ author.tenTacGia }}</h5>
            <p class="card-text"><small class="text-muted">Mã: {{ author.maTacGia }}</small></p>
            <p class="card-text"><strong>Địa chỉ:</strong> {{ author.diaChi || '—' }}</p>
            <p class="card-text">
              <strong>Số sách:</strong>
              <span class="badge bg-success">{{ author.soLuongSach || 0 }}</span>
            </p>
          </div>
          <div class="card-footer bg-transparent">
            <button
              class="btn btn-outline-primary btn-sm w-100"
              @click="showAuthorBooks(author)"
            >
              Xem danh sách sách
            </button>
          </div>
        </div>
      </div>
      <div v-if="!authors.length" class="text-center text-muted py-4">
        Không tìm thấy tác giả nào
      </div>
    </div>

    <!-- Modal danh sách sách -->
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
              Sách của <strong>{{ selectedAuthor?.tenTacGia }}</strong>
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
                  <tr v-for="book in selectedAuthorBooks" :key="book.maSach">
                    <td>{{ book.maSach }}</td>
                    <td>{{ book.tenSach }}</td>
                    <td>{{ book.namXuatBan || '—' }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="book.soLuongHienCo > 0 ? 'bg-success' : 'bg-danger'"
                      >
                        {{ book.soLuongHienCo || 0 }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(book.donGia) }}</td>
                  </tr>
                  <tr v-if="!selectedAuthorBooks.length">
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
// import { ref, computed, watch, onMounted } from "vue";
// import { useStore } from "vuex";
// import LoadingSpinner from "@/components/LoadingSpinner.vue";
// import { showError } from "@/utils/notifications";

// export default {
//   name: "AuthorList",
//   components: { LoadingSpinner },
//   setup() {
//     const store = useStore();
//     const loading = ref(false);
//     const error = ref(null);
//     const showAdvancedSearch = ref(false);
//     const showBooksModal = ref(false);
//     const selectedAuthor = ref(null);

//     const filters = ref({
//       tenTacGia: "",
//       maTacGia: null,
//       quocTich: "",
//       namMin: null,
//       namMax: null,
//     });
//     const sortBy = ref("tenTacGia-asc");

//     const pagination = ref({
//       total: 0,
//       limit: 12,
//       page: 1,
//       totalPages: 1,
//     });

//     const authors = computed(() => store.getters["author/allAuthors"] || []);
//     const selectedAuthorBooks = computed(() => selectedAuthor.value?.Sach || []);
//     const totalPages = computed(() => pagination.value.totalPages || 1);

//     const toggleAdvancedSearch = () => {
//       showAdvancedSearch.value = !showAdvancedSearch.value;
//     };

//     const resetFilters = () => {
//       filters.value = { tenTacGia: "", maTacGia: null, quocTich: "", namMin: null, namMax: null };
//       sortBy.value = "tenTacGia-asc";
//       pagination.value.page = 1;
//       applyFilters();
//     };

//     const applyFilters = async () => {
//       loading.value = true;
//       try {
//         const hasFilter = Object.values(filters.value).some(
//           (v) => v !== null && v !== "" && v !== undefined
//         );

//         const [field, dir] = sortBy.value.split("-");
//         const params = {
//           ...filters.value,
//           sortBy: field,
//           order: dir.toUpperCase(),
//           limit: pagination.value.limit,
//           page: pagination.value.page,
//         };

//         const result = hasFilter
//           ? await store.dispatch("author/searchAuthors", params)
//           : await store.dispatch("author/fetchAuthors");

//         pagination.value.total = result?.total || result?.pagination?.total || 0;
//         pagination.value.totalPages =
//           result?.totalPages || result?.pagination?.totalPages || 1;
//       } catch (err) {
//         error.value = "Không thể tải danh sách tác giả";
//         showError(err.response?.data?.message || err.message);
//       } finally {
//         loading.value = false;
//       }
//     };

//     const changePage = (page) => {
//       if (page < 1 || page > totalPages.value) return;
//       pagination.value.page = page;
//       applyFilters();
//     };

//     const showAuthorBooks = (author) => {
//       selectedAuthor.value = author;
//       showBooksModal.value = true;
//     };

//     const closeBooksModal = () => {
//       selectedAuthor.value = null;
//       showBooksModal.value = false;
//     };

//     const clearError = () => {
//       error.value = null;
//       store.commit("author/SET_ERROR", null);
//     };

//     const formatCurrency = (val) =>
//       new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

//     watch([filters, sortBy], () => {
//       pagination.value.page = 1;
//       applyFilters();
//     }, { deep: true });

//     onMounted(() => applyFilters());

//     return {
//       loading,
//       error,
//       showAdvancedSearch,
//       filters,
//       sortBy,
//       pagination,
//       authors,
//       totalPages,
//       showBooksModal,
//       selectedAuthor,
//       selectedAuthorBooks,
//       toggleAdvancedSearch,
//       resetFilters,
//       applyFilters,
//       changePage,
//       showAuthorBooks,
//       closeBooksModal,
//       clearError,
//       formatCurrency,
//     };
//   },
// };
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError } from "@/utils/notifications";

export default {
  name: "AuthorList",
  components: { LoadingSpinner },

  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref(null);

    const showAdvancedSearch = ref(false);

    // Bộ lọc
    const filters = ref({
      tenTacGia: "",
      maTacGia: null,
      diaChi: "",
      namMin: null,
      namMax: null,
    });

    // Sắp xếp
    const sortBy = ref("tenTacGia-asc");

    // Phân trang
    const pagination = ref({
      total: 0,
      limit: 9,
      page: 1,
      totalPages: 1,
    });

    const authors = computed(() => store.getters["author/allAuthors"]);
    const totalPages = computed(() => pagination.value.totalPages);

    const selectedAuthor = ref(null);
    const showBooksModal = ref(false);
    const selectedAuthorBooks = computed(() => selectedAuthor.value?.Sach || []);

    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    const resetFilters = () => {
      filters.value = {
        tenTacGia: "",
        maTacGia: null,
        diaChi: "",
        namMin: null,
        namMax: null,
      };
      sortBy.value = "tenTacGia-asc";
      pagination.value.page = 1;
      applyFilters();
    };

    // 📌 API loading
    const applyFilters = async () => {
      loading.value = true;

      try {
        const [field, dir] = sortBy.value.split("-");

        const params = {
          ...filters.value,
          sortBy: field,
          order: dir.toUpperCase(),
          limit: pagination.value.limit,
          page: pagination.value.page,
        };

        const result = await store.dispatch("author/searchAuthors", params);

        pagination.value.total = result.total || 0;
        pagination.value.totalPages =
          Math.ceil(result.total / pagination.value.limit) || 1;
      } catch (err) {
        showError(err.response?.data?.message || err.message);
        error.value = "Không thể tải danh sách tác giả";
      } finally {
        loading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      pagination.value.page = page;
      applyFilters();
    };

    const showAuthorBooks = (author) => {
      selectedAuthor.value = author;
      showBooksModal.value = true;
    };

    const closeBooksModal = () => {
      showBooksModal.value = false;
      selectedAuthor.value = null;
    };

    const clearError = () => (error.value = null);

    // 🟩 ***QUAN TRỌNG*** — Sorting hoạt động không cần nhập filters
    watch([filters, sortBy], () => {
      pagination.value.page = 1;
      applyFilters();
    }, { deep: true });

    onMounted(() => {
      applyFilters();
    });

    return {
      loading,
      error,
      filters,
      sortBy,
      authors,
      showAdvancedSearch,
      pagination,
      totalPages,
      selectedAuthor,
      selectedAuthorBooks,
      showBooksModal,
      toggleAdvancedSearch,
      resetFilters,
      applyFilters,
      changePage,
      showAuthorBooks,
      closeBooksModal,
      clearError,
    };
  },
};
</script>

<style scoped>
.author-list {
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
