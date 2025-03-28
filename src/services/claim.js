import api from '@/services/api';

export const createVideo = ({ payload }) => api.post('v1/videos/create', null, payload, {});

export const getListVideo = ({
  currentPage = 1,
  itemPerPage = 10,
  search = '',
  filter = {},
  sort = '',
}) => {
  let url = `v1/videos/index?page=${currentPage}&per_page=${itemPerPage}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  Object.keys(filter).forEach((key) => {
    url += `&filter[${encodeURIComponent(key)}]=${encodeURIComponent(filter[key])}`;
  });

  if (sort) {
    url += `&sort=${encodeURIComponent(sort)}`;
  }

  return api.get(url);
};

export const updateVideo = ({ payload, id }) => api.put(`v1/videos/${id}`, null, payload);

export const deleteVideo = (id, payload) => api.delete(`v1/videos/${id}`, null, payload);
