<template>
  <div class="book-management">
    <LoadingSpinner :show="loading" />

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Quản lý sách</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="fas fa-plus"></i> Thêm sách mới
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Tìm kiếm nâng cao -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Tìm kiếm & Lọc sách</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleAdvancedSearch">
              {{ showAdvancedSearch ? 'Ẩn' : 'Hiện' }} bộ lọc
            </button>
          </div>
          <div class="card-body" v-show="showAdvancedSearch">
            <div class="row g-3">
              <!-- Tên sách -->
              <div class="col-md-4">
                <label class="form-label">Tên sách</label>
                <input type="text" class="form-control" v-model.trim="filters.tenSach" placeholder="Nhập tên sách">
              </div>

              <!-- Mã sách -->
              <div class="col-md-4">
                <label class="form-label">Mã sách</label>
                <input type="text" class="form-control" v-model.trim="filters.maSach" placeholder="VD: 1001">
              </div>

              <!-- Tác giả -->
              <div class="col-md-4">
                <label class="form-label">Tác giả</label>
                <select class="form-select" v-model="filters.maTacGia">
                  <option :value="null">Tất cả</option>
                  <option v-for="a in authors" :key="a.maTacGia" :value="a.maTacGia">
                    {{ a.tenTacGia }}
                  </option>
                </select>
              </div>

              <!-- Nhà xuất bản -->
              <div class="col-md-4">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="filters.maNXB">
                  <option :value="null">Tất cả</option>
                  <option v-for="p in publishers" :key="p.maNXB" :value="p.maNXB">
                    {{ p.tenNXB }}
                  </option>
                </select>
              </div>

              <!-- Thể loại -->
              <div class="col-md-4">
                <label class="form-label">Thể loại</label>
                <select class="form-select" v-model="filters.maTheLoai">
                  <option :value="null">Tất cả</option>
                  <option v-for="c in categories" :key="c.maTheLoai" :value="c.maTheLoai">
                    {{ c.tenTheLoai }}
                  </option>
                </select>
              </div>

              <!-- Năm xuất bản -->
              <div class="col-md-4">
                <label class="form-label">Năm xuất bản</label>
                <div class="row">
                  <div class="col">
                    <input type="number" class="form-control" v-model.number="filters.namXuatBanMin" placeholder="Từ">
                  </div>
                  <div class="col">
                    <input type="number" class="form-control" v-model.number="filters.namXuatBanMax" placeholder="Đến">
                  </div>
                </div>
              </div>

              <!-- Nguồn gốc -->
              <div class="col-md-4">
                <label class="form-label">Nguồn gốc</label>
                <input type="text" class="form-control" v-model.trim="filters.nguonGoc" placeholder="Việt Nam...v.v">
              </div>

              <!-- Sắp xếp -->
              <div class="col-md-4">
                <label class="form-label">Sắp xếp theo</label>
                <select class="form-select" v-model="sortBy">
                  <option value="tenSach-asc">Tên sách (A-Z)</option>
                  <option value="tenSach-desc">Tên sách (Z-A)</option>
                  <option value="namXuatBan-desc">Năm XB mới nhất</option>
                  <option value="namXuatBan-asc">Năm XB cũ nhất</option>
                  <option value="soLuongHienCo-desc">Số lượng (giảm)</option>
                  <option value="soLuongHienCo-asc">Số lượng (tăng)</option>
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

    <!-- Danh sách sách -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Mã sách</th>
            <th>Tên sách</th>
            <th>Nhà xuất bản</th>
            <th>Tác giả</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm XB</th>
            <th>Nguồn gốc</th>
            <th>Hình ảnh</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.maSach">
            <td>{{ book.maSach }}</td>
            <td>{{ book.tenSach }}</td>
            <td>{{ book.NhaXuatBan?.tenNXB || 'N/A' }}</td>
            <td>{{ book.TacGia?.tenTacGia || 'N/A' }}</td>
            <td>{{ formatCurrency(book.donGia) }}</td>
            <td :class="getQuantityClass(book.soLuongHienCo)">
              {{ book.soLuongHienCo }}
              <br>
              <small v-if="book.soLuongHienCo <= 3" class="text-muted">
                {{ getQuantityMessage(book.soLuongHienCo) }}
              </small>
            </td>
            <td>{{ book.namXuatBan }}</td>
            <td>{{ book.nguonGoc }}</td>
            <td>
              <img :src="`${API_URL}/${book.imagePath || 'uploads/default-book.jpg'}`" style="max-width: 100px;" alt="Book cover">
            </td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editBook(book)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(book)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-4" v-if="pagination.total > pagination.limit">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.offset === 0 }">
          <button class="page-link" @click="changePage(pagination.offset - pagination.limit)" :disabled="pagination.offset === 0">
            Trước
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.offset + pagination.limit >= pagination.total }">
          <button class="page-link" @click="changePage(pagination.offset + pagination.limit)">
            Sau
          </button>
        </li>
      </ul>
    </nav>

    <!-- Add/Edit Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingBook ? 'Sửa thông tin sách' : 'Thêm sách mới' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3" v-if="editingBook">
                <label class="form-label">Mã sách <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="bookForm.maSach" readonly>
              </div>
              <div class="mb-3">
                <label class="form-label">Tên sách <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': errors.tenSach }" v-model="bookForm.tenSach" required @input="validateField('tenSach')">
                <div class="invalid-feedback" v-if="errors.tenSach">{{ errors.tenSach }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Nhà xuất bản <span class="text-danger">*</span></label>
                <select class="form-select" :class="{ 'is-invalid': errors.maNXB }" v-model="bookForm.maNXB" required @change="validateField('maNXB')">
                  <option value="">Chọn nhà xuất bản</option>
                  <option v-for="p in publishers" :key="p.maNXB" :value="p.maNXB">{{ p.tenNXB }}</option>
                </select>
                <div class="invalid-feedback" v-if="errors.maNXB">{{ errors.maNXB }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tác giả <span class="text-danger">*</span></label>
                <select class="form-select" :class="{ 'is-invalid': errors.maTacGia }" v-model="bookForm.maTacGia" required @change="validateField('maTacGia')">
                  <option value="">Chọn tác giả</option>
                  <option v-for="a in authors" :key="a.maTacGia" :value="a.maTacGia">{{ a.tenTacGia }}</option>
                </select>
                <div class="invalid-feedback" v-if="errors.maTacGia">{{ errors.maTacGia }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Thể loại <span class="text-danger">*</span></label>
                <select class="form-select" :class="{ 'is-invalid': errors.maTheLoai }" v-model="bookForm.maTheLoai" required @change="validateField('maTheLoai')">
                  <option value="">Chọn thể loại</option>
                  <option v-for="c in categories" :key="c.maTheLoai" :value="c.maTheLoai">{{ c.tenTheLoai }}</option>
                </select>
                <div class="invalid-feedback" v-if="errors.maTheLoai">{{ errors.maTheLoai }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn giá <span class="text-danger">*</span></label>
                <input type="number" class="form-control" :class="{ 'is-invalid': errors.donGia }" v-model.number="bookForm.donGia" min="0" required @input="validateField('donGia')">
                <div class="invalid-feedback" v-if="errors.donGia">{{ errors.donGia }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Số lượng hiện có <span class="text-danger">*</span></label>
                <input type="number" class="form-control" :class="{ 'is-invalid': errors.soLuongHienCo }" v-model.number="bookForm.soLuongHienCo" min="0" required @input="validateField('soLuongHienCo')">
                <div class="invalid-feedback" v-if="errors.soLuongHienCo">{{ errors.soLuongHienCo }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Năm xuất bản <span class="text-danger">*</span></label>
                <input type="number" class="form-control" :class="{ 'is-invalid': errors.namXuatBan }" v-model.number="bookForm.namXuatBan" min="1900" :max="new Date().getFullYear()" required @input="validateField('namXuatBan')">
                <div class="invalid-feedback" v-if="errors.namXuatBan">{{ errors.namXuatBan }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Nguồn gốc <span class="text-danger">*</span></label>
                <input type="text" class="form-control" :class="{ 'is-invalid': errors.nguonGoc }" v-model="bookForm.nguonGoc" required @input="validateField('nguonGoc')">
                <div class="invalid-feedback" v-if="errors.nguonGoc">{{ errors.nguonGoc }}</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Hình ảnh bìa sách</label>
                <input type="file" class="form-control" @change="handleImageUpload" accept="image/*">
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-secondary me-2" @click="closeModal">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="loading || Object.keys(errors).length > 0">
                  {{ loading ? 'Đang xử lý...' : (editingBook ? 'Cập nhật' : 'Thêm mới') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showAddModal"></div>

    <!-- Delete Confirmation Modal -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa sách "<strong>{{ selectedBook?.tenSach }}</strong>" không?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Hủy</button>
            <button type="button" class="btn btn-danger" @click="handleDelete" :disabled="loading">
              {{ loading ? 'Đang xử lý...' : 'Xóa' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showDeleteModal"></div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError, showSuccess } from '@/utils/notifications';

export default {
  name: 'BookManagement',
  components: { LoadingSpinner },
  setup() {
    const store = useStore();
    const API_URL = import.meta.env.VITE_API_IMAGE_URL;

    // === State ===
    const loading = computed(() => store.getters['book/isLoading']);
    const error = computed(() => store.getters['book/error']);
    const books = computed(() => store.getters['book/allBooks'] || []);
    const publishers = computed(() => store.getters['publisher/allPublishers'] || []);
    const authors = computed(() => store.getters['author/allAuthors'] || []);
    const categories = computed(() => store.getters['category/allCategories'] || []);

    const showAddModal = ref(false);
    const showDeleteModal = ref(false);
    const editingBook = ref(null);
    const selectedBook = ref(null);
    const errors = ref({});
    const imageFile = ref(null);

    // === Tìm kiếm nâng cao ===
    const showAdvancedSearch = ref(false);
    const filters = ref({
      tenSach: '', maSach: '', maTacGia: null, maNXB: null,
      maTheLoai: null, namXuatBanMin: null, namXuatBanMax: null, nguonGoc: ''
    });
    const sortBy = ref('tenSach-asc');
    const pagination = ref({ total: 0, limit: 10, offset: 0 });
    const currentPage = computed(() => Math.floor(pagination.value.offset / pagination.value.limit) + 1);
    const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit) || 1);

    // === Form sách ===
    const bookForm = ref({
      maSach: '', tenSach: '', maNXB: '', maTacGia: '', maTheLoai: '',
      donGia: null, soLuongHienCo: null, namXuatBan: new Date().getFullYear(), nguonGoc: ''
    });

    // === Hàm tìm kiếm nâng cao ===
    const applyFilters = async () => {
      try {
        const params = {};
        if (filters.value.tenSach?.trim()) params.tenSach = filters.value.tenSach.trim();
        if (filters.value.maSach?.trim()) {
          const num = parseInt(filters.value.maSach.trim());
          if (!isNaN(num)) params.maSach = num;
        }
        if (filters.value.maTacGia != null) params.maTacGia = filters.value.maTacGia;
        if (filters.value.maNXB != null) params.maNXB = filters.value.maNXB;
        if (filters.value.maTheLoai != null) params.maTheLoai = filters.value.maTheLoai;
        if (filters.value.namXuatBanMin != null) params.namXuatBanMin = filters.value.namXuatBanMin;
        if (filters.value.namXuatBanMax != null) params.namXuatBanMax = filters.value.namXuatBanMax;
        if (filters.value.nguonGoc?.trim()) params.nguonGoc = filters.value.nguonGoc.trim();

        const [field, dir] = sortBy.value.split('-');
        params.sortBy = field;
        params.order = dir.toUpperCase();
        params.limit = pagination.value.limit;
        params.offset = pagination.value.offset;

        const result = await store.dispatch('book/fetchBooksAdvanced', params);
        pagination.value.total = result.total || result.data?.length || 0;
      } catch (err) {
        showError('Không thể tải danh sách sách');
      }
    };


    const resetFilters = () => {
      filters.value = { tenSach: '', maSach: '', maTacGia: null, maNXB: null, maTheLoai: null, namXuatBanMin: null, namXuatBanMax: null, nguonGoc: '' };
      sortBy.value = 'tenSach-asc';
      pagination.value.offset = 0;
      applyFilters();
    };

    const changePage = (newOffset) => {
      if (newOffset < 0 || newOffset >= pagination.value.total) return;
      pagination.value.offset = newOffset;
      applyFilters();
    };

    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    // === Watch thay đổi bộ lọc ===
    watch([filters, sortBy], () => {
      pagination.value.offset = 0;
      applyFilters();
    }, { deep: true });

    // === Khởi tạo ===
    onMounted(async () => {
      await Promise.all([
        store.dispatch('author/fetchAuthors'),
        store.dispatch('publisher/fetchPublishers'),
        store.dispatch('category/fetchCategories')
      ]);
      await applyFilters();
    });

    // === Validate & Form ===
    const validateField = (field) => {
      const newErrors = { ...errors.value };
      const currentYear = new Date().getFullYear();

      if (field === 'tenSach') delete newErrors.tenSach;
      if (field === 'maNXB') delete newErrors.maNXB;
      if (field === 'maTacGia') delete newErrors.maTacGia;
      if (field === 'maTheLoai') delete newErrors.maTheLoai;
      if (field === 'donGia') delete newErrors.donGia;
      if (field === 'soLuongHienCo') delete newErrors.soLuongHienCo;
      if (field === 'namXuatBan') delete newErrors.namXuatBan;
      if (field === 'nguonGoc') delete newErrors.nguonGoc;

      if (field === 'tenSach' && !bookForm.value.tenSach) newErrors.tenSach = 'Tên sách là bắt buộc';
      if (field === 'maNXB' && !bookForm.value.maNXB) newErrors.maNXB = 'Nhà xuất bản là bắt buộc';
      if (field === 'maTacGia' && !bookForm.value.maTacGia) newErrors.maTacGia = 'Tác giả là bắt buộc';
      if (field === 'maTheLoai' && !bookForm.value.maTheLoai) newErrors.maTheLoai = 'Thể loại là bắt buộc';
      if (field === 'donGia' && (bookForm.value.donGia === null || bookForm.value.donGia < 0)) newErrors.donGia = 'Đơn giá không hợp lệ';
      if (field === 'soLuongHienCo' && (bookForm.value.soLuongHienCo === null || bookForm.value.soLuongHienCo < 0)) newErrors.soLuongHienCo = 'Số lượng không hợp lệ';
      if (field === 'namXuatBan' && (bookForm.value.namXuatBan < 1900 || bookForm.value.namXuatBan > currentYear)) newErrors.namXuatBan = `Năm từ 1900 đến ${currentYear}`;
      if (field === 'nguonGoc' && !bookForm.value.nguonGoc) newErrors.nguonGoc = 'Nguồn gốc là bắt buộc';

      errors.value = newErrors;
    };

    const validateForm = () => {
      const newErrors = {};
      const currentYear = new Date().getFullYear();
      if (!bookForm.value.tenSach) newErrors.tenSach = 'Tên sách là bắt buộc';
      if (!bookForm.value.maNXB) newErrors.maNXB = 'Nhà xuất bản là bắt buộc';
      if (!bookForm.value.maTacGia) newErrors.maTacGia = 'Tác giả là bắt buộc';
      if (!bookForm.value.maTheLoai) newErrors.maTheLoai = 'Thể loại là bắt buộc';
      if (bookForm.value.donGia === null || bookForm.value.donGia < 0) newErrors.donGia = 'Đơn giá không hợp lệ';
      if (bookForm.value.soLuongHienCo === null || bookForm.value.soLuongHienCo < 0) newErrors.soLuongHienCo = 'Số lượng không hợp lệ';
      if (bookForm.value.namXuatBan < 1900 || bookForm.value.namXuatBan > currentYear) newErrors.namXuatBan = `Năm từ 1900 đến ${currentYear}`;
      if (!bookForm.value.nguonGoc) newErrors.nguonGoc = 'Nguồn gốc là bắt buộc';
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const closeModal = () => {
      showAddModal.value = false;
      editingBook.value = null;
      errors.value = {};
      bookForm.value = { maSach: '', tenSach: '', maNXB: '', maTacGia: '', maTheLoai: '', donGia: null, soLuongHienCo: null, namXuatBan: new Date().getFullYear(), nguonGoc: '' };
      imageFile.value = null;
    };

    const editBook = (book) => {
      editingBook.value = book;
      bookForm.value = {
        maSach: book.maSach,
        tenSach: book.tenSach,
        maNXB: book.maNXB || book.NhaXuatBan?.maNXB || '',
        maTacGia: book.maTacGia || book.TacGia?.maTacGia || '',
        maTheLoai: book.maTheLoai || book.TheLoai?.maTheLoai || '',
        donGia: book.donGia ?? null,
        soLuongHienCo: book.soLuongHienCo ?? null,
        namXuatBan: book.namXuatBan,
        nguonGoc: book.nguonGoc
      };
      imageFile.value = null;
      showAddModal.value = true;
    };

    const confirmDelete = (book) => {
      selectedBook.value = book;
      showDeleteModal.value = true;
    };

    const handleDelete = async () => {
      try {
        await store.dispatch('book/deleteBook', selectedBook.value.maSach);
        await applyFilters();
        showDeleteModal.value = false;
        selectedBook.value = null;
        showSuccess('Xóa sách thành công');
      } catch (error) {
        showError(error.message || 'Lỗi khi xóa sách');
      }
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;
      try {
        const formData = new FormData();
        if (editingBook.value) formData.append('maSach', bookForm.value.maSach);
        formData.append('tenSach', bookForm.value.tenSach);
        formData.append('maNXB', bookForm.value.maNXB);
        formData.append('maTacGia', bookForm.value.maTacGia);
        formData.append('maTheLoai', bookForm.value.maTheLoai);
        formData.append('donGia', bookForm.value.donGia);
        formData.append('soQuyen', bookForm.value.soLuongHienCo);
        formData.append('namXuatBan', bookForm.value.namXuatBan);
        formData.append('nguonGoc', bookForm.value.nguonGoc);
        if (imageFile.value) formData.append('image', imageFile.value);

        if (editingBook.value) {
          await store.dispatch('book/updateBook', { id: editingBook.value.maSach, bookData: formData });
          showSuccess('Cập nhật sách thành công');
        } else {
          await store.dispatch('book/createBook', formData);
          showSuccess('Thêm sách mới thành công');
        }
        await applyFilters();
        closeModal();
      } catch (error) {
        let msg = error.response?.data?.message || 'Lỗi khi lưu sách';
        if (error.response?.data?.code === 11000) msg = 'Mã sách đã tồn tại';
        showError(msg);
        if (error.response?.data?.errors) errors.value = { ...errors.value, ...error.response.data.errors };
      }
    };

    const handleImageUpload = (e) => { imageFile.value = e.target.files[0]; };
    const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
    const getQuantityClass = (q) => q === 0 ? 'text-danger fw-bold' : q <= 3 ? 'text-warning fw-bold' : 'text-success';
    const getQuantityMessage = (q) => q === 0 ? 'Hết sách' : q <= 3 ? 'Sắp hết sách' : '';
    const clearError = () => store.commit('book/SET_ERROR', null);

    return {
      loading, error, books, publishers, authors, categories,
      showAddModal, showDeleteModal, editingBook, selectedBook,
      bookForm, errors, imageFile, API_URL,
      showAdvancedSearch, filters, sortBy, pagination, currentPage, totalPages,
      applyFilters, resetFilters, changePage, toggleAdvancedSearch,
      closeModal, editBook, confirmDelete, handleDelete, handleSubmit,
      handleImageUpload, formatCurrency, getQuantityClass, getQuantityMessage, clearError,
      validateField
    };
  }
};
</script>

<style scoped>
.modal { background-color: rgba(0, 0, 0, 0.5); }
.form-label { font-weight: 500; }
.text-danger { font-weight: bold; background-color: rgba(255, 0, 0, 0.1); }
.text-warning { background-color: rgba(255, 193, 7, 0.1); }
.text-success { color: #198754 !important; }
.text-muted { font-size: 0.85em; font-style: italic; }
</style>