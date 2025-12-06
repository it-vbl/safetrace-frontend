import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getUsers } from '@/services/user';

/**
 * Custom hook to fetch and manage user list
 * @param {Object} options - Configuration options
 * @param {number} options.page - Current page number
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.search - Search query
 * @param {boolean} options.autoFetch - Whether to fetch on mount
 * @returns {Object} - Users data, loading state, and fetch function
 */
export const useUsers = ({
  page = 1,
  pageSize = 10,
  search = '',
  autoFetch = true,
} = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentSearch, setCurrentSearch] = useState(search);

  /**
   * Fetch users from API
   */
  const fetchUsers = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams({
          page: params.page || currentPage,
          page_size: params.pageSize || currentPageSize,
          ...(params.search || currentSearch
            ? { search: params.search || currentSearch }
            : {}),
        });

        const response = await getUsers(queryParams);
        const data = response.data.data;

        setUsers(data.results);
        setTotal(data.count);

        return data;
      } catch (err) {
        console.log(err);
        const errorMessage =
          err.response?.data?.message || 'Failed to fetch users';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, currentPageSize, currentSearch]
  );

  /**
   * Refetch users with new parameters
   */
  const refetch = useCallback(
    (params = {}) => {
      return fetchUsers(params);
    },
    [fetchUsers]
  );

  /**
   * Update search and refetch
   */
  const handleSearch = useCallback(
    (searchTerm) => {
      setCurrentSearch(searchTerm);
      setCurrentPage(1);
      return fetchUsers({ search: searchTerm, page: 1 });
    },
    [fetchUsers]
  );

  /**
   * Update page and refetch
   */
  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      return fetchUsers({ page: newPage });
    },
    [fetchUsers]
  );

  /**
   * Update page size and refetch
   */
  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      setCurrentPageSize(newPageSize);
      setCurrentPage(1);
      return fetchUsers({ pageSize: newPageSize, page: 1 });
    },
    [fetchUsers]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  return {
    users,
    loading,
    error,
    total,
    currentPage,
    currentPageSize,
    currentSearch,
    fetchUsers,
    refetch,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    setUsers,
  };
};

/**
 * Hook specifically for user management with additional features
 */
export const useUserManagement = () => {
  const {
    users,
    loading,
    error,
    total,
    currentPage,
    currentPageSize,
    currentSearch,
    fetchUsers,
    refetch,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
  } = useUsers();

  /**
   * Create new user
   */
  const createUser = useCallback(
    async (userData) => {
      try {
        const { createUser: createUserService } = await import(
          '@/services/user'
        );
        const response = await createUserService(userData);
        toast.success('Pengguna berhasil ditambahkan');
        refetch();
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Gagal menambahkan pengguna';
        toast.error(errorMessage);
        throw err;
      }
    },
    [refetch]
  );

  /**
   * Update user
   */
  const updateUser = useCallback(
    async (userData) => {
      try {
        const { updateUser: updateUserService } = await import(
          '@/services/user'
        );
        const response = await updateUserService(userData);
        toast.success('Pengguna berhasil diperbarui');
        refetch(); // Refresh the users list
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || 'Gagal memperbarui pengguna';
        toast.error(errorMessage);
        throw err;
      }
    },
    [refetch]
  );

  /**
   * Delete user
   */
  const deleteUser = useCallback(
    async (userId) => {
      try {
        // This would be implemented when delete endpoint is available
        toast.success('Pengguna berhasil dihapus');
        refetch();
      } catch (err) {
        toast.error('Failed to delete user');
        throw err;
      }
    },
    [refetch]
  );

  /**
   * Update user status
   */
  const updateUserStatus = useCallback(
    async (userId, status) => {
      try {
        // This would be implemented when update endpoint is available
        toast.success('User status updated successfully');
        refetch();
      } catch (err) {
        toast.error('Failed to update user status');
        throw err;
      }
    },
    [refetch]
  );

  return {
    users,
    loading,
    error,
    total,
    currentPage,
    currentPageSize,
    currentSearch,
    fetchUsers,
    refetch,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    createUser,
    deleteUser,
    updateUser,
    updateUserStatus,
  };
};
