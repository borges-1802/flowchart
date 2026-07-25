import { useState } from 'react';

export type TabId = 'A' | 'B' | 'C';

interface GradeTabsProps {
  theme: 'dark' | 'light';
  activeTab: TabId;
  tabNames: Record<TabId, string>;
  onChange: (tab: TabId) => void;
  onRename: (tab: TabId, name: string) => void;
}

const TAB_IDS: TabId[] = ['A', 'B', 'C'];

export function GradeTabs({ theme, activeTab, tabNames, onChange, onRename }: GradeTabsProps) {
  const isDark = theme === 'dark';
  const [editingTab, setEditingTab] = useState<TabId | null>(null);
  const [draftName, setDraftName] = useState('');

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

  return (
    <div className="mb-3 flex justify-end gap-2">
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
            onClick={() => onChange(tabId)}
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