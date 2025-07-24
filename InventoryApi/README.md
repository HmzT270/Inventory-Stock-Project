# 🧠 InventoryApi – Backend (ASP.NET Core Web API)

Bu klasör, **Envanter ve Stok Takip Sistemi** projesinin backend (sunucu tarafı) katmanını içerir. Uygulama, ürün ve kategori yönetimi ile stok hareketlerinin takibini sağlayan RESTful API mimarisiyle geliştirilmiştir.

---

## 🚀 Kullanılan Teknolojiler ve Paketler

- ASP.NET Core 7 Web API
- Entity Framework Core
- MS SQL Server
- Swashbuckle (Swagger için)
- AutoMapper (isteğe bağlı)
- Newtonsoft.Json

---

## 🔌 Veritabanı Bağlantısı

Veritabanı bağlantı dizesi `appsettings.json` dosyasındadır:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=InventoryDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> Gerekirse `Trusted_Connection` yerine kullanıcı adı/şifre ile bağlantı yapılabilir.

---

## 📂 Klasör Yapısı

```
InventoryApi/
├── Controllers/         # API endpoint'leri
├── Data/                # DbContext ve örnek veriler
├── Models/              # Entity modelleri (Product, Category, StockMovement)
├── Migrations/          # EF Core migration dosyaları
├── Program.cs           # Uygulama giriş noktası
├── appsettings.json     # Konfigürasyon dosyası
└── InventoryApi.csproj  # Proje yapılandırması
```

---

## 🔧 API'yi Çalıştırmak

### Visual Studio ile:
- `F5` veya `Ctrl + F5` tuşuna basın
- Otomatik olarak Swagger arayüzü açılır: [http://localhost:5184/swagger](http://localhost:5184/swagger)

### Komut satırı ile:
```bash
cd InventoryApi
dotnet run
```

---

## 🧪 API Endpoint Örnekleri

### 🔹 Ürün İşlemleri

| İşlem              | Yöntem | URL                                 |
|-------------------|--------|-------------------------------------|
| Tüm ürünleri getir | GET    | `/api/Product`                      |
| Ürün ekle          | POST   | `/api/Product`                      |
| Ürün sil           | DELETE | `/api/Product/{id}`                |
| Ürün güncelle      | PUT    | `/api/Product/{id}`                |
| Son silinen 10 ürün| GET    | `/api/Product/Last10Deleted`        |

### 🔹 Kategori İşlemleri

| İşlem                | Yöntem | URL                        |
|---------------------|--------|----------------------------|
| Tüm kategorileri getir | GET  | `/api/Category`           |
| Kategori ekle         | POST  | `/api/Category`           |
| Kategori sil          | DELETE| `/api/Category/{id}`      |
| Kategori güncelle     | PUT   | `/api/Category/{id}`      |

### 🔹 Stok Hareketleri

| İşlem                   | Yöntem | URL                          |
|------------------------|--------|------------------------------|
| Stok hareketi ekle     | POST   | `/api/StockMovement`        |
| Ürüne ait hareketleri getir | GET | `/api/StockMovement/product/{productId}` |

---

## 📘 Swagger

- API testleri için Swagger arayüzü aktiftir.
- Açmak için: [http://localhost:5184/swagger](http://localhost:5184/swagger)

---

## 👤 Geliştirici

**Hamza Taşbay**  
📧 `T_4517-Hamza-4518@outlook.com`  
🔗 https://github.com/HmzT270  
🔗 https://www.linkedin.com/in/hamza-taşbay-3b7b94304/
