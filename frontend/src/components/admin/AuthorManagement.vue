<template>
  <div class="author-management container mt-4">
    <LoadingSpinner :show="loading" />

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-4">Quản lý tác giả</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
          <i class="fas fa-plus me-1"></i> Thêm tác giả
        </button>
    </div>

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
          <div class="col-md-4">
            <label class="form-label">Tên tác giả</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="filters.tenTacGia"
              placeholder="Nhập tên tác giả"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label">Mã tác giả</label>
            <input
              type="number"
              class="form-control"
              v-model.number="filters.maTacGia"
              placeholder="VD: 1"
            />
          </div>

          <div class="col-md-4">
            <label class="form-label">Địa chỉ</label>
            <input
              type="text"
              class="form-control"
              v-model.trim="filters.diaChi"
              placeholder="Nhập địa chỉ"
            />
          </div>

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

          <div class="col-md-4">
            <label class="form-label">Sắp xếp theo</label>
            <select class="form-select" v-model="sortBy">
              <option value="tenTacGia-asc">Tên tác giả (A-Z)</option>
              <option value="tenTacGia-desc">Tên tác giả (Z-A)</option>
              <option value="maTacGia-asc">Mã tác giả (tăng dần)</option>
              <option value="maTacGia-desc">Mã tác giả (giảm dần)</option>
            </select>
          </div>

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

    
    <!-- Danh sách tác giả -->
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã</th>
            <th>Tên tác giả</th>
            <th>Địa chỉ</th>
            <th>Số lượng sách</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="author in authors" :key="author.maTacGia">
            <td>{{ author.maTacGia }}</td>
            <td>{{ author.tenTacGia }}</td>
            <td>{{ author.diaChi || '—' }}</td>
            <td>
              <span class="badge bg-success">{{ author.Sach?.length || 0 }}</span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-info me-2"
                @click="editAuthor(author)"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn btn-sm btn-danger me-2"
                @click="confirmDelete(author)"
              >
                <i class="fas fa-trash"></i>
              </button>
              <button
                class="btn btn-sm btn-primary"
                @click="showAuthorBooks(author)"
              >
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!authors.length">
            <td colspan="5" class="text-center text-muted">Không có tác giả nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-3" v-if="pagination.total > pagination.limit">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
          <button class="page-link" @click="changePage(pagination.page - 1)">Trước</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">
            Trang {{ pagination.page }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
          <button class="page-link" @click="changePage(pagination.page + 1)">Sau</button>
        </li>
      </ul>
    </nav>

    <!-- Modal xem sách -->
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
            <button class="btn btn-secondary" @click="closeBooksModal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div
      class="modal fade"
      :class="{ show: showAddModal, 'd-block': showAddModal }"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingAuthor ? 'Sửa tác giả' : 'Thêm tác giả' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label">Tên tác giả</label>
                <input type="text" class="form-control" v-model.trim="form.tenTacGia" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model.trim="form.diaChi" />
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input
                  type="text"
                  class="form-control"
                  v-model.trim="form.soDienThoai"
                  placeholder="Nhập số điện thoại (10 số)"
                  required
                />
              </div>
              <div class="text-end">
                <button class="btn btn-secondary me-2" type="button" @click="closeModal">Hủy</button>
                <button class="btn btn-primary" type="submit">
                  {{ editingAuthor ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xác nhận xóa -->
    <div
      class="modal fade"
      :class="{ show: showDeleteModal, 'd-block': showDeleteModal }"
      tabindex="-1"
      style="background-color: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            Bạn có chắc chắn muốn xóa tác giả "<strong>{{ selectedAuthor?.tenTacGia }}</strong>"?
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button class="btn btn-danger" @click="handleDelete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError, showSuccess } from "@/utils/notifications";

export default {
  name: "AuthorManagement",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref(null);

    const showAdvancedSearch = ref(false);
    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const showBooksModal = ref(false);

    const filters = ref({
      tenTacGia: "",
      maTacGia: null,
      diaChi: "",
      namMin: null,
      namMax: null,
    });
    const sortBy = ref("tenTacGia-asc");

    const pagination = ref({ total: 0, limit: 10, page: 1, totalPages: 1 });

    const authors = computed(() => store.getters["author/allAuthors"]);
    const selectedAuthor = ref(null);
    const selectedAuthorBooks = computed(() => selectedAuthor.value?.Sach || []);
    const totalPages = computed(() => pagination.value.totalPages);

    const form = ref({ tenTacGia: "", diaChi: "" });
    const editingAuthor = ref(null);

    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    const resetFilters = () => {
      filters.value = { tenTacGia: "", maTacGia: null, diaChi: "", namMin: null, namMax: null };
      sortBy.value = "tenTacGia-asc";
      pagination.value.page = 1;
      applyFilters();
    };

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
        pagination.value.totalPages = Math.ceil(result.total / pagination.value.limit) || 1;
      } catch (err) {
        error.value = "Không thể tải danh sách tác giả";
        showError(err.response?.data?.message || err.message);
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
      selectedAuthor.value = null;
      showBooksModal.value = false;
    };

    const handleSubmit = async () => {
      try {
        if (!form.value.tenTacGia) return showError("Tên tác giả là bắt buộc");
        if (!form.value.soDienThoai) return showError("Số điện thoại là bắt buộc");

        // 🟠 Kiểm tra hợp lệ số điện thoại
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(form.value.soDienThoai)) {
          return showError("Số điện thoại phải gồm đúng 10 chữ số và không chứa ký tự khác");
        }

        if (editingAuthor.value) {
          await store.dispatch("author/updateAuthor", {
            id: editingAuthor.value.maTacGia,
            authorData: form.value,
          });
          showSuccess("Cập nhật tác giả thành công");
        } else {
          await store.dispatch("author/createAuthor", form.value);
          showSuccess("Thêm tác giả thành công");
        }

        closeModal();
        applyFilters();
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      }
    };


    const editAuthor = (author) => {
      editingAuthor.value = author;
      form.value = { tenTacGia: author.tenTacGia, diaChi: author.diaChi, soDienThoai: author.soDienThoai, };
      showAddModal.value = true;
    };

    const confirmDelete = (author) => {
      selectedAuthor.value = author;
      showDeleteModal.value = true;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch("author/deleteAuthor", selectedAuthor.value.maTacGia);
        showSuccess("Xóa tác giả thành công");
        closeDeleteModal();
        applyFilters();
      } catch (err) {
        showError(err.response?.data?.message || err.message);
      }
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingAuthor.value = null;
      form.value = { tenTacGia: "", diaChi: "", soDienThoai: "" };
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      selectedAuthor.value = null;
    };

    const clearError = () => (error.value = null);

    const formatCurrency = (val) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val || 0);

    watch([filters, sortBy], () => {
      pagination.value.page = 1;
      applyFilters();
    }, { deep: true });

    onMounted(() => applyFilters());

    return {
      loading,
      error,
      filters,
      sortBy,
      authors,
      showAdvancedSearch,
      showAddModal,
      showDeleteModal,
      showBooksModal,
      selectedAuthor,
      selectedAuthorBooks,
      pagination,
      totalPages,
      toggleAdvancedSearch,
      resetFilters,
      applyFilters,
      changePage,
      showAuthorBooks,
      closeBooksModal,
      form,
      editingAuthor,
      handleSubmit,
      editAuthor,
      confirmDelete,
      handleDelete,
      closeModal,
      closeDeleteModal,
      clearError,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.table th {
  font-weight: 600;
  color: #495057;
}
.modal.show {
  display: block;
}
.card {
  border-radius: 10px;
}
</style>
