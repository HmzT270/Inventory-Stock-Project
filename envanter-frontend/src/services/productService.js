import axios from 'axios';

const API_URL = 'http://localhost:5184/api/Product';

// Tüm ürünleri getir
export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Ürün verileri alınamadı:', error);
    return [];
  }
};

// Ürün sil
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Ürün silinemedi:', error);
  }
};

// Kategoriye göre ürünleri getir
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/ByCategory/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Kategoriye göre ürün alınamadı:', error);
    return [];
  }
};

// Ürün açıklamasını güncelle
export const updateProductDescription = async (productId, newDescription) => {
  try {
    await axios.put(`${API_URL}/${productId}/UpdateDescription`, {
      NewDescription: newDescription
    });
  } catch (error) {
    console.error('Açiklama güncellenemedi:', error);
    throw error;
  }
};

// Ürün kategorisini değiştir
export const changeProductCategory = async (productId, newCategoryId) => {
  try {
    await axios.put(`${API_URL}/${productId}/ChangeCategory`, {
      categoryId: newCategoryId
    });
  } catch (error) {
    console.error('Kategori güncellenemedi:', error);
    throw error;
  }
};

