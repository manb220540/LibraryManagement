<template>
  <div class="home-page">
    <LoadingSpinner :show="loading" />

    <!-- Hero Section -->
    <div class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-8 mx-auto text-center">
            <h1 class="hero-title mb-3">Thư viện sách CTU</h1>
            <p class="hero-subtitle mb-4">
              Khám phá kho tàng sách phong phú và tận hưởng trải nghiệm đọc sách tuyệt vời
            </p>
            
            <!-- Auth Buttons - Only show when not logged in -->
            <div v-if="!isLoggedIn" class="auth-buttons mb-5">
              <button @click="$router.push('/register')" class="btn btn-primary btn-auth">
                <i class="fas fa-user-plus me-2"></i>Đăng ký
              </button>
              <button @click="$router.push('/login')" class="btn btn-outline-primary btn-auth">
                <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-6 col-md-4">
            <div class="stat-card">
              <div class="stat-icon text-success">
                <i class="fas fa-book"></i>
              </div>
              <h3 class="stat-number">{{ totalBooks }}</h3>
              <p class="stat-label">Số sách</p>
            </div>
          </div>

          <div class="col-6 col-md-4">
            <div class="stat-card">
              <div class="stat-icon text-warning">
                <i class="fas fa-building"></i>
              </div>
              <h3 class="stat-number">{{ totalPublishers }}</h3>
              <p class="stat-label">Nhà xuất bản</p>
            </div>
          </div>

          <div class="col-6 col-md-4">
            <div class="stat-card">
              <div class="stat-icon text-primary">
                <i class="fas fa-pen-fancy"></i>
              </div>
              <h3 class="stat-number">{{ totalAuthors }}</h3>
              <p class="stat-label">Tác giả</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  </div>
      <footer class="footer mt-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">
                <i class="fas fa-book-reader me-2"></i>
                Về chúng tôi
              </h5>
              <p class="footer-text">
                Thư viện trực tuyến - nơi kết nối tri thức và đam mê đọc sách. 
                Chúng tôi cam kết mang đến trải nghiệm đọc sách tốt nhất cho độc giả.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">
                <i class="fas fa-link me-2"></i>
                Liên kết nhanh
              </h5>
              <ul class="footer-links list-unstyled">
                <li><a href="#" @click.prevent="navigateTo('BookList')">
                  <i class="fas fa-chevron-right me-2"></i>Danh sách sách
                </a></li>
                <li><a href="#" @click.prevent="navigateTo('PublisherList')">
                  <i class="fas fa-chevron-right me-2"></i>Nhà xuất bản
                </a></li>
                <li><a href="#" @click.prevent="navigateTo('AuthorList')">
                  <i class="fas fa-chevron-right me-2"></i>Tác giả
                </a></li>
                <li><a href="#" @click.prevent="navigateTo('BorrowHistory')">
                  <i class="fas fa-chevron-right me-2"></i>Lịch sử mượn sách
                </a></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-4 col-md-12 mb-4">
            <div class="footer-section">
              <h5 class="footer-title">
                <i class="fas fa-address-book me-2"></i>
                Liên hệ
              </h5>
              <ul class="footer-contact list-unstyled">
                <li>
                  <i class="fas fa-map-marker-alt me-2"></i>
                  <span>Đại học Cần Thơ</span>
                </li>
                <li>
                  <i class="fas fa-phone me-2"></i>
                  <span>0123456789</span>
                </li>
                <li>
                  <i class="fas fa-envelope me-2"></i>
                  <span>nhom3@student.ctu.edu.vn</span>
                </li>
              </ul>
              <div class="social-links mt-3">
                <a href="#" class="social-link" aria-label="Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#" class="social-link" aria-label="Twitter">
                  <i class="fab fa-twitter"></i>
                </a>
                <a href="#" class="social-link" aria-label="Instagram">
                  <i class="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr class="footer-divider" />
        <div class="row">
          <div class="col-md-12 text-center">
            <p class="footer-copyright mb-0">
              <i class="fas fa-copyright me-1"></i>
              Nhóm 3 - {{ currentYear }} Hệ thống Quản lý Thư viện. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
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
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
}


/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0 3rem;
  position: relative;
  overflow: hidden;
}
.hero-section {
  background: url('@/assets/book2.jpg') no-repeat center center/cover;
  color: white;
  padding: 4rem 0 3rem;
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

/* Responsive Design */
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
/* Footer Styles */
.footer {
  background: linear-gradient(135deg, #8B7355 0%, #6B5B95 100%);
  padding: 3rem 0 1.5rem;
  color: #FFF5E6;
  margin-top: auto;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
}

.footer-section {
  padding: 0 1rem;
}

.footer-title {
  color: #F1E2A0;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.footer-title i {
  font-size: 1.1rem;
  opacity: 0.9;
}

.footer-text {
  color: #FFF5E6;
  line-height: 1.7;
  font-size: 0.95rem;
  opacity: 0.95;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #FFF5E6;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  padding: 0.25rem 0;
}

.footer-links a i {
  font-size: 0.75rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: #F1E2A0;
  transform: translateX(5px);
}

.footer-links a:hover i {
  opacity: 1;
}

.footer-contact li {
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  color: #FFF5E6;
  font-size: 0.95rem;
}

.footer-contact i {
  color: #F1E2A0;
  min-width: 1.5rem;
  font-size: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF5E6;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  color: #F1E2A0;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.2);
  margin: 2rem 0 1.5rem;
}

.footer-copyright {
  color: #FFE8C5;
  font-size: 0.9rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.footer-copyright i {
  font-size: 0.85rem;
}

@media (max-width: 991px) {
  .user-section {
    border-left: none;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
    padding-left: 0;
    margin-left: 0;
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .nav-link {
    margin: 0.2rem 0;
    font-size: 0.9rem;
  }

  .navbar-nav {
    flex-wrap: wrap;
  }

  .nav-item {
    flex: 1 1 auto;
    min-width: 140px;
    max-width: 200px;
  }

  .footer {
    padding: 2.5rem 0 1.5rem;
  }

  .footer-section {
    padding: 0 0.5rem;
  }
}

@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1.3rem;
  }

  .nav-link span {
    font-size: 0.95rem;
  }

  .footer {
    padding: 2rem 0 1rem;
  }

  .footer-title {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }

  .footer-text,
  .footer-links a,
  .footer-contact li {
    font-size: 0.9rem;
  }

  .social-link {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }

  .footer-copyright {
    font-size: 0.85rem;
    flex-direction: column;
    gap: 0.5rem;
  }
}
/* Color utilities */
.text-success { color: #48bb78 !important; }
.text-warning { color: #ed8936 !important; }
.text-primary { color: #4299e1 !important; }
.text-danger { color: #f56565 !important; }
.text-muted { color: #a0aec0 !important; }
</style>
