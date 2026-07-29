import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALLED_STORAGE_KEY = 'flowchart:pwa-installed';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const matchesDisplayMode = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  return matchesDisplayMode || iosStandalone;
}

function readPersistedInstalled(): boolean {
  try {
    return localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function persistInstalled() {
  try {
    localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
  } catch {
    // localStorage indisponível — segue sem persistir, só como estado da sessão.
  }
}


interface Snapshot {
  installEvent: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
}

let installEvent: BeforeInstallPromptEvent | null = null;
let isInstalled = checkIsStandalone() || readPersistedInstalled();
const listeners = new Set<() => void>();

let cachedSnapshot: Snapshot = { installEvent, isInstalled };

function updateSnapshot() {
  cachedSnapshot = { installEvent, isInstalled };
}

function notify() {
  updateSnapshot();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cachedSnapshot;
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    if (isInstalled) return;
    installEvent = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    installEvent = null;
    isInstalled = true;
    persistInstalled();
    notify();
  });
}

async function promptInstall() {
  if (!installEvent) return;
  const event = installEvent;
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === 'accepted') {
    isInstalled = true;
    persistInstalled();
  }
  installEvent = null;
  notify();
}

export function usePwaInstall() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    canInstall: snapshot.installEvent !== null && !snapshot.isInstalled,
    isInstalled: snapshot.isInstalled,
    promptInstall,
  };
}