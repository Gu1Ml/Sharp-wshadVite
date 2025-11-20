import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Code2, 
  User, 
  Search, 
  Settings,
  Menu,
  X,
  PlusCircle,
  Bell,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // Usuário não autenticado
      }
    };
    loadUser();
  }, []);

  const navigation = [
    { name: "Feed", icon: Home, url: createPageUrl("Feed") },
    { name: "Explorar", icon: Search, url: createPageUrl("Explore") },
    { name: "Portfólio", icon: Code2, url: createPageUrl("Portfolio") },
    { name: "Perfil", icon: User, url: createPageUrl("Profile") },
    { name: "Configurações", icon: Settings, url: createPageUrl("Settings") }
  ];

  const handleLogout = () => {
    base44.auth.logout();
  };

  const isActive = (url) => location.pathname === url;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        :root {
          --primary: 147 51 234;
          --secondary: 59 130 246;
          --accent: 236 72 153;
        }
        
        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, rgb(147 51 234 / 0.1), rgb(59 130 246 / 0.1));
          border: 1px solid rgb(147 51 234 / 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, rgb(147 51 234), rgb(59 130 246));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl px-6 pb-4">
          <div className="flex h-20 shrink-0 items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Sharp</h1>
              <p className="text-xs text-slate-400">Dev Network</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.url}
                className={`group flex gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive(item.url)
                    ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive(item.url) ? 'text-purple-400' : ''}`} />
                {item.name}
              </Link>
            ))}

            <Button
              onClick={() => navigate(createPageUrl("CreatePost"))}
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Post
            </Button>
          </nav>

          {user && (
            <div className="gradient-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.full_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.full_name || 'Usuário'}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Sharp</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl">
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive(item.url)
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40">
        <div className="flex justify-around items-center h-16 px-4">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={item.url}
              className={`flex flex-col items-center gap-1 ${
                isActive(item.url) ? 'text-purple-400' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}