import axios from 'axios';

const API_URL = 'http://localhost:5184/api/Brand';

// Tüm markaları getir
export const getAllBrands = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Markalar alınamadı:', error);
    return [];
  }
};

// Marka ekle
export const addBrand = async (name) => {
  try {
    await axios.post(API_URL, { name });
  } catch (error) {
    console.error('Marka eklenemedi:', error);
    throw error;
  }
};

// Marka sil
export const deleteBrand = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Marka silinemedi:', error);
    throw error;
  }
};

// Marka adını değiştir (Kategori ile aynı mantık)
export const renameBrand = async (id, newName) => {
  try {
    await axios.put(`${API_URL}/Rename/${id}`, { newName });
  } catch (error) {
    console.error('Marka adı değiştirilemedi:', error);
    throw error;
  }
};
