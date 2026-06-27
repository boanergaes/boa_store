import { Routes, Route } from 'react-router-dom'
import './App.css'
import { CartProvider } from './contexts/CartContext'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </CartProvider>
  )
}

export default App
