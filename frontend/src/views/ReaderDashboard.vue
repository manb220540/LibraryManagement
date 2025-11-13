<template>
  <div class="reader-dashboard">
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container">
        <a class="navbar-brand" href="#" @click.prevent="currentComponent = 'HomePage'">
          <i class="fas fa-book-reader me-2"></i>
          <span class="brand-text">Thư viện sách CTU</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto ms-4">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'BookList' }"
                 @click.prevent="currentComponent = 'BookList'">
                <span>Sách</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'PublisherList' }"
                 @click.prevent="currentComponent = 'PublisherList'">
                <span>Nhà xuất bản</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'AuthorList' }"
                 @click.prevent="currentComponent = 'AuthorList'">
                <span>Tác giả</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'CategoryList' }"
                 @click.prevent="currentComponent = 'CategoryList'">
                <span>Thể loại</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentComponent === 'BorrowHistory' }"
                 @click.prevent="currentComponent = 'BorrowHistory'">
                <span>Lịch sử mượn sách</span>
              </a>
            </li>
          </ul>
          <ul class="navbar-nav user-section">
            <li class="nav-item">
              <span class="nav-link user-greeting" @click="currentComponent = 'UserProfile'">
                <i class="fas fa-user-circle me-2"></i>
                {{ currentUser?.hoLot }} {{ currentUser?.ten || 'Độc giả' }}
              </span>
            </li>
            <li class="nav-item">
              <a class="nav-link logout-link" href="#" @click="handleLogout">
                <i class="fas fa-sign-out-alt me-1"></i>
                <span>Đăng xuất</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <component :is="currentComponent"></component>
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import HomePage from '@/components/reader/HomePage.vue';
import BookList from '@/components/reader/BookList.vue';
import PublisherList from '@/components/reader/PublisherList.vue';
import AuthorList from '@/components/reader/AuthorList.vue';
import BorrowHistory from '@/components/reader/BorrowHistory.vue';
import UserProfile from '@/components/reader/UserProfile.vue';
import CategoryList from '@/components/reader/CategoryList.vue';

export default {
  name: 'ReaderDashboard',
  components: {
    HomePage,
    BookList,
    PublisherList,
    AuthorList,
    BorrowHistory,
    CategoryList,
    UserProfile
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const currentComponent = ref(localStorage.getItem('readerCurrentComponent') || 'HomePage');
    const currentYear = computed(() => new Date().getFullYear());
    
    watch(currentComponent, (newValue) => {
      localStorage.setItem('readerCurrentComponent', newValue);
    });

    const currentUser = computed(() => store.getters['auth/currentUser']);

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      localStorage.removeItem('readerCurrentComponent');
      router.push('/login');
    };

    const navigateTo = (componentName) => {
      currentComponent.value = componentName;
    };

    return {
      currentComponent,
      currentUser,
      handleLogout,
      currentYear,
      navigateTo
    };
  }
};
</script>

<style scoped>
.reader-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
  display: flex;
  flex-direction: column;
}

/* .container.mt-4 {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
} */

.navbar-custom {
  background: linear-gradient(135deg, #8B7355 0%, #6B5B95 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.8rem 0;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: #FFF5E6 !important;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.navbar-brand:hover {
  color: #FFE8C5 !important;
  transform: translateY(-2px);
}

.navbar-brand i {
  font-size: 1.6rem;
  color: #F1E2A0;
}

.brand-text {
  letter-spacing: 0.5px;
}

.nav-link {
  cursor: pointer;
  color: #FFF5E6 !important;
  padding: 0.5rem 0.75rem !important;
  margin: 0 0.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  text-align: center;
  line-height: 1.2;
  min-height: 48px;
}

.nav-link i {
  font-size: 1rem;
  opacity: 0.9;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #FFE8C5 !important;
  transform: translateY(-2px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  color: #FFFFFF !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-section {
  border-left: 2px solid rgba(255, 255, 255, 0.2);
  padding-left: 1rem;
  margin-left: 1rem;
}

.user-greeting {
  color: #FFE8C5 !important;
  font-weight: 500;
  padding-right: 1.5rem !important;
  cursor: pointer;
}

.user-greeting:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-2px) !important;
}

.user-greeting i {
  font-size: 1.3rem;
  color: #F1E2A0;
}

.logout-link {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logout-link:hover {
  background: rgba(220, 53, 69, 0.8) !important;
  border-color: rgba(220, 53, 69, 0.9);
  color: #FFFFFF !important;
}

.navbar-toggler {
  border-color: rgba(255, 255, 255, 0.3);
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.9%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.container {
  max-width: 1400px;
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
</style>