import { useState } from 'react';

export interface SearchableSubject {
  id: string;
  name: string;
  shortName: string;
}

interface SubjectSearchProps {
  theme: 'dark' | 'light';
  options: SearchableSubject[];
  onSelect: (id: string) => void;
}

export function SubjectSearch({ theme, options, onSelect }: SubjectSearchProps) {
  const [query, setQuery] = useState('');
  const isDark = theme === 'dark';

  const trimmedQuery = query.trim().toLowerCase();
  const results =
    trimmedQuery.length > 0
      ? options.filter(
          (option) =>
            option.name.toLowerCase().includes(trimmedQuery) ||
            option.shortName.toLowerCase().includes(trimmedQuery) ||
            option.id.toLowerCase().includes(trimmedQuery),
        )
      : [];

  function handleSelect(id: string) {
    onSelect(id);
    setQuery('');
  }

  return (
    <div className="relative mx-auto mb-3 w-full max-w-sm px-4" onClick={(event) => event.stopPropagation()}>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar disciplina..."
        className={`w-full rounded-lg border px-3 py-2 text-sm ${
          isDark ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500' : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'
        }`}
      />

      {trimmedQuery.length > 0 && (
        <div
          className={`absolute left-4 right-4 top-full z-40 mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-lg ${
            isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'
          }`}
        >
          {results.length > 0 ? (
            results.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={`block w-full truncate px-3 py-2 text-left text-sm ${
                  isDark ? 'text-white hover:bg-neutral-800' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span className="font-medium">{option.id}</span> · {option.name}
              </button>
            ))
          ) : (
            <p className={`px-3 py-2 text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Nenhuma disciplina encontrada.
            </p>
          )}
        </div>
      )}
    </div>
  );
}