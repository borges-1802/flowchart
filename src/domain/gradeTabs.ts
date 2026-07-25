export interface TabData {
  placedIds: string[];
  colorAssignments: Record<string, number>;
}

export type TabId = 'A' | 'B' | 'C';
export type TabsState = Record<TabId, TabData>;

function emptyTab(): TabData {
  return { placedIds: [], colorAssignments: {} };
}

export function emptyTabsState(): TabsState {
  return { A: emptyTab(), B: emptyTab(), C: emptyTab() };
}

export function getMigratedTabsState(): TabsState {
  try {
    const oldPlacedIds = localStorage.getItem('grade:placedIds');
    const oldColorAssignments = localStorage.getItem('grade:colorAssignments');

    if (!oldPlacedIds && !oldColorAssignments) {
      return emptyTabsState();
    }

    const placedIds: string[] = oldPlacedIds ? JSON.parse(oldPlacedIds) : [];
    const colorAssignments: Record<string, number> = oldColorAssignments ? JSON.parse(oldColorAssignments) : {};

    localStorage.removeItem('grade:placedIds');
    localStorage.removeItem('grade:colorAssignments');

    return { A: { placedIds, colorAssignments }, B: emptyTab(), C: emptyTab() };
  } catch {
    return emptyTabsState();
  }
}