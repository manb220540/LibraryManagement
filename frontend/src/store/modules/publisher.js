import api from '@/services/api';

export default {
  namespaced: true,

  // STATE
  state: {
    publishers: [],
    loading: false,
    error: null
  },

  // MUTATIONS
  mutations: {
    SET_PUBLISHERS(state, publishers) {
      state.publishers = publishers;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  // ACTIONS (chỉ chứa các hàm async)
  actions: {
    // Lấy tất cả NXB (có sách liên quan)
    async fetchPublishers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/nhaxuatban');
        commit('SET_PUBLISHERS', response.data);
        return {
          data: response.data,
          pagination: {
            total: response.data.length,
            page: 1,
            limit: 12,
            totalPages: 1
          }
        };
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Tìm kiếm nâng cao
    async searchPublishers({ commit }, filters) {
      try {
        commit('SET_LOADING', true);
        const response = await api.get('/nhaxuatban/search', { params: filters });
        commit('SET_PUBLISHERS', response.data.data);
        return response.data.pagination;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Tạo NXB
    async createPublisher({ commit }, publisherData) {
      try {
        const response = await api.post('/nhaxuatban', publisherData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },

    // Cập nhật NXB
    async updatePublisher({ commit }, { id, publisherData }) {
      try {
        const response = await api.put(`/nhaxuatban/${id}`, publisherData);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      }
    },

    // Xóa NXB
    async deletePublisher({ commit }, id) {
      try {
        await api.delete(`/nhaxuatban/${id}`);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Xóa nhà xuất bản thất bại';
        commit('SET_ERROR', errorMessage);
        console.error('Error in deletePublisher:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  // GETTERS (PHẢI Ở NGOÀI actions!)
  getters: {
    allPublishers: (state) => state.publishers,
    isLoading: (state) => state.loading,
    error: (state) => state.error
  }
};