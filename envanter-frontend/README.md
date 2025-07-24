# Envanter Takip Sistemi – Frontend

Bu klasör, React + Vite kullanılarak geliştirilen **Envanter/Stok Takip Sistemi**'nin frontend (kullanıcı arayüzü) kısmını içerir.

## 🚀 Kullanılan Teknolojiler

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Material UI (MUI)](https://mui.com/)
- [Axios](https://axios-http.com/)
- [MS SQL + .NET API](http://localhost:5184) (backend bağlantısı)

## 📂 Klasör Yapısı

- `src/components/` → Sayfa bileşenleri (ProductList, StockMovements, Dashboard, vs.)
- `src/services/` → API servis dosyaları (`productService.js`, `categoryService.js`, vs.)
- `src/pages/` → Sayfa düzeni ve görseller

## ⚙️ Kurulum Adımları

```bash
cd envanter-frontend
npm install
npm run dev
```

Frontend uygulaması varsayılan olarak [http://localhost:5173](http://localhost:5173) adresinde çalışır.

## 🌐 Backend API Bağlantısı

- Tüm API istekleri, `http://localhost:5184/api/` adresine yapılır.
- Bu adres servis dosyalarında axios ile tanımlanmıştır.
- Dilersen `.env` dosyası kullanarak dinamikleştirebilirsin.

## 🖼️ Arayüz Özellikleri

- Responsive tasarım desteği
- Sidebar (Drawer) ile gezinme paneli
- Dashboard: Ürün/Kategori sayıları, kritik stoklar ve silinen ürünler
- DataGrid ile özelleştirilmiş tablo görünümleri
- Fade animasyonlu uyarı mesajları
- Kategoriye göre filtreleme, ürün düzenleme, açıklama değiştirme, stok hareketleri

## 👤 Geliştirici

Bu proje, **Hamza Taşbay** tarafından staj sürecinde geliştirilmiştir.

- GitHub: [https://github.com/HmzT270](https://github.com/HmzT270)
- LinkedIn: [https://www.linkedin.com/in/hamza-taşbay-3b7b94304/](https://www.linkedin.com/in/hamza-taşbay-3b7b94304/)

## 🔒 HTTPS Kullanımı Hakkında

Bu API yerel geliştirme ortamında HTTP üzerinden çalışacak şekilde yapılandırılmıştır. `Program.cs` dosyasındaki `app.UseHttpsRedirection();` satırı kaldırılmıştır.

> Bu sayede uygulama `http://localhost:5184` üzerinden çalışır ve HTTPS port hatası alınmaz.

Yayına alınacak ortamlarda HTTPS desteği `UseHttpsRedirection()` ve uygun sertifikalarla kolayca tekrar etkinleştirilebilir.
