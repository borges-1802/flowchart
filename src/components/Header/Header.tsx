import { Sun, Moon } from 'lucide-react';

const CURRICULUM_URL = 'https://ic.ufrj.br/info/grade-curricular-bcc/';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header
      className={`flex items-center justify-between border-b px-6 py-3 ${
        isDark ? 'border-neutral-800 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-900'
      }`}
    >
      <h1 className="m-0 text-3xl font-bold">Flowchart v2</h1>

      <div className="flex items-center gap-2">
        <a
          href={CURRICULUM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-lg px-3 py-2 text-sm font-medium text-current ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          Grade Curricular
        </a>

        <button
          type="button"
          aria-label="Alternar tema claro e escuro"
          onClick={onToggleTheme}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-current ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}