import Link from 'next/link';
import { CircleDot, Search, Menu } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function Header() {
  return (
    <header className="bg-white border-b border-[var(--border-color)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <CircleDot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">
              MLBParlay
            </span>
          </Link>

          {/* Main Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="nav-link rounded-md data-[current=true]:bg-[var(--accent-color)] data-[current=true]:text-black"
              data-current="true"
            >
              MLB
            </Link>
            <Link
              href="/standings"
              className="nav-link rounded-md hover:bg-[var(--accent-color)]"
            >
              Standings
            </Link>
            <Link
              href="/teams"
              className="nav-link rounded-md hover:bg-[var(--accent-color)]"
            >
              Teams
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className="nav-link rounded-md hover:bg-[var(--accent-color)]">
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="nav-link rounded-md hover:bg-[var(--accent-color)] md:hidden">
                  <Menu className="w-5 h-5" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[200px] bg-white rounded-md shadow-lg border border-[var(--border-color)] p-2 mr-2"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="nav-link block rounded-md hover:bg-[var(--accent-color)] cursor-pointer">
                    MLB
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="nav-link block rounded-md hover:bg-[var(--accent-color)] cursor-pointer">
                    Standings
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="nav-link block rounded-md hover:bg-[var(--accent-color)] cursor-pointer">
                    Teams
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </header>
  );
} 