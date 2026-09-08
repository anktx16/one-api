import { Link, useLocation, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { BookOpen, Key, CreditCard, LayoutDashboard, LogOut } from 'lucide-react'
import { LogoMark } from '@/components/LogoMark'
import { useAuth } from '@/hooks/useAuth'
import { useElysiaClient } from '@/providers/Eden'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/docs', label: 'Docs', icon: BookOpen },
  { path: '/api-keys', label: 'API Keys', icon: Key },
  { path: '/credits', label: 'Credits', icon: CreditCard },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const elysiaClient = useElysiaClient();
  async function handleSignOut() {
    try {
      await elysiaClient.auth['sign-out'].post();
      navigate("/");
    }
    catch(error) {
      console.error("Error: ", error);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/55 shadow-[0_10px_30px_oklch(0_0_0_/_22%)] backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <LogoMark className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">oneApi</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={isActive ? 'font-semibold' : 'text-muted-foreground'}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </div>
          <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}
