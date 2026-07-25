import { Header } from '../components/Header';
import { usePersistedState } from '../hooks/usePersistedState';

export function About() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const isDark = theme === 'dark';

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  const cardClass = isDark ? 'bg-neutral-900' : 'bg-neutral-100';
  const labelClass = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const bodyClass = isDark ? 'text-neutral-300' : 'text-neutral-700';

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <div className={`min-h-screen p-4 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-1 text-xl font-bold">Sobre</h2>
          <p className={`mb-6 text-sm ${labelClass}`}>Como usar o site, e de onde ele veio.</p>

          <div className={`mb-4 rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">Fluxograma</h3>
            <ul className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${bodyClass}`}>
              <li>Clique numa disciplina pra ver detalhes e destacar pré e pós-requisitos.</li>
              <li>Clique de novo na mesma disciplina pra marcar como concluída (só funciona se os pré-requisitos já estiverem feitos).</li>
              <li>Clique numa vaga de eletiva vazia pra escolher o que vai cursar ali.</li>
              <li>Segure o dedo/clique numa vaga já preenchida por 1 segundo pra trocar a escolha.</li>
            </ul>
          </div>

          <div className={`mb-4 rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">Montar Grade</h3>
            <ul className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${bodyClass}`}>
              <li>Clique duas vezes numa disciplina da lista pra encaixar ela na grade de horários.</li>
              <li>Cada disciplina ganha uma cor sorteada ao ser encaixada pela primeira vez.</li>
              <li>Se o horário já estiver ocupado, aparece um selo mostrando o conflito.</li>
              <li>Pra remover, clique no X dentro do item já encaixado na lista.</li>
            </ul>
          </div>

          <div className={`rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">Créditos</h3>
            <p className={`text-sm leading-relaxed ${bodyClass}`}>
              Esta é uma nova versão do fluxograma interativo da grade curricular de Ciência da Computação da UFRJ,
              criado originalmente por{' '}
              <a
                href="https://henrichris.github.io/flowchart"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2"
              >
                Henrique Chrispim
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}