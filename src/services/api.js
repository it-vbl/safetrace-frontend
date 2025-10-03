import axios from 'axios';
import Cookies from 'js-cookie';
import querystring from 'qs';
import { toast } from 'react-toastify';

import {
  abortAllRequests,
  addAbortController,
} from '@/libs/utils/requestController';

let controller = new AbortController();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const TIMEOUT = 200000;

const isServer = typeof window === 'undefined';
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    if (params instanceof URLSearchParams) {
      return params.toString();
    }
    try {
      return querystring.stringify(params);
    } catch (e) {
      return new URLSearchParams(params || {}).toString();
    }
  },
  // withCredentials: true,
});

api.interceptors.request.use(function (config) {
  const token = Cookies.get('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  config.signal = controller.signal;
  addAbortController(controller);

  return config;
});

const logout = () => {
  Cookies.remove('token');
  Cookies.remove('refreshToken');
  const homeUrl = window?.location?.origin;
  window.location.href = `${homeUrl}/login?redirect=${
    window?.location?.pathname || ''
  }${window?.location?.search || ''}`;
};

const APIResponseValidation = async (
  response,
  promise,
  toastError = true,
  showErrorPage = false,
  auth = true
) => {
  // prevent refresh token checking when func executed in server or auth parameter is false
  if (isServer) return promise;

  const access_token = await Cookies.get('token');
  const refresh_token = await Cookies.get('refreshToken');

  // check if access token is not exist / not login
  if (response?.status === 401) {
    if (!auth) return promise;

    if (!access_token) {
      // logout();
      return promise;
    }

    try {
      const refreshTokenResponse = await APIInstance.post(
        '/accounts/token/refresh/',
        null,
        {
          refresh: refresh_token,
        },
        null,
        null,
        false
      );

      if (refreshTokenResponse?.status === 401) {
        logout();
      }

      const newAccessToken =
        refreshTokenResponse?.data?.data?.access ||
        refreshTokenResponse?.data?.access ||
        refreshTokenResponse?.data?.access_token;

      if (newAccessToken) {
        Cookies.set('token', newAccessToken);
      }

      return axios
        .request({
          ...response.config,
          headers: {
            ...response.config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        })
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((err) => {
          // APIResponseValidation(err.response);
          return Promise.reject(err);
        });
    } catch (err) {
      // logout the user
      console.log(err);
      logout();
    }
  }
  // show toast error message if API not success
  else if (response?.status && response?.status !== 200) {
    // check refresh token
    if (showErrorPage) {
      // APIResponseErrorValidation({ response });
      return promise;
    }

    if (toastError)
      toast({
        type: 'danger',
        text: response?.data?.errors?.[0]?.message,
      });
  }
  return promise;
};

const APIInstance = {
  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} json
   * @param {Object} form
   */
  put: (
    url,
    form = {},
    json = {},
    customConfig = {},
    auth = true,
    toastError = false,
    showErrorPage = false
  ) => {
    api.defaults.headers.common['Content-Type'] = json
      ? 'application/json'
      : 'application/x-www-form-urlencoded';
    const data = querystring.stringify(form) || json;
    return api
      .put(url, data, {
        params: querystring.stringify(form),
        ...customConfig,
      })
      .then((response) => {
        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} param query params
   */
  get: (
    url,
    customConfig = {},
    auth = true,
    toastError = true,
    showErrorPage = true
  ) => {
    if (controller.signal.aborted) {
      controller = new AbortController();
    }

    return api
      .get(url, {
        ...customConfig,
        signal: controller.signal,
      })
      .then((response) => {
        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          return;
        }

        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} json
   * @param {Object} form
   * @param {Object} reqConfig  custom config for request
   */
  post: (
    url,
    form = null,
    json = {},
    reqConfig = {},
    onUploadProgress = () => {},
    auth = true,
    showErrorPage = false,
    toastError = false,
    isAbortedRequest = false
  ) => {
    api.defaults.headers['Content-Type'] = form
      ? 'application/x-www-form-urlencoded'
      : 'application/json';

    const data = querystring.stringify(form) || json;

    return api
      .post(url, data, {
        params: querystring.stringify(form),
        onUploadProgress,
        ...reqConfig,
        signal: controller.signal,
      })
      .then((response) => {
        if (isAbortedRequest) {
          controller.abort();
        }

        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          controller = new AbortController();
          return;
        }
        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },

  /**
   * Send request with Content-Type multipart/form
   * used to upload file
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} data
   */
  postData: (
    url,
    data = {},
    customConfig = {},
    auth = true,
    showErrorPage = false
  ) => {
    api.defaults.headers['Content-Type'] = 'multipart/form-data';
    api.defaults.timeout = TIMEOUT;
    const formData = new FormData();
    const keys = Object.keys(data);
    keys.map((key) => {
      data[key] instanceof File
        ? formData.append(key, data[key], data[key].name)
        : formData.append(key, data[key]);
    });
    return api
      .post(url, formData, {
        baseURL: BASE_URL,
        ...customConfig,
      })
      .then((response) => {
        return APIResponseValidation(response, Promise.resolve(response));
      })
      .catch((err) => {
        return APIResponseValidation(err.response, Promise.reject(err));
      });
  },

  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} params
   * {
   *   id: [1,2,3]
   * }
   */
  delete: (
    url,
    params,
    auth = true,
    toastError = true,
    showErrorPage = false
  ) => {
    let newUrl = url;
    if (params) {
      const qparam = querystring.stringify(params);
      newUrl = `${newUrl}?${qparam}`;
    }
    return api
      .delete(newUrl)
      .then((response) => {
        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },
  /**
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} payload
   * {
   *   id: [1,2,3]
   * }
   */
  deleteData: (url, payload, auth = true, toastError = true) => {
    return api
      .delete(url, { data: payload }, ((auth = true), (toastError = true)))
      .then((response) => {
        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },
  /**
   * Send request with Content-Type multipart/form
   * used to upload file
   * @param {Sring} url '/path/to/endpoint'
   * @param {Object} data
   */
  putData: (
    url,
    data = {},
    customConfig = {},
    auth = true,
    toastError = true
  ) => {
    api.defaults.headers['Content-Type'] = 'multipart/form-data';
    api.defaults.timeout = TIMEOUT;
    const formData = new FormData();
    const keys = Object.keys(data);
    keys.map((key) => {
      data[key] instanceof File
        ? formData.append(key, data[key], data[key].name)
        : formData.append(key, data[key]);
    });
    return api
      .put(url, formData, { ...customConfig })
      .then((response) => {
        return APIResponseValidation(
          response,
          Promise.resolve(response),
          toastError,
          showErrorPage,
          auth
        );
      })
      .catch((err) => {
        return APIResponseValidation(
          err.response,
          Promise.reject(err),
          toastError,
          showErrorPage,
          auth
        );
      });
  },
};

export default APIInstance;
