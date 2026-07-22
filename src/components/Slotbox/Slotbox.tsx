import { useRef, useState, type MouseEvent } from 'react';
import type { ElectiveSlot, ElectiveKind } from '../../types/electiveSlot.types';
import type { SubjectStatus } from '../../types/subject.types';

interface SelectedElective {
  id: string;
  name: string;
}

interface SlotBoxProps {
  slot: ElectiveSlot;
  selected: SelectedElective | null;
  status: SubjectStatus;
  isSelected: boolean;
  onClick: () => void;
  onOpenPicker: () => void;
}

const kindColorClasses: Record<ElectiveKind, string> = {
  livre: 'bg-zinc-600',
  humanidades: 'bg-zinc-400',
  condicionada: 'bg-pink-500',
};

const kindLabels: Record<ElectiveKind, string> = {
  livre: 'Livre escolha',
  humanidades: 'Humanidades',
  condicionada: 'Eletiva do curso',
};

const statusColorClasses: Record<SubjectStatus, string> = {
  locked: 'bg-neutral-500',
  available: 'bg-red-400',
  completed: 'bg-green-500',
  'highlighted-pre': 'bg-blue-500',
  'highlighted-post': 'bg-purple-500',
};

const HOLD_DURATION_MS = 1000;

export function SlotBox({ slot, selected, status, isSelected, onClick, onOpenPicker }: SlotBoxProps) {
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldRef = useRef(false);
  const [isHolding, setIsHolding] = useState(false);

  const baseColorClass = selected ? statusColorClasses[status] : kindColorClasses[slot.kind];

  function startHold() {
    if (!selected || !isSelected) return;

    didHoldRef.current = false;
    setIsHolding(true);

    holdTimeoutRef.current = setTimeout(() => {
      didHoldRef.current = true;
      setIsHolding(false);
      onOpenPicker();
    }, HOLD_DURATION_MS);
  }

  function cancelHold() {
    setIsHolding(false);
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  }

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (didHoldRef.current) {
      didHoldRef.current = false;
      return;
    }

    if (!selected) {
      onOpenPicker();
      return;
    }

    onClick();
  }

  return (
    <button
      type="button"
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onClick={handleClick}
      className={`relative flex h-[58px] w-full items-center justify-center overflow-hidden rounded-[10px] px-2.5 text-center text-xs font-semibold leading-tight text-white transition-transform duration-200 active:scale-95 ${baseColorClass} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 bg-[#C13584] transition-[width] ease-linear ${
          isHolding ? 'w-full duration-1000' : 'w-0 duration-150'
        }`}
      />
      <span className="relative z-10">{selected ? selected.name : kindLabels[slot.kind]}</span>
    </button>
  );
}