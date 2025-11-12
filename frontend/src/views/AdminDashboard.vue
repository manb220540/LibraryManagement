<template>
    <div class="admin-dashboard">
      <nav class="navbar navbar-expand-lg navbar-custom">
        <div class="container">
          <a class="navbar-brand" href="#" @click.prevent="currentComponent = 'AdminHomePage'">
            <i class="fas fa-book-reader me-2"></i>
            <span class="brand-text"> Quản lý thư viện</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto ms-4">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'BookManagement' }" 
                   @click.prevent="currentComponent = 'BookManagement'">
                  <span>Quản lý sách</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'PublisherManagement' }"
                   @click.prevent="currentComponent = 'PublisherManagement'">
                  <span>Quản lý NXB</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'AuthorManagement' }"
                   @click.prevent="currentComponent = 'AuthorManagement'">
                  <span>Quản lý <br>tác giả</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'CategoryManagement' }"
                   @click.prevent="currentComponent = 'CategoryManagement'">
                  <span>Quản lý <br> thể loại</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'StaffManagement' }"
                   @click.prevent="currentComponent = 'StaffManagement'">
                  <span>Quản lý <br> nhân viên</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'ReaderManagement' }"
                   @click.prevent="currentComponent = 'ReaderManagement'">
                  <span>Quản lý <br>độc giả</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: currentComponent === 'BorrowManagement' }"
                   @click.prevent="currentComponent = 'BorrowManagement'">
                  <span>Quản lý <br> mượn sách</span>
                </a>
              </li>
            </ul>
            <ul class="navbar-nav user-section">
              <li class="nav-item">
                <span class="nav-link user-greeting">
                  <i class="fas fa-user-circle me-2"></i>
                  {{ currentUser?.hoTenNV || 'Nhân viên' }}
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
      <footer class="footer">
        <div class="container">
          <span class="text-muted">&copy; 2025 Quản lý thư viện</span>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import BookManagement from '@/components/admin/BookManagement.vue';
  import PublisherManagement from '@/components/admin/PublisherManagement.vue';
  import StaffManagement from '@/components/admin/StaffManagement.vue';
  import ReaderManagement from '@/components/admin/ReaderManagement.vue';
  import BorrowManagement from '@/components/admin/BorrowManagement.vue';
  import AuthorManagement from '@/components/admin/AuthorManagement.vue';
  import AdminHomePage from '@/components/admin/AdminHomePage.vue';
  import CategoryManagement from '@/components/admin/CategoryManagement.vue';

  
  export default {
    name: 'AdminDashboard',
    components: {
      BookManagement,
      PublisherManagement,
      StaffManagement,
      ReaderManagement,
      BorrowManagement,
      AuthorManagement,
      CategoryManagement,
      AdminHomePage
    },
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const currentComponent = ref(localStorage.getItem('adminCurrentComponent') || 'AdminHomePage');
      
      watch(currentComponent, (newValue) => {
        localStorage.setItem('adminCurrentComponent', newValue);
      });
  
      const currentUser = computed(() => store.getters['auth/currentUser']);
  
      const handleLogout = async () => {
        await store.dispatch('auth/logout');
        localStorage.removeItem('adminCurrentComponent');
        router.push('/login');
      };
  
      return {
        currentComponent,
        currentUser,
        handleLogout
      };
    }
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #F1E2A0 0%, #D3C4E1 100%);
    display: flex;
    flex-direction: column;
  }

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
    cursor: default;
  }

  .user-greeting:hover {
    background: transparent !important;
    transform: none !important;
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

  .footer {
  background: linear-gradient(135deg, #8B7355 0%, #6B5B95 100%);
  padding: 1rem 0;
  text-align: center;
  color: #FFF5E6;
  width: 100%;
  margin-top: auto; 
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
  }

  @media (max-width: 768px) {
    .navbar-brand {
      font-size: 1.3rem;
    }

    .nav-link span {
      font-size: 0.95rem;
    }
  }
  </style>