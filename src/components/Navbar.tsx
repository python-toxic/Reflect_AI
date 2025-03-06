import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function Navbar() {
  return (
    <PageTransition>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/30 border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className=" flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">ReflectAI</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/journal" className="text-foreground/80 hover:text-primary transition-colors">
                Journal
              </Link>
              <Link to="/counselor" className="text-foreground/80 hover:text-primary transition-colors">
                Counselor
              </Link>
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/login" className="text-foreground/80 hover:text-primary transition-colors">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </PageTransition>
  );
}