import type { ElectiveSlot, ElectiveKind } from '../../types/electiveSlot.types';

interface SlotBoxProps {
  slot: ElectiveSlot;
  selectedName: string | null;
  onClick: () => void;
}

const kindColorClasses: Record<ElectiveKind, string> = {
  livre: 'bg-amber-500',
  humanidade: 'bg-teal-500',
  condicionada: 'bg-pink-500',
};

const kindLabels: Record<ElectiveKind, string> = {
  livre: 'Livre escolha',
  humanidade: 'Humanidade',
  condicionada: 'Eletiva do curso',
};

export function SlotBox({ slot, selectedName, onClick }: SlotBoxProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`flex h-[58px] w-full items-center justify-center rounded-[10px] px-2.5 text-center text-xs font-semibold leading-tight text-white ${kindColorClasses[slot.kind]}`}
    >
      {selectedName ?? kindLabels[slot.kind]}
    </button>
  );
}