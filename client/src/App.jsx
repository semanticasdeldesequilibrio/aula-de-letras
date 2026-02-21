import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Explorar from './pages/Explorar'
import PlanDetalle from './pages/PlanDetalle'
import CrearPlan from './pages/CrearPlan'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import MisPlanes from './pages/MisPlanes'
import Favoritos from './pages/Favoritos'
import Mensajes from './pages/Mensajes'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminModeracion from './pages/admin/Moderacion'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/plan/:id" element={<PlanDetalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil/:id" element={<Perfil />} />
          
          {/* Protected routes */}
          <Route path="/crear-plan" element={
            <ProtectedRoute>
              <CrearPlan />
            </ProtectedRoute>
          } />
          <Route path="/mis-planes" element={
            <ProtectedRoute>
              <MisPlanes />
            </ProtectedRoute>
          } />
          <Route path="/favoritos" element={
            <ProtectedRoute>
              <Favoritos />
            </ProtectedRoute>
          } />
          <Route path="/mensajes" element={
            <ProtectedRoute>
              <Mensajes />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/moderacion" element={
            <ProtectedRoute requiredRole="admin">
              <AdminModeracion />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
