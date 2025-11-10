<template>
  <div class="book-list">
    <LoadingSpinner :show="loading" />
    <h2>Danh sách sách</h2>

    <!-- Thông báo lỗi -->
    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="clearError"></button>
    </div>

    <!-- Modal xác nhận mượn sách -->
    <div class="modal" tabindex="-1" :class="{ 'd-block': showConfirmModal }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận mượn sách</h5>
            <button type="button" class="btn-close" @click="closeConfirmModal"></button>
          </div>
          <div class="modal-body">
            <p>Bạn muốn mượn các sách sau?</p>
            <ul>
              <li v-for="item in borrowCart" :key="item.maSach">
                {{ item.tenSach }} - Số lượng:
                <input
                  type="number"
                  v-model.number="item.soLuongSachMuon"
                  :min="1"
                  :max="item.soLuongHienCo"
                  class="form-control d-inline-block w-auto"
                  @input="validateQuantity(item)"
                />
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeConfirmModal">Hủy</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleConfirmBorrow"
              :disabled="loading || !isValidCart"
            >
              {{ loading ? 'Đang xử lý...' : 'Mượn sách' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showConfirmModal"></div>

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
                <input type="text" class="form-control" v-model.trim="filters.nguonGoc" placeholder="Nhập nguồn gốc">
              </div>

              <!-- Sắp xếp -->
              <div class="col-md-4">
                <label class="form-label">Sắp xếp theo</label>
                <select class="form-select" v-model="sortBy">
                  <option value="tenSach-asc">Tên sách (A-Z)</option>
                  <option value="tenSach-desc">Tên sách (Z-A)</option>
                  <option value="namXuatBan-desc">Năm XB mới nhất</option>
                  <option value="namXuatBan-asc">Năm XB cũ nhất</option>
                  <option value="soLuongHienCo-desc">Số lượng còn (giảm)</option>
                  <option value="soLuongHienCo-asc">Số lượng còn (tăng)</option>
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

    <!-- Nút giỏ mượn -->
    <div class="row mb-3">
      <div class="col-12 text-end">
        <button
          class="btn btn-primary"
          @click="showBorrowCart"
          :disabled="!borrowCart.length || loading"
        >
          {{ borrowCart.length ? `Xem giỏ mượn (${borrowCart.length})` : 'Giỏ mượn trống' }}
        </button>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="book in books" :key="book.maSach">
        <div class="card h-100">
          <div class="card-img-top" style="height: 200px; overflow: hidden;">
            <img
              :src="`${API_URL}/${book.imagePath || 'Uploads/default-book.jpg'}`"
              style="width: 100%; height: 100%; object-fit: cover;"
              alt="Book cover"
            />
          </div>
          <div class="card-body">
            <h5 class="card-title">{{ book.tenSach }}</h5>
            <p class="card-text"><small class="text-muted">Mã sách: {{ book.maSach }}</small></p>
            <p class="card-text"><strong>Nhà xuất bản:</strong> {{ book.NhaXuatBan?.tenNXB || 'Chưa có NXB' }}</p>
            <p class="card-text"><strong>Tác giả:</strong> {{ book.TacGia?.tenTacGia || 'Chưa có tác giả' }}</p>
            <p class="card-text"><strong>Thể loại:</strong> {{ book.TheLoai?.tenTheLoai || 'Chưa có thể loại' }}</p>
            <p class="card-text"><strong>Năm xuất bản:</strong> {{ book.namXuatBan }}</p>
            <p class="card-text"><strong>Nguồn gốc:</strong> {{ book.nguonGoc }}</p>
            <p class="card-text"><strong>Số quyển còn:</strong> {{ book.soLuongHienCo }}</p>
          </div>
          <div class="card-footer">
            <button
              class="btn btn-primary w-100"
              @click="addToBorrowCart(book)"
              :disabled="book.soLuongHienCo === 0 || loading || isBookInCart(book.maSach)"
            >
              {{ isBookInCart(book.maSach) ? 'Đã thêm' : 'Thêm vào giỏ mượn' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-4" v-if="pagination.total > pagination.limit">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: pagination.offset === 0 }">
          <button
            class="page-link"
            @click="changePage(pagination.offset - pagination.limit)"
            :disabled="pagination.offset === 0"
          >
            Trước
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
        </li>
        <li class="page-item" :class="{ disabled: pagination.offset + pagination.limit >= pagination.total }">
          <button
            class="page-link"
            @click="changePage(pagination.offset + pagination.limit)"
            :disabled="pagination.offset + pagination.limit >= pagination.total"
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showError } from '@/utils/notifications';

export default {
  name: 'BookList',
  components: { LoadingSpinner },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();
    const API_URL = import.meta.env.VITE_API_IMAGE_URL;

    // === State ===
    const error = ref(null);
    const loading = ref(false);
    const borrowCart = ref([]);
    const showConfirmModal = ref(false);

    // === Bộ lọc & sắp xếp ===
    const showAdvancedSearch = ref(false);
    const filters = ref({
      tenSach: '',
      maSach: '',
      maTacGia: null,
      maNXB: null,
      maTheLoai: null,
      namXuatBanMin: null,
      namXuatBanMax: null,
      nguonGoc: ''
    });
    const sortBy = ref('tenSach-asc');

    // === Phân trang ===
    const pagination = ref({
      total: 0,
      limit: 20,
      offset: 0
    });

    // === Danh sách phụ ===
    const authors = computed(() => store.getters['author/allAuthors'] || []);
    const publishers = computed(() => store.getters['publisher/allPublishers'] || []);
    const categories = computed(() => store.getters['category/allCategories'] || []);
    const books = computed(() => store.getters['book/allBooks'] || []);

    // === Computed phân trang ===
    const currentPage = computed(() => Math.floor(pagination.value.offset / pagination.value.limit) + 1);
    const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit) || 1);

    // === Cart validation ===
    const isValidCart = computed(() => {
      return borrowCart.value.every(item =>
        item.soLuongSachMuon > 0 && item.soLuongSachMuon <= item.soLuongHienCo
      );
    });

    // === Hàm giỏ mượn ===
    const isBookInCart = (bookId) => borrowCart.value.some(item => item.maSach === bookId);

    const addToBorrowCart = (book) => {
      if (!isBookInCart(book.maSach) && book.soLuongHienCo > 0) {
        borrowCart.value.push({ ...book, soLuongSachMuon: 1 });
      }
    };

    const validateQuantity = (item) => {
      if (item.soLuongSachMuon < 1) item.soLuongSachMuon = 1;
      if (item.soLuongSachMuon > item.soLuongHienCo) item.soLuongSachMuon = item.soLuongHienCo;
    };

    const showBorrowCart = () => { showConfirmModal.value = true; };
    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      borrowCart.value = [];
    };

    const handleConfirmBorrow = async () => {
      try {
        loading.value = true;
        const chiTiet = borrowCart.value.map(item => ({
          maSach: item.maSach,
          soLuongSachMuon: item.soLuongSachMuon
        }));
        await store.dispatch('borrow/createBorrowRequest', { chiTiet });
        proxy.$toast.show('Yêu cầu mượn sách đã được gửi!', 'success');
        closeConfirmModal();
        applyFilters(); // Tải lại danh sách
      } catch (err) {
        proxy.$toast.show(err.response?.data?.message || 'Có lỗi xảy ra', 'danger');
      } finally {
        loading.value = false;
      }
    };

    const clearError = () => {
      error.value = null;
      store.commit('book/SET_ERROR', null);
    };

    // === Tìm kiếm nâng cao ===
    const toggleAdvancedSearch = () => {
      showAdvancedSearch.value = !showAdvancedSearch.value;
    };

    const resetFilters = () => {
      filters.value = {
        tenSach: '',
        maSach: '',
        maTacGia: null,
        maNXB: null,
        maTheLoai: null,
        namXuatBanMin: null,
        namXuatBanMax: null,
        nguonGoc: ''
      };
      sortBy.value = 'tenSach-asc';
      pagination.value.offset = 0;
      applyFilters(); // Gọi lại → không có params → lấy tất cả
    };

    const applyFilters = async () => {
      loading.value = true;
      try {
        // Tạo object params chỉ chứa các field có giá trị
        const params = {};

        if (filters.value.tenSach?.trim()) {
          params.tenSach = filters.value.tenSach.trim();
        }
        if (filters.value.maSach?.trim()) {
          params.maSach = filters.value.maSach.trim();
        }
        if (filters.value.maTacGia !== null && filters.value.maTacGia !== undefined) {
          params.maTacGia = filters.value.maTacGia;
        }
        if (filters.value.maNXB !== null && filters.value.maNXB !== undefined) {
          params.maNXB = filters.value.maNXB;
        }
        if (filters.value.maTheLoai !== null && filters.value.maTheLoai !== undefined) {
          params.maTheLoai = filters.value.maTheLoai;
        }
        if (filters.value.namXuatBanMin !== null && filters.value.namXuatBanMin !== '') {
          params.namXuatBanMin = filters.value.namXuatBanMin;
        }
        if (filters.value.namXuatBanMax !== null && filters.value.namXuatBanMax !== '') {
          params.namXuatBanMax = filters.value.namXuatBanMax;
        }
        if (filters.value.nguonGoc?.trim()) {
          params.nguonGoc = filters.value.nguonGoc.trim();
        }

        // Luôn thêm sortBy, order, limit, offset
        const [field, dir] = sortBy.value.split('-');
        params.sortBy = field;
        params.order = dir.toUpperCase();
        params.limit = pagination.value.limit;
        params.offset = pagination.value.offset;

        // Gọi API
        const result = await store.dispatch('book/fetchBooksAdvanced', params);

        // Cập nhật phân trang
        pagination.value.total = result.total || 0;
      } catch (err) {
        error.value = 'Không thể tải danh sách sách';
        console.error('applyFilters error:', err);
      } finally {
        loading.value = false;
      }
    };

    const changePage = (newOffset) => {
      if (newOffset < 0 || newOffset >= pagination.value.total) return;
      pagination.value.offset = newOffset;
      applyFilters();
    };

    // === Watch thay đổi bộ lọc ===
    watch(
      [filters, sortBy],
      () => {
        pagination.value.offset = 0;
        applyFilters();
      },
      { deep: true }
    );

    // === Khởi tạo dữ liệu ===
    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('author/fetchAuthors'),
          store.dispatch('publisher/fetchPublishers'),
          store.dispatch('category/fetchCategories')
        ]);
        await applyFilters(); // Tải sách lần đầu
      } catch (err) {
        error.value = 'Không thể tải dữ liệu ban đầu';
      }
    });

    // === Return ===
    return {
      books,
      loading,
      error,
      borrowCart,
      showConfirmModal,
      showAdvancedSearch,
      filters,
      sortBy,
      authors,
      publishers,
      categories,
      pagination,
      currentPage,
      totalPages,
      isValidCart,
      isBookInCart,
      addToBorrowCart,
      validateQuantity,
      showBorrowCart,
      closeConfirmModal,
      handleConfirmBorrow,
      clearError,
      toggleAdvancedSearch,
      resetFilters,
      applyFilters,
      changePage,
      API_URL
    };
  }
};
</script>

<style scoped>
.card-title { font-size: 1.1rem; }
.card-footer { background-color: transparent; border-top: none; padding-top: 0; }
</style>