import { useMemo, useState } from 'react';
import { Modal } from '../Modal/Modal';
import electivesData from '../../data/electives.json';
import humanitiesData from '../../data/humanities.json';
import type { ElectiveSlot } from '../../types/electiveSlot.types';
import type { ElectiveOption } from '../../types/electiveOption.types';

interface HumanitiesOption {
  id: string;
  name: string;
  shortName: string;
  credits: number;
}

const electives = electivesData as ElectiveOption[];
const humanities = humanitiesData as HumanitiesOption[];

interface SelectElectiveModalProps {
  slot: ElectiveSlot;
  onSelect: (option: { id: string; name: string }) => void;
  onClose: () => void;
}

export function SelectElectiveModal({ slot, onSelect, onClose }: SelectElectiveModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [freeText, setFreeText] = useState('');

  const pool = slot.kind === 'condicionada' ? electives : slot.kind === 'humanidade' ? humanities : [];

  const filteredOptions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pool.filter(
      (option) => option.name.toLowerCase().includes(query) || option.id.toLowerCase().includes(query),
    );
  }, [pool, searchQuery]);

  if (slot.kind === 'livre') {
    return (
      <Modal onClose={onClose}>
        <div className="p-4">
          <h3 className="mb-3 text-base font-semibold">Disciplina de livre escolha</h3>
          <p className="mb-3 text-xs text-neutral-400">
            Pode ser qualquer disciplina da UFRJ, sem lista fechada. Digite o nome.
          </p>
          <input
            autoFocus
            type="text"
            value={freeText}
            onChange={(event) => setFreeText(event.target.value)}
            placeholder="Nome da disciplina"
            className="mb-3 w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            disabled={!freeText.trim()}
            onClick={() => onSelect({ id: slot.id, name: freeText.trim() })}
            className="w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Confirmar
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-4 pb-2">
        <h3 className="mb-3 text-base font-semibold">
          {slot.kind === 'condicionada' ? 'Escolha uma eletiva do curso' : 'Escolha uma humanidade'}
        </h3>
        <input
          autoFocus
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Pesquisar disciplina..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white"
        />
      </div>

      <ul className="max-h-80 overflow-y-auto px-2 pb-2">
        {filteredOptions.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect({ id: option.id, name: option.name })}
              className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-neutral-800"
            >
              {option.id} | {option.name}
            </button>
          </li>
        ))}
        {filteredOptions.length === 0 && (
          <li className="px-2 py-4 text-center text-sm text-neutral-500">Nenhuma disciplina encontrada.</li>
        )}
      </ul>
    </Modal>
  );
}