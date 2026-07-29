import { Header } from '../components/Header';
import { ComplementaryTracker } from '../components/Complementares/ComplementaryTracker';
import { ActivityTypesList } from '../components/Complementares/ActivityTypesList';
import { usePersistedState } from '../hooks/usePersistedState';
import {
  computeTotalHours,
  GOAL_HOURS,
  type ComplementaryActivity,
  type ComplementaryEntry,
} from '../domain/complementaryHours';
import activitiesData from '../data/complementaryActivities.json';

const activities = activitiesData as ComplementaryActivity[];

export function ComplementaryActivities() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const [entries, setEntries] = usePersistedState<ComplementaryEntry[]>('complementary:entries', []);
  const isDark = theme === 'dark';

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  function handleAdd(entry: ComplementaryEntry) {
    setEntries((current) => [...current, entry]);
  }

  function handleRemove(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  const totalHours = computeTotalHours(entries, activities);
  const pct = Math.min((totalHours / GOAL_HOURS) * 100, 100);
  const isComplete = totalHours >= GOAL_HOURS;

  const cardClass = isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200';
  const bodyClass = isDark ? 'text-neutral-300' : 'text-neutral-700';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <div className={`min-h-screen p-4 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-1 text-xl font-bold">Atividades Complementares</h2>
          <p className={`mb-4 text-sm leading-relaxed ${bodyClass}`}>
            Calculadora das horas de Atividades Complementares com mínimo de {GOAL_HOURS}h pra concluir o RCS.{' '}
            <a
              href="https://ic.ufrj.br/info/atividades-complementares-bcc/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              Normas oficiais
            </a>{' '}
            ·{' '}
            <a
              href="https://ic.ufrj.br/atividades-complementares-bcc/formulario_2022_2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2"
            >
              Formulário de solicitação
            </a>
          </p>

          <div className={`mb-4 rounded-xl border p-5 ${cardClass}`}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}>Total acumulado</p>
              <p className="text-lg font-bold">
                {totalHours}
                <span className="text-sm font-normal text-neutral-500">/{GOAL_HOURS}h</span>
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-700/40">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {isComplete && (
              <p className="mt-2 text-sm font-medium text-green-500">
                Você já atingiu as {GOAL_HOURS}h! Já tá podendo solicitar a inclusão das atividades complementares preenchando o formulário e enviando email para a COAC.
              </p>
            )}
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
            <div className={`rounded-xl border p-5 ${cardClass}`}>
              <ComplementaryTracker
                theme={theme}
                activities={activities}
                entries={entries}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            </div>

            <div className={`rounded-xl border p-5 ${cardClass}`}>
              <p className={`mb-1 text-xs font-semibold uppercase tracking-wide ${labelClass}`}>
                Tipos de atividade e contagem
              </p>
              <ActivityTypesList theme={theme} activities={activities} />
            </div>
          </div>

          <div className={`rounded-xl border p-5 ${cardClass}`}>
            <h3 className="mb-3 text-sm font-semibold">Como conseguir as horas?</h3>
            <ul className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${bodyClass}`}>
              <li>Cada categoria tem um teto próprio de horas e nenhuma passa de 54h.</li>
              <li>Só solicite a inclusão à COAC quando realmente tiver as 90h, com toda a documentação em mãos.</li>
              <li>Essa página apenas ajuda a calcular o seu total parcial.</li>
            </ul>
            <p className={`mt-3 text-xs ${labelClass}`}>
              O pedido oficial de inclusão é feito por e-mail à coac@ic.ufrj.br, com o formulário oficial preenchido e
              os comprovantes de cada atividade (veja os links no topo).
            </p>
          </div>
        </div>
      </div>
    </>
  );
}