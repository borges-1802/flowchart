import { forwardRef } from 'react';
import type { Subject, SubjectStatus } from '../types/subject.types';
import type { ElectiveSlot, ElectiveKind } from '../types/electiveSlot.types';
import type { CreditsSummary, CategorySummary } from '../domain/creditsSummary';

interface SelectedElective {
  id: string;
  name: string;
  shortName: string;
}

interface ExportPortraitGridProps {
  periods: number[];
  subjects: Subject[];
  electiveSlots: ElectiveSlot[];
  selectedElectives: Record<string, SelectedElective>;
  getStatus: (id: string, preRequisites: string[]) => SubjectStatus;
  getElectivePreRequisites: (slot: ElectiveSlot, electiveId: string) => string[];
  summary: CreditsSummary;
}

const statusColors: Record<SubjectStatus, { bg: string; text: string }> = {
  locked: { bg: '#737373', text: '#ffffff' },
  available: { bg: '#f87171', text: '#ffffff' },
  'in-progress': { bg: '#facc15', text: '#171717' },
  completed: { bg: '#16a34a', text: '#ffffff' },
  'highlighted-pre': { bg: '#3b82f6', text: '#ffffff' },
  'highlighted-post': { bg: '#a855f7', text: '#ffffff' },
};

const emptySlotColors: Record<ElectiveKind, { bg: string; text: string }> = {
  livre: { bg: '#52525b', text: '#ffffff' },
  humanidades: { bg: '#a1a1aa', text: '#ffffff' },
  condicionada: { bg: '#ec4899', text: '#ffffff' },
};

const GREEN = '#16a34a';
const YELLOW = '#facc15';
const TRACK = 'rgba(115, 115, 115, 0.4)'; // equivalente a neutral-700/40 em rgba puro
const LABEL_GRAY = '#a3a3a3'; // neutral-400

function completedPercentage(data: CategorySummary): number {
  if (data.total <= 0) return 0;
  return Math.min((data.completed / data.total) * 100, 100);
}

function inProgressPercentage(data: CategorySummary): number {
  if (data.total <= 0) return 0;
  return Math.min((data.inProgress / data.total) * 100, 100 - completedPercentage(data));
}

function ExportProgressRing({ data, size = 48 }: { data: CategorySummary; size?: number }) {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const completedPct = completedPercentage(data);
  const inProgressPct = inProgressPercentage(data);

  const completedOffset = circumference - (completedPct / 100) * circumference;
  const inProgressLength = (inProgressPct / 100) * circumference;
  const inProgressOffset = circumference - inProgressLength;
  const inProgressRotation = (completedPct / 100) * 360;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={center} cy={center} r={radius} fill="none" strokeWidth="5" stroke={TRACK} />
      {inProgressPct > 0 && (
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={inProgressOffset}
          stroke={YELLOW}
          style={{ transform: `rotate(${inProgressRotation}deg)`, transformOrigin: '50% 50%' }}
        />
      )}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={completedOffset}
        stroke={GREEN}
      />
    </svg>
  );
}

function ExportProgressBar({ data }: { data: CategorySummary }) {
  const completedPct = completedPercentage(data);
  const inProgressPct = inProgressPercentage(data);

  return (
    <div style={{ backgroundColor: TRACK }} className="flex h-1 w-full overflow-hidden rounded-full">
      <div style={{ backgroundColor: GREEN, width: `${completedPct}%` }} className="h-full" />
      <div style={{ backgroundColor: YELLOW, width: `${inProgressPct}%` }} className="h-full" />
    </div>
  );
}

function ExportCreditsFooter({ summary }: { summary: CreditsSummary }) {
  const rows = [
    { label: 'Obrigatórias', data: summary.obrigatorias },
    { label: 'Eletivas', data: summary.condicionada },
    { label: 'Humanidades', data: summary.humanidades },
    { label: 'Livres', data: summary.livres },
  ];

  return (
    <div
      style={{ backgroundColor: '#171717', borderColor: '#262626' }}
      className="mt-1 w-full rounded-2xl border p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p style={{ color: LABEL_GRAY }} className="text-[10px] font-semibold uppercase tracking-wide">
            Créditos totais
          </p>
          <p className="text-2xl font-bold text-white">
            {summary.total.completed}
            <span style={{ color: LABEL_GRAY }} className="text-base font-normal">/{summary.total.total}</span>
          </p>
        </div>
        <ExportProgressRing data={summary.total} />
      </div>

      <div style={{ borderTop: '1px solid #262626' }} className="pt-3">
        {rows.map((row) => (
          <div key={row.label} className="mb-2.5 last:mb-0">
            <div className="mb-1 flex items-center justify-between text-xs text-white">
              <span style={{ color: LABEL_GRAY }}>{row.label}</span>
              <span className="font-medium">
                {row.data.completed}/{row.data.total}
              </span>
            </div>
            <ExportProgressBar data={row.data} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const ExportPortraitGrid = forwardRef<HTMLDivElement, ExportPortraitGridProps>(
  function ExportPortraitGrid(
    { periods, subjects, electiveSlots, selectedElectives, getStatus, getElectivePreRequisites, summary },
    ref,
  ) {
    return (
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <div
          ref={ref}
          style={{ width: 540, backgroundColor: '#0a0a0a' }}
          className="flex flex-col gap-3 p-4"
        >
          {periods.map((period) => (
            <div key={period} className="flex flex-wrap gap-2">
              {subjects
                .filter((subject) => subject.period === period)
                .map((subject) => {
                  const colors = statusColors[getStatus(subject.id, subject.preRequisites)];
                  return (
                    <div
                      key={subject.id}
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                      className="flex h-20 w-19.5 items-center justify-center rounded-[10px] px-1 text-center text-[11px] font-semibold leading-tight"
                    >
                      {subject.shortName}
                    </div>
                  );
                })}

              {electiveSlots
                .filter((slot) => slot.period === period)
                .map((slot) => {
                  const selected = selectedElectives[slot.id];

                  if (!selected) {
                    const colors = emptySlotColors[slot.kind];
                    return (
                      <div
                        key={slot.id}
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                        className="flex h-20 w-19.5 items-center justify-center rounded-[10px] px-1 text-center text-[10px] font-semibold leading-tight"
                      >
                        Vaga
                      </div>
                    );
                  }

                  const preRequisites = getElectivePreRequisites(slot, selected.id);
                  const colors = statusColors[getStatus(selected.id, preRequisites)];
                  return (
                    <div
                      key={slot.id}
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                      className="flex h-20 w-19.5 items-center justify-center rounded-[10px] px-1 text-center text-[11px] font-semibold leading-tight"
                    >
                      {selected.shortName}
                    </div>
                  );
                })}
            </div>
          ))}

          <ExportCreditsFooter summary={summary} />
        </div>
      </div>
    );
  },
);
