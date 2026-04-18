import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import FormationsPage from './pages/FormationsPage';
import DossiersPage from './pages/DossiersPage';
import InscriptionsPage from './pages/InscriptionsPage';
import PresencesPage from './pages/PresencesPage';
import CertificatsPage from './pages/CertificatsPage';
import MesFormationsPage from './pages/MesFormationsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage/></ProtectedRoute>}/>
          <Route path="/users" element={<ProtectedRoute adminOnly><UsersPage/></ProtectedRoute>}/>
          <Route path="/roles" element={<ProtectedRoute adminOnly><RolesPage/></ProtectedRoute>}/>
          <Route path="/formations" element={<ProtectedRoute><FormationsPage/></ProtectedRoute>}/>
          <Route path="/dossiers" element={<ProtectedRoute respOnly><DossiersPage/></ProtectedRoute>}/>
          <Route path="/inscriptions" element={<ProtectedRoute respOnly><InscriptionsPage/></ProtectedRoute>}/>
          <Route path="/presences" element={<ProtectedRoute><PresencesPage/></ProtectedRoute>}/>
          <Route path="/certificats" element={<ProtectedRoute><CertificatsPage/></ProtectedRoute>}/>
          <Route path="/mes-formations" element={<ProtectedRoute><MesFormationsPage/></ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3500} newestOnTop theme="light"
        toastStyle={{fontFamily:'Inter,sans-serif',fontSize:'0.86rem',borderRadius:10}}/>
    </AuthProvider>
  );
}
