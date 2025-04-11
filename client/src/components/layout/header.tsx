import { Link } from "wouter";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">
                  MC
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-neutral-800">MindConnect</h1>
                <p className="text-sm text-neutral-500">Telehealth Services</p>
              </div>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className="text-primary font-medium">Home</a>
            </Link>
            <Link href="/appointment">
              <a className="text-neutral-600 hover:text-primary transition-colors">Appointments</a>
            </Link>
            <a href="#services" className="text-neutral-600 hover:text-primary transition-colors">Services</a>
            <a href="#about" className="text-neutral-600 hover:text-primary transition-colors">About Us</a>
            <a href="#contact" className="text-neutral-600 hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="md:hidden">
            <button 
              type="button" 
              className="text-neutral-600 hover:text-primary focus:outline-none"
              onClick={onMenuToggle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center">
            <Link href="/admin/login">
              <button type="button" className="ml-4 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Admin Panel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
