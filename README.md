# 📦 Envanter ve Stok Takip Sistemi

Bu proje, bir kurumun ürün envanterini ve stok hareketlerini takip etmesini sağlayan tam kapsamlı bir web uygulamasıdır. Kullanıcılar, ürün ve kategori yönetimi, stok giriş-çıkış işlemleri ve kritik stok uyarıları gibi işlevleri kolaylıkla gerçekleştirebilir.

---

## 🔧 Kullanılan Teknolojiler

- 🧠 **ASP.NET Core Web API** (Backend)
- 🗃️ **MS SQL Server** (Veritabanı)
- ⚛️ **React + Vite** (Frontend)
- 🎨 **Material UI** (Tasarım bileşenleri)
- 🔗 **Axios** (Frontend–Backend HTTP bağlantısı)

---

## 📁 Klasör Yapısı

```
inventory-stock-system/
├── envanter-frontend/     # React uygulaması (Frontend)
├── InventoryApi/          # ASP.NET Core Web API (Backend)
├── .gitignore             # Gereksiz dosyaları hariç tutar
└── README.md              # Proje tanıtım dosyası
```

---

## ⚙️ Kurulum Adımları

### 🔷 Backend (API) çalıştırmak için:
```bash
cd InventoryApi
dotnet run  # API http://localhost:5184 üzerinden çalışır
```

### 🔷 Frontend (React) çalıştırmak için:
```bash
cd envanter-frontend
npm install  # Gerekli paketleri yükler
npm run dev  # Uygulamayı http://localhost:5173 adresinde başlatır
```

---

## 🛠️ Veritabanı Kurulumu

Bu projede fiziksel bir SQL dosyası (`.sql`, `.bak`, `.mdf`) paylaşılmamaktadır.  
Veritabanı yapısı, Entity Framework Core kullanılarak **backend projesi içerisindeki `Migrations/` klasöründe** saklanır.

Başka bir kullanıcı bu projeyi kendi bilgisayarına indirip aşağıdaki adımlarla veritabanını sıfırdan oluşturabilir:

### 🧩 Gereksinimler

- Microsoft SQL Server (örn: SQL Server Express 2019+)
- .NET SDK (7.0+)
- Visual Studio veya Visual Studio Code
- EF Core CLI (`dotnet ef`)

### 🧪 Adımlar

1. **Proje dizinine girin:**
```bash
cd inventory-stock-system/InventoryApi
```

2. **appsettings.json içindeki bağlantı cümlesini kendi bilgisayarınıza göre düzenleyin:**
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\SQLEXPRESS;Database=Deneme;Trusted_Connection=True;"
}
```

3. **Aşağıdaki komutla veritabanını oluşturun:**
```bash
dotnet ef database update
```

> Bu işlem, veritabanını `Migrations/` klasöründeki tanımlara göre sıfırdan oluşturur.

---

## 📝 Temel Özellikler

- ✅ Ürün ekleme, silme, güncelleme ve listeleme
- ✅ Kategori bazlı ürün filtreleme
- ✅ Stok giriş ve çıkış işlemleri
- ✅ Kritik stok seviyesi uyarı sistemi
- ✅ Son silinen ürünlerin gösterimi
- ✅ Responsive tasarım ve animasyonlu bildirimler
- ✅ Modern, sade ve kullanıcı dostu arayüz

---

## 👤 Geliştirici

**Hamza Taşbay**  
📧 E-posta: `T_4517-Hamza-4518@outlook.com`  
📍 Lokasyon: İstanbul / Beykoz  
🔗 https://www.linkedin.com/in/hamza-taşbay-3b7b94304/  
🔗 https://github.com/HmzT270

---

> 💡 Bu proje, yazılım geliştirme stajı sürecinde full-stack bir uygulama olarak geliştirilmiştir. Hem backend hem frontend yapıları bir arada barındırır.

---

> ⚠️ Not: Proje geliştirme sürecinde sadece HTTP (`http://localhost:5184`) kullanılmıştır. 
> HTTPS yönlendirme `Program.cs` üzerinden kaldırılmıştır. 
> Yayına alınması durumunda HTTPS desteği kolayca tekrar eklenebilir.