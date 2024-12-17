import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const router = useRouter();
  
  return (
    <nav className="bg-[#041E42] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-bold text-xl">MLB Analysis</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                href="/schedule" 
                className={`hover:text-[#E31837] transition-colors ${
                  router.pathname === '/schedule' ? 'text-[#E31837]' : ''
                }`}
              >
                Schedule
              </Link>
              <Link 
                href="/history" 
                className={`hover:text-[#E31837] transition-colors ${
                  router.pathname === '/history' ? 'text-[#E31837]' : ''
                }`}
              >
                History
              </Link>
              <Link 
                href="/favorites" 
                className={`hover:text-[#E31837] transition-colors ${
                  router.pathname === '/favorites' ? 'text-[#E31837]' : ''
                }`}
              >
                Favorites
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-[#E31837] hover:bg-[#C41230] px-4 py-2 rounded-lg 
                             font-semibold transition-colors duration-200">
              My Account
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 