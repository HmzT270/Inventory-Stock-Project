import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'

import ProductList from './pages/ProductList'

// import EditProduct from './pages/EditProduct'
import StockMovements from './pages/StockMovements'
import ProductManagement from './pages/ProductManagement'
import ProductEdit from './pages/ProductEdit'
import CategoryEdit from './pages/CategoryEdit'      // <-- EKLENDİ

import Sidebar from './components/Sidebar'
// import Navbar from './components/Navbar'   // ← Bunu sil!
import DeletedProductsTable from './pages/DeletedProductsTable'

function App() {
  return (
    <Router>
      <Sidebar>
        {/* <Navbar /> */}  {/* ← Bunu tamamen kaldır! */}
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<ProductList />} />

          {/* <Route path="/edit-product/:id" element={<EditProduct />} /> */}
          <Route path="/stock" element={<StockMovements />} />
          <Route path="/product-management" element={<ProductManagement />} />
          <Route path="/rename-product" element={<ProductEdit />} />
          <Route path="/deleted-products" element={<DeletedProductsTable />} />
          <Route path="/kategori-duzenle" element={<CategoryEdit />} />  {/* <-- EKLENDİ */}
        </Routes>
      </Sidebar>
    </Router>
  )
}

export default App
