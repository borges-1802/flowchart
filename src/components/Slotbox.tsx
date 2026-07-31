import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import type { ElectiveSlot, ElectiveKind } from '../types/electiveSlot.types';
import type { SubjectStatus } from '../types/subject.types';

interface SelectedElective {
  id: string;
  name: string;
  shortName: string;
}

interface SlotBoxProps {
  slot: ElectiveSlot;
  selected: SelectedElective | null;
  status: SubjectStatus;
  isSelected: boolean;
  onClick: () => void;
  onOpenPicker: () => void;
  onRemove: () => void;
  theme: 'dark' | 'light';
  showRequirementOverride: boolean;
  onConfirmOverride: () => void;
  onDismissOverride: () => void;
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
const VIEWPORT_MARGIN = 8;
const ACTIONS_WIDTH = 128;
const OVERRIDE_WIDTH = 224;

function computeCenteredOffset(triggerRect: DOMRect, popoverWidth: number): number {
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const idealLeft = triggerCenter - popoverWidth / 2;
  const idealRight = idealLeft + popoverWidth;

  const minLeft = VIEWPORT_MARGIN;
  const maxRight = window.innerWidth - VIEWPORT_MARGIN;

  let clampedLeft = idealLeft;
  if (idealLeft < minLeft) {
    clampedLeft = minLeft;
  } else if (idealRight > maxRight) {
    clampedLeft = maxRight - popoverWidth;
  }

  return clampedLeft - idealLeft;
}

export function SlotBox({
  slot,
  selected,
  status,
  isSelected,
  onClick,
  onOpenPicker,
  onRemove,
  theme,
  showRequirementOverride,
  onConfirmOverride,
  onDismissOverride,
}: SlotBoxProps) {
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [menuOffset, setMenuOffset] = useState(0);
  const [overrideOffset, setOverrideOffset] = useState(0);
  const isDark = theme === 'dark';

  const baseColorClass = selected ? statusColorClasses[status] : kindColorClasses[slot.kind];

  function startHold() {
    if (!selected || !isSelected) return;

    didHoldRef.current = false;
    setIsHolding(true);

    holdTimeoutRef.current = setTimeout(() => {
      didHoldRef.current = true;
      setIsHolding(false);
      setShowActions(true);
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

  function handleTrocar() {
    setShowActions(false);
    onOpenPicker();
  }

  function handleRemover() {
    setShowActions(false);
    onRemove();
  }

  useEffect(() => {
    if (!showActions) return;
    function handleOutsideClick(event: globalThis.MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showActions]);

  useLayoutEffect(() => {
    if (!showActions || !wrapperRef.current) return;
    const triggerRect = wrapperRef.current.getBoundingClientRect();
    setMenuOffset(computeCenteredOffset(triggerRect, ACTIONS_WIDTH));
  }, [showActions]);

  useLayoutEffect(() => {
    if (!showRequirementOverride || !wrapperRef.current) return;
    const triggerRect = wrapperRef.current.getBoundingClientRect();
    setOverrideOffset(computeCenteredOffset(triggerRect, OVERRIDE_WIDTH));
  }, [showRequirementOverride]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        id={selected ? `subject-${selected.id}` : undefined}
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onClick={handleClick}
        className={`relative flex h-13.5 w-full items-center justify-center overflow-hidden rounded-[10px] px-2 text-center text-xs font-semibold leading-tight text-white transition-transform duration-200 active:scale-95 ${baseColorClass} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 bg-[#C13584] transition-[width] ease-linear ${
            isHolding ? 'w-full duration-1000' : 'w-0 duration-150'
          }`}
        />
        <span className="relative z-10">
          {selected ? (
            <>
              <span className="hidden sm:inline">{selected.name}</span>
              <span className="inline sm:hidden">{selected.shortName}</span>
            </>
          ) : (
            kindLabels[slot.kind]
          )}
        </span>
      </button>

      {showActions && (
        <div
          onClick={(event) => event.stopPropagation()}
          style={{ transform: `translateX(calc(-50% + ${menuOffset}px))` }}
          className={`absolute left-1/2 top-full z-50 mt-2 w-32 rounded-xl p-1.5 shadow-xl ${
            isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
          }`}
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleTrocar}
              className={`rounded-lg py-1 text-xs font-medium ${
                isDark ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Trocar
            </button>
            <button
              type="button"
              onClick={handleRemover}
              className="rounded-lg bg-red-400 py-1 text-xs font-semibold text-white hover:bg-red-500"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {showRequirementOverride && (
        <div
          onClick={(event) => event.stopPropagation()}
          style={{ transform: `translateX(calc(-50% + ${overrideOffset}px))` }}
          className={`absolute left-1/2 top-full z-50 mt-2 w-56 rounded-xl p-3 shadow-xl ${
            isDark ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900'
          }`}
        >
          <p className="mb-2.5 text-sm">Pré-requisito não cumprido. Concluir mesmo assim?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onConfirmOverride}
              className="flex-1 rounded-lg bg-red-400 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
            >
              Sim
            </button>
            <button
              type="button"
              onClick={onDismissOverride}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium ${
                isDark ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  );
}