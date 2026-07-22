import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  theme: 'dark' | 'light';
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ theme, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen w-screen items-center justify-center p-4 ${
        isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        ref={modalRef}
        className={`max-h-[80vh] w-full max-w-md overflow-hidden rounded-xl ${
          isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
        }`}
      >
        {children}
      </div>
    </div>
  );
}