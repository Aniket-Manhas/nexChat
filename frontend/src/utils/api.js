const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Clean endpoint to ensure proper URL format
 */
const getUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (BASE_URL.endsWith('/')) {
    return `${BASE_URL.slice(0, -1)}${cleanEndpoint}`;
  }
  return `${BASE_URL}${cleanEndpoint}`;
};

/**
 * Handle API responses and standardize error handling
 */
const handleResponse = async (response) => {
  let data = null;
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  async get(endpoint) {
    const response = await fetch(getUrl(endpoint), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });
    return handleResponse(response);
  },

  async post(endpoint, body = {}) {
    const response = await fetch(getUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async patch(endpoint, body = {}) {
    const response = await fetch(getUrl(endpoint), {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async postForm(endpoint, formData) {
    const response = await fetch(getUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  async patchForm(endpoint, formData) {
    const response = await fetch(getUrl(endpoint), {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },
};
