import axios from 'axios';

const API_URL = 'http://localhost:5184/api/Category';

// Tüm kategorileri getir
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Kategori verileri alınamadı:', error);
    return [];
  }
};

// Kategori ekle (KÜÇÜK HARFLE "name" GÖNDER)
export const addCategory = async (name) => {
  try {
    await axios.post(API_URL, { name });
  } catch (error) {
    console.error('Kategori eklenemedi:', error);
    throw error;
  }
};

// Kategori sil
export const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Kategori silinemedi:', error);
    throw error;
  }
};

// Kategori adını değiştir
export const renameCategory = async (id, newName) => {
  try {
    await axios.put(`${API_URL}/Rename/${id}`, { newName });
  } catch (error) {
    console.error('Kategori adı değiştirilemedi:', error);
    throw error;
  }
};
