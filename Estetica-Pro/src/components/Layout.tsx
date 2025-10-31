import { useState } from 'react';
import { Calendar, Users, CreditCard, Package, BarChart3, Home, Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import logo from '../assets/logo.png';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'appointments', label: 'Turnos', icon: Calendar },
  { id: 'payments', label: 'Pagos', icon: CreditCard },
  { id: 'inventory', label: 'Stock', icon: Package },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
];

export function Layout({ children, currentView, onViewChange, isLoggedIn, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div  className={ isLoggedIn ? 'min-h-screen bg-background' : 'min-h-screen login-bg' }>
      {isLoggedIn && (
        <>
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-header border-r transform transition-transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:inset-0
          `}>
            <div className="flex items-center justify-between pt-2 border-b">
              <img 
                style={{ width: "100%", height: "235px", marginTop: "-30px", marginBottom: "-45px" }} 
                src={logo} alt="Mi logo" 
              />
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "buttonAdd" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      onViewChange(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Header */}
          <header className="bg-header border-b p-4 flex items-center justify-between lg:ml-64">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold capitalize">
                {navigationItems.find(item => item.id === currentView)?.label || 'Dashboard'}
              </h2>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </header>
        </>
      )}

      {/* Main content */}
      <main className={`${isLoggedIn ? 'lg:ml-64 p-4 lg:p-6' : 'p-4 lg:p-6 flex justify-center items-center min-h-screen'}`}>
        {children}
      </main>
    </div>
  );
}