import api from '@/services/api';

const state = {
  categories: [],
  loading: false,
  error: null,
};

const getters = {
  allCategories: (state) => state.categories,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
};

const actions = {
  // Lấy tất cả thể loại
  // async fetchCategories({ commit }) {
  //   try {
  //     commit('SET_LOADING', true);
  //     const response = await api.get('/theloai');
  //     commit('SET_CATEGORIES', response.data);
  //     commit('SET_LOADING', false);
  //   } catch (error) {
  //     commit('SET_ERROR', error.response?.data?.message || error.message);
  //     commit('SET_LOADING', false);
  //     throw error;
  //   }
  // },
  async fetchCategories({ commit }) {
    try {
      commit('SET_LOADING', true);
      const response = await api.get('/theloai');

      // Chuẩn hóa dữ liệu
      const categoriesRaw = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const categories = categoriesRaw.map(c => ({
        ...c,
        books: c.Sach || [],
      }));

      commit('SET_CATEGORIES', categories);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  

  // Tìm kiếm nâng cao thể loại
  async searchCategories({ commit }, filters) {
    try {
      commit('SET_LOADING', true);
      const response = await api.get('/theloai/search', { params: filters });
      commit('SET_CATEGORIES', response.data.data);
      return response.data.pagination;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  // Tạo thể loại
  async createCategory({ commit }, categoryData) {
    try {
      commit('SET_LOADING', true);
      const response = await api.post('/theloai', categoryData);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Cập nhật thể loại
  async updateCategory({ commit }, { maTheLoai, categoryData }) {
    try {
      commit('SET_LOADING', true);
      const response = await api.put(`/theloai/${maTheLoai}`, categoryData);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message);
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // Xóa thể loại
  async deleteCategory({ commit }, maTheLoai) {
    try {
      commit('SET_LOADING', true);
      await api.delete(`/theloai/${maTheLoai}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xóa thể loại thất bại';
      commit('SET_ERROR', errorMessage);
      console.error('Error in deleteCategory:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
