import type { Subject } from '../types/subject.types';
import type { ElectiveOption } from '../types/electiveOption.types';
import type { ElectiveSlot, ElectiveKind } from '../types/electiveSlot.types';

interface HumanitiesOption {
    id: string;
    credits: number;
    }

interface SelectedElective {
    id: string;
    }

export interface CategorySummary {
    completed: number;
    total: number;
    }

export interface CreditsSummary {
    obrigatorias: CategorySummary;
    condicionada: CategorySummary;
    humanidades: CategorySummary;
    livres: CategorySummary;
    total: CategorySummary;
    }

const NOMINAL_CREDITS_PER_SLOT = 4;

export function computeCreditsSummary(
    subjects: Subject[],
    electives: ElectiveOption[],
    humanities: HumanitiesOption[],
    electiveSlots: ElectiveSlot[],
    completedIds: string[],
    selectedElectives: Record<string, SelectedElective>,
): CreditsSummary {
    const completedSet = new Set(completedIds);
    const electiveCreditsById = new Map(electives.map((e) => [e.id, e.credits]));
    const humanityCreditsById = new Map(humanities.map((h) => [h.id, h.credits]));

    const obrigatoriasTotal = subjects.reduce((sum, s) => sum + s.credits, 0);
    const obrigatoriasCompleted = subjects
        .filter((s) => completedSet.has(s.id))
        .reduce((sum, s) => sum + s.credits, 0);

    function summarizeKind(kind: ElectiveKind, creditsById: Map<string, number>): CategorySummary {
        const slots = electiveSlots.filter((slot) => slot.kind === kind);
        const total = slots.length * NOMINAL_CREDITS_PER_SLOT;

        let completed = 0;
        for (const slot of slots) {
        const selected = selectedElectives[slot.id];
        if (!selected || !completedSet.has(selected.id)) continue;
        completed += creditsById.get(selected.id) ?? NOMINAL_CREDITS_PER_SLOT;
        }

        return { completed, total };
    }

    const condicionada = summarizeKind('condicionada', electiveCreditsById);
    const humanidadesSummary = summarizeKind('humanidades', humanityCreditsById);
    const livres = summarizeKind('livre', new Map());

    return {
        obrigatorias: { completed: obrigatoriasCompleted, total: obrigatoriasTotal },
        condicionada,
        humanidades: humanidadesSummary,
        livres,
        total: {
        completed: obrigatoriasCompleted + condicionada.completed + humanidadesSummary.completed + livres.completed,
        total: obrigatoriasTotal + condicionada.total + humanidadesSummary.total + livres.total,
        },
    };
}