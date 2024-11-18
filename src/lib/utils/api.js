// src/lib/utils/api.js
export const api = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('token'); // Adjust this to how you're managing tokens

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
    method,
   
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : null,
  });

  return await res.json();
};
