interface RequirementOverrideProps {
  theme: 'dark' | 'light';
  onConfirm: () => void;
  onDismiss: () => void;
}

export function RequirementOverride({ theme, onConfirm, onDismiss }: RequirementOverrideProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-wrap items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-3 shadow-lg ${
        isDark ? 'border-amber-500/50 bg-neutral-900 text-amber-400' : 'border-amber-500/60 bg-white text-amber-700'
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-sm font-medium">Quebrou requisito? (marcar como concluída mesmo sem o pré-requisito)</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400"
        >
          Sim
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium ${
            isDark ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' : 'bg-white text-neutral-700 hover:bg-neutral-100'
          }`}
        >
          Não
        </button>
      </div>
    </div>
  );
}