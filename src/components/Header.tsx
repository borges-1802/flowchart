import { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

const CURRICULUM_URL = 'https://ic.ufrj.br/info/grade-curricular-bcc/';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDark = theme === 'dark';
  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header
      className={`relative flex items-center justify-between border-b px-6 py-3 ${
        isDark ? 'border-neutral-800 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-900'
      }`}
    >
      <h1 className="m-0 text-3xl font-bold">Flowchart v2</h1>

      <div className="hidden items-center gap-2 sm:flex">
        <a
          href={CURRICULUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-3 py-2 text-sm font-medium text-current ${hoverClass}`}
        >
          Grade Curricular
        </a>

        <button
          type="button"
          aria-label="Alternar tema claro e escuro"
          onClick={onToggleTheme}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-current ${hoverClass}`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <button
        type="button"
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setIsMenuOpen((open) => !open)}
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-current sm:hidden ${hoverClass}`}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isMenuOpen && (
        <div
          className={`absolute right-4 top-full z-50 mt-2 flex w-48 flex-col gap-1 rounded-lg border p-2 shadow-lg sm:hidden ${
            isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
          }`}
        >
          <a
            href={CURRICULUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className={`rounded-lg px-3 py-2 text-sm font-medium text-current ${hoverClass}`}
          >
            Grade Curricular
          </a>

          <button
            type="button"
            onClick={() => {
              onToggleTheme();
              closeMenu();
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-current ${hoverClass}`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? 'Modo claro' : 'Modo escuro'}
          </button>
        </div>
      )}
    </header>
  );
}