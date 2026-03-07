import { useState, useEffect } from 'react'; 
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Appointments } from './components/Appointments';
import { Payments } from './components/Payments';
import { Inventory } from './components/Inventory';
import Reports from './components/Reports';
import AuthForm from './components/AuthForm';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Al cargar la app, se verifica si el usuario ya estaba logueado
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); 
    setCurrentView('dashboard'); 
  };

  const renderCurrentView = () => {
    if (!isLoggedIn) {
      return <AuthForm onLogin={handleLogin} />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView}/>;
      case 'clients':
        return <Clients />;
      case 'appointments':
        return <Appointments />;
      case 'payments':
        return <Payments />;
      case 'inventory':
        return <Inventory />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard onViewChange={setCurrentView}/>;
    }
  };

  return (
    <Layout currentView={currentView} isLoggedIn={isLoggedIn} 
    onViewChange={setCurrentView} onLogout={handleLogout}>
      {renderCurrentView()}
    </Layout>
  );
}
