<template>
  <div class="home-page">
    <LoadingSpinner :show="loading" />

    
    <div class="hero-section">
      <div class="row align-items-center min-vh-50">
        <div class="col-lg-8 mx-auto text-center">
          <h1 class="hero-title mb-3">Thư viện sách CTU</h1>
          <p class="hero-subtitle mb-4">
            Khám phá kho tàng sách phong phú và tận hưởng trải nghiệm đọc sách tuyệt vời
          </p>

          <!-- Welcome message when logged in -->
          <!-- <div v-else class="welcome-message mb-5">
            <p class="text-muted">
              <i class="fas fa-user-circle me-2"></i>
              Chào mừng bạn trở lại!
            </p>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section py-5">
      <div class="row g-4 px-4">
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon text-success">
              <i class="fas fa-book"></i>
            </div>
            <h3 class="stat-number">{{ totalBooks }}</h3>
            <p class="stat-label">Số sách</p>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon text-warning">
              <i class="fas fa-building"></i>
            </div>
            <h3 class="stat-number">{{ totalPublishers }}</h3>
            <p class="stat-label">Nhà xuất bản</p>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon text-primary">
              <i class="fas fa-pen-fancy"></i>
            </div>
            <h3 class="stat-number">{{ totalAuthors }}</h3>
            <p class="stat-label">Tác giả</p>
          </div>
        </div>

        <div class="col-6 col-md-3">
          <div class="stat-card" :class="{ 'stat-card-locked': !isLoggedIn }">
            <div class="stat-icon" :class="isLoggedIn ? 'text-danger' : 'text-muted'">
              <i :class="isLoggedIn ? 'fas fa-bookmark' : 'fas fa-lock'"></i>
            </div>
            <h3 class="stat-number" v-if="isLoggedIn">{{ approvedBooks }}</h3>
            <h3 class="stat-number text-muted" v-else>—</h3>
            <p class="stat-label">
              {{ isLoggedIn ? 'Số lượt mượn sách hiện tại' : 'Đăng nhập để xem' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guide Section -->
    <div class="guide-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="section-title text-center mb-5">Hướng dẫn sử dụng</h2>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="guide-card">
                  <div class="guide-icon">
                    <i class="fas fa-search"></i>
                  </div>
                  <h5 class="guide-title">Tìm sách</h5>
                  <p class="guide-text">
                    Dễ dàng tìm kiếm sách theo tên sách, mã sách, tên NXB, tên tác giả
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="guide-card">
                  <div class="guide-icon">
                    <i class="fas fa-book"></i>
                  </div>
                  <h5 class="guide-title">Mượn sách</h5>
                  <p class="guide-text">
                    Đặt yêu cầu mượn sách và theo dõi trạng thái
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'HomePage',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore();
    const loading = ref(true);

    const isLoggedIn = computed(() => {
      return store.getters['auth/isAuthenticated'] || false;
    });

    const totalBooks = computed(() => {
      const books = store.getters['book/allBooks'];
      return Array.isArray(books) ? books.length : 0;
    });

    const totalPublishers = computed(() => {
      const publishers = store.getters['publisher/allPublishers'];
      return Array.isArray(publishers) ? publishers.length : 0;
    });

    const totalAuthors = computed(() => {
      const authors = store.getters['author/allAuthors'];
      return Array.isArray(authors) ? authors.length : 0;
    });

    const approvedBooks = computed(() => {
      if (!isLoggedIn.value) return 0;
      const history = store.getters['borrow/borrowHistory'];
      if (!Array.isArray(history)) return 0;
      return history.filter(item => item?.trangThai === 'Đã duyệt').length;
    });

    onMounted(async () => {
      try {
        await Promise.all([
          store.dispatch('book/fetchBooks'),
          store.dispatch('publisher/fetchPublishers'),
          store.dispatch('author/fetchAuthors')
        ]);

        if (isLoggedIn.value) {
          await store.dispatch('borrow/fetchBorrowHistory');
        }
      } catch (error) {
        console.warn('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      totalBooks,
      totalPublishers,
      totalAuthors,
      approvedBooks,
      isLoggedIn
    };
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
}

/* Hero Section */
.hero-section {
  background: url('@/assets/book2.jpg') no-repeat center center/cover;
  color: white;
  padding: 4rem 2rem 3rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none"/><path d="M0 0L100 100M100 0L0 100" stroke="rgba(255,255,255,0.05)" stroke-width="2"/></svg>');
  opacity: 0.3;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  font-weight: 300;
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}

.btn-auth {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  min-width: 150px;
}

.btn-primary.btn-auth {
  background: white;
  color: #667eea;
  border-color: white;
}

.btn-primary.btn-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
  background: #f8f9fa;
}

.btn-outline-primary.btn-auth {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-outline-primary.btn-auth:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

.welcome-message {
  font-size: 1.1rem;
  position: relative;
}

/* Stats Section */
.stats-section {
  margin-top: -2rem;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.stat-card-locked {
  opacity: 0.7;
}

.stat-card-locked:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.stat-label {
  font-size: 0.95rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

/* Guide Section */
.guide-section {
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #4299e1 0%, #667eea 100%);
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
}

.guide-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.05);
}

.guide-icon {
  font-size: 3rem;
  color: #4299e1;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  background: rgba(66, 153, 225, 0.1);
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.guide-card:hover .guide-icon {
  background: rgba(66, 153, 225, 0.1);
}

.guide-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.guide-text {
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.6;
  margin: 0;
}
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0 2rem;
  }

  .stat-card {
    padding: 1.5rem 1rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .btn-auth {
    padding: 0.65rem 1.5rem;
    font-size: 0.95rem;
    min-width: 130px;
  }
}

@media (max-width: 576px) {
  .stats-section {
    margin-top: -1rem;
  }

  .auth-buttons {
    gap: 0.75rem;
  }

  .btn-auth {
    width: 100%;
    max-width: 200px;
  }
}

/* Color utilities */
.text-success { color: #48bb78 !important; }
.text-warning { color: #ed8936 !important; }
.text-primary { color: #4299e1 !important; }
.text-danger { color: #f56565 !important; }
.text-muted { color: #a0aec0 !important; }

/* Footer */
.footer {
  background-color: #f8f9fa;
  padding: 1rem 0;
  margin-top: 2rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>