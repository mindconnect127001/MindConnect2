import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden">
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium text-neutral-900">Menu</h2>
          <button
            type="button"
            className="text-neutral-500 hover:text-neutral-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            <li>
              <Link href="/">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-100" onClick={onClose}>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/appointment">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-100" onClick={onClose}>Appointments</a>
              </Link>
            </li>
            <li>
              <a href="#services" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-100" onClick={onClose}>Services</a>
            </li>
            <li>
              <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-100" onClick={onClose}>About Us</a>
            </li>
            <li>
              <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 hover:bg-neutral-100" onClick={onClose}>Contact</a>
            </li>
            <li className="pt-4 border-t mt-4">
              <Link href="/admin/login">
                <a className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90 text-center" onClick={onClose}>Admin Panel</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
