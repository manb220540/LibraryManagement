
<template>
  <div class="publisher-management container mt-4">
    <LoadingSpinner :show="loading" />

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý nhà xuất bản</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm nhà xuất bản mới
      </button>
    </div>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Bộ lọc nâng cao -->
    <div class="card shadow-sm mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Tìm kiếm & Lọc nhà xuất bản</h5>
        <button class="btn btn-sm btn-outline-secondary" @click="toggleAdvancedSearch">
          {{ showAdvancedSearch ? "Ẩn" : "Hiện" }} bộ lọc
        </button>
      </div>
      <div class="card-body" v-show="showAdvancedSearch">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Tên nhà xuất bản</label>
            <input type="text" class="form-control" v-model.trim="filters.tenNXB" placeholder="Nhập tên NXB" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Mã NXB</label>
            <input type="number" class="form-control" v-model.number="filters.maNXB" placeholder="VD: 1" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Địa chỉ</label>
            <input type="text" class="form-control" v-model.trim="filters.diaChi" placeholder="Nhập địa chỉ" />
          </div>
          <div class="col-md-4">
            <label class="form-label">Năm xuất bản sách</label>
            <div class="row">
              <div class="col">
                <input type="number" class="form-control" v-model.number="filters.namMin" placeholder="Từ" />
              </div>
              <div class="col">
                <input type="number" class="form-control" v-model.number="filters.namMax" placeholder="Đến" />
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Sắp xếp theo</label>
            <select class="form-select" v-model="sortBy">
              <option value="tenNXB-asc">Tên NXB (A-Z)</option>
              <option value="tenNXB-desc">Tên NXB (Z-A)</option>
              <option value="maNXB-asc">Mã NXB (tăng dần)</option>
              <option value="maNXB-desc">Mã NXB (giảm dần)</option>
            </select>
          </div>
          <div class="col-12 text-end mt-3">
            <button class="btn btn-outline-secondary me-2" @click="resetFilters">Xóa bộ lọc</button>
            <button class="btn btn-primary" @click="applyFilters">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    
  

    <!-- Bảng danh sách -->
    <div class="table-responsive mb-4">
      <table class="table table-striped align-middle">
        <thead class="table-light">
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th>Số sách</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in publishers" :key="publisher.maNXB">
            <td>{{ publisher.maNXB }}</td>
            <td>{{ publisher.tenNXB }}</td>
            <td>{{ publisher.diaChi }}</td>
            <td>
              <span class="badge bg-success">{{ publisher.Sach?.length || 0 }}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editPublisher(publisher)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger me-2" @click="confirmDelete(publisher)">
                <i class="fas fa-trash"></i>
              </button>
              <button class="btn btn-sm btn-primary" @click="showPublisherBooks(publisher)">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!publishers.length">
            <td colspan="5" class="text-center text-muted">Không có nhà xuất bản nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mb-4" v-if="pagination.total > pagination.limit">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
          <button class="page-link" @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1">
            Trước
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">Trang {{ pagination.page }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.page === totalPages }">
          <button class="page-link" @click="changePage(pagination.page + 1)" :disabled="pagination.page === totalPages">
            Sau
          </button>
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
                  <tr v-if="selectedPublisherBooks.length === 0">
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
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingPublisher ? "Sửa thông tin nhà xuất bản" : "Thêm nhà xuất bản mới" }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3" v-if="editingPublisher">
                <label class="form-label">Mã NXB</label>
                <input type="text" class="form-control" v-model="publisherForm.maNXB" readonly />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên NXB <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.tenNXB }"
                  v-model="publisherForm.tenNXB"
                  @input="validateField('tenNXB')"
                />
                <div class="invalid-feedback" v-if="errors.tenNXB">{{ errors.tenNXB }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.diaChi }"
                  v-model="publisherForm.diaChi"
                  @input="validateField('diaChi')"
                />
                <div class="invalid-feedback" v-if="errors.diaChi">{{ errors.diaChi }}</div>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading || Object.keys(errors).length > 0"
                >
                  {{ loading ? "Đang xử lý..." : editingPublisher ? "Cập nhật" : "Thêm mới" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xóa -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            <p>
              Bạn có chắc chắn muốn xóa nhà xuất bản
              "<strong>{{ selectedPublisher?.tenNXB }}</strong>" không?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
            <button type="button" class="btn btn-danger" @click="handleDelete" :disabled="loading">
              {{ loading ? "Đang xử lý..." : "Xóa" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show" v-if="showAddModal || showDeleteModal || showBooksModal"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { showError, showSuccess } from "@/utils/notifications";

export default {
  name: "PublisherManagement",
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref(null);
    const showAdvancedSearch = ref(false);
    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const showBooksModal = ref(false); // Thêm modal xem sách
    const editingPublisher = ref(null);
    const selectedPublisher = ref(null);
    const publisherForm = ref({ maNXB: "", tenNXB: "", diaChi: "" });
    const errors = ref({});

    // Lọc và sắp xếp
    const filters = ref({
      tenNXB: "",
      maNXB: null,
      diaChi: "",
      namMin: null,
      namMax: null,
    });
    const sortBy = ref("tenNXB-asc");

    // Phân trang
    const pagination = ref({
      total: 0,
      limit: 10,
      page: 1,
      totalPages: 1,
    });

    const publishers = computed(() => store.getters["publisher/allPublishers"] || []);
    const totalPages = computed(() => pagination.value.totalPages);

    // Danh sách sách của NXB đang chọn
    const selectedPublisherBooks = computed(() => selectedPublisher.value?.Sach || []);

    // === HÀM XỬ LÝ ===
    const toggleAdvancedSearch = () => (showAdvancedSearch.value = !showAdvancedSearch.value);

    const resetFilters = () => {
      filters.value = { tenNXB: "", maNXB: null, diaChi: "", namMin: null, namMax: null };
      sortBy.value = "tenNXB-asc";
      pagination.value.page = 1;
      applyFilters();
    };

    const applyFilters = async () => {
      loading.value = true;
      try {
        const hasFilter = Object.values(filters.value).some(
          (v) => v !== null && v !== "" && v !== undefined
        );
        const [field, dir] = sortBy.value.split("-");
        const params = {
          ...filters.value,
          sortBy: field,
          order: dir.toUpperCase(),
          limit: pagination.value.limit,
          page: pagination.value.page,
        };
        const result = hasFilter
          ? await store.dispatch("publisher/searchPublishers", params)
          : await store.dispatch("publisher/fetchPublishers");

        if (result.pagination) {
          pagination.value = {
            ...pagination.value,
            total: result.pagination.total,
            page: result.pagination.page,
            totalPages: result.pagination.totalPages,
          };
        } else {
          pagination.value.total = publishers.value.length;
          pagination.value.totalPages = 1;
        }
      } catch (err) {
        showError("Lỗi tải danh sách NXB: " + (err.response?.data?.message || err.message));
      } finally {
        loading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      pagination.value.page = page;
      applyFilters();
    };

    const validateField = (field) => {
      const e = { ...errors.value };
      if (field === "tenNXB" && !publisherForm.value.tenNXB) {
        e.tenNXB = "Tên nhà xuất bản là bắt buộc";
      } else if (field === "diaChi" && (!publisherForm.value.diaChi || publisherForm.value.diaChi.length < 5)) {
        e.diaChi = "Địa chỉ phải có ít nhất 5 ký tự";
      } else {
        delete e[field];
      }
      errors.value = e;
    };

    const validateForm = () => {
      const e = {};
      if (!publisherForm.value.tenNXB) e.tenNXB = "Tên nhà xuất bản là bắt buộc";
      if (!publisherForm.value.diaChi || publisherForm.value.diaChi.length < 5)
        e.diaChi = "Địa chỉ phải có ít nhất 5 ký tự";
      errors.value = e;
      return Object.keys(e).length === 0;
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingPublisher.value = null;
      publisherForm.value = { maNXB: "", tenNXB: "", diaChi: "" };
      errors.value = {};
    };

    const editPublisher = (publisher) => {
      editingPublisher.value = publisher;
      publisherForm.value = { ...publisher };
      showAddModal.value = true;
    };

    const confirmDelete = (publisher) => {
      selectedPublisher.value = publisher;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      selectedPublisher.value = null;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch("publisher/deletePublisher", selectedPublisher.value.maNXB);
        await applyFilters();
        showSuccess("Xóa nhà xuất bản thành công");
      } catch (err) {
        showError("Lỗi khi xóa: " + (err.response?.data?.message || err.message));
      } finally {
        closeDeleteModal();
      }
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        showError("Vui lòng kiểm tra lại các trường thông tin");
        return;
      }
      try {
        if (editingPublisher.value) {
          await store.dispatch("publisher/updatePublisher", {
            id: editingPublisher.value.maNXB,
            publisherData: { ...publisherForm.value },
          });
          showSuccess("Cập nhật thành công");
        } else {
          await store.dispatch("publisher/createPublisher", { ...publisherForm.value });
          showSuccess("Thêm nhà xuất bản thành công");
        }
        closeModal();
        await applyFilters();
      } catch (err) {
        showError("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
      }
    };

    const clearError = () => store.commit("publisher/SET_ERROR", null);

    // === XEM SÁCH ===
    const showPublisherBooks = (publisher) => {
      if (!publisher || !publisher.maNXB) return;
      selectedPublisher.value = publisher;
      showBooksModal.value = true;
    };

    const closeBooksModal = () => {
      showBooksModal.value = false;
      selectedPublisher.value = null;
    };

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
      showAddModal,
      showDeleteModal,
      showBooksModal,
      showAdvancedSearch,
      editingPublisher,
      publisherForm,
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
      validateField,
      handleSubmit,
      editPublisher,
      confirmDelete,
      closeModal,
      closeDeleteModal,
      handleDelete,
      clearError,
      errors,
      showPublisherBooks,
      closeBooksModal,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.table th {
  font-weight: 600;
}
.card {
  border: 1px solid #ddd;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
