import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export type TabId = 'A' | 'B' | 'C';

interface GradeTabsProps {
  theme: 'dark' | 'light';
  activeTab: TabId;
  tabNames: Record<TabId, string>;
  onChange: (tab: TabId) => void;
  onRename: (tab: TabId, name: string) => void;
  onClearTab: () => void;
}

const TAB_IDS: TabId[] = ['A', 'B', 'C'];

export function GradeTabs({ theme, activeTab, tabNames, onChange, onRename, onClearTab }: GradeTabsProps) {
  const isDark = theme === 'dark';
  const [editingTab, setEditingTab] = useState<TabId | null>(null);
  const [draftName, setDraftName] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);

  function startEditing(tabId: TabId) {
    setEditingTab(tabId);
    setDraftName(tabNames[tabId]);
  }

  function commitEditing() {
    if (editingTab) {
      const trimmed = draftName.trim();
      onRename(editingTab, trimmed || `Grade ${editingTab}`);
    }
    setEditingTab(null);
  }

  function handleClearClick() {
    if (confirmingClear) {
      onClearTab();
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
    }
  }

  return (
    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
      {confirmingClear ? (
        <div
          className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
            isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          <span>Limpar "{tabNames[activeTab]}"?</span>
          <button
            type="button"
            onClick={handleClearClick}
            className="rounded-md bg-red-500 px-2 py-1 font-semibold text-white hover:bg-red-400"
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => setConfirmingClear(false)}
            className={`rounded-md px-2 py-1 font-medium ${
              isDark ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600' : 'bg-neutral-300 text-neutral-700 hover:bg-neutral-400'
            }`}
          >
            Não
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClearClick}
          title={`Limpar todas as disciplinas de "${tabNames[activeTab]}"`}
          aria-label="Limpar grade ativa"
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isDark ? 'text-neutral-500 hover:bg-red-500/20 hover:text-red-400' : 'text-neutral-400 hover:bg-red-100 hover:text-red-600'
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {TAB_IDS.map((tabId) => {
        const isActive = tabId === activeTab;
        const isEditing = editingTab === tabId;

        const activeClass = isDark ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white';
        const inactiveClass = isDark
          ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300';

        if (isEditing) {
          return (
            <input
              key={tabId}
              autoFocus
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              onBlur={commitEditing}
              onKeyDown={(event) => {
                if (event.key === 'Enter') commitEditing();
                if (event.key === 'Escape') setEditingTab(null);
              }}
              className={`w-28 rounded-lg px-3 py-1.5 text-sm font-medium outline-none ring-2 ring-blue-400 ${
                isDark ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-900'
              }`}
            />
          );
        }

        return (
          <button
            key={tabId}
            type="button"
            onClick={() => {
              onChange(tabId);
              setConfirmingClear(false);
            }}
            onDoubleClick={() => startEditing(tabId)}
            title="Clique duas vezes pra renomear"
            className={`truncate rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive ? activeClass : inactiveClass
            }`}
          >
            {tabNames[tabId]}
          </button>
        );
      })}
    </div>
  );
}