import { Header } from '../components/Header';
import { usePersistedState } from '../hooks/usePersistedState';

const steps = [
  {
    title: 'Clique numa disciplina',
    text: 'pra selecioná-la. Um anel azul aparece e as caixas relacionadas se destacam: pré-requisitos em azul, disciplinas que ela destrava em roxo. O painel abaixo mostra os detalhes.',
  },
  {
    title: 'Clique de novo',
    text: 'na mesma disciplina (já selecionada) pra marcar como concluída ou desmarcar. Só é possível concluir se os pré-requisitos já tiverem sido cumpridos.',
  },
  {
    title: 'Clique fora',
    text: 'de qualquer caixa pra desselecionar.',
  },
  {
    title: 'Vagas de eletiva vazias',
    text: 'abrem um modal de busca ao clicar. Se já estiver preenchida, um clique curto funciona como disciplina normal, segure por 1 segundo pra trocar a escolha.',
  },
  {
    title: '',
    text: 'Cada período tem um botão "Marcar período todo" que conclui tudo que já está disponível e vira "Desmarcar período todo" quando o período estiver 100% completo.',
  },
  {
    title: '',
    text: 'Embaixo do fluxograma, o painel de créditos mostra quanto você já concluiu (total e por categoria: obrigatórias, eletivas, humanidades, livre escolha).',
  },
];

const gradeSteps = [
  {
    title: 'Clique duas vezes',
    text: 'numa disciplina da lista pra encaixar ela na grade, o primeiro clique seleciona e o segundo confirma.',
  },
  {
    title: '',
    text: 'Cada disciplina ganha uma cor sorteada ao ser encaixada pela primeira vez, evitando repetir com o que já está na grade.',
  },
  {
    title: '',
    text: 'Se o horário bater com outra disciplina já encaixada, aparece um selo mostrando o conflito e não deixa encaixar.',
  },
  {
    title: '',
    text: 'Não é possível encaixar duas turmas da mesma disciplina ao mesmo tempo.',
  },
  {
    title: 'Pra remover',
    text: 'clique no X dentro do item já encaixado na lista, ou clique duas vezes direto no quadrado dela na grade.',
  },
  {
    title: '',
    text: 'Você pode montar até 3 grades diferentes (as abas no canto acima da grade) pra comparar opções de horário lado a lado. Cada uma guarda seu próprio conjunto de disciplinas, sem misturar com as outras.',
  },
  {
    title: '',
    text: 'Clique duas vezes no nome de uma aba pra renomear (ex: "Plano A", "Se der ruim"). O nome fica salvo, assim como o conteúdo de cada grade.',
  },
  {
    title: '',
    text: 'O dropdown de período também tem opções pra Eletivas e pra PPGI (Mestrado e Doutorado), caso queira montar uma grade de pós.',
  },
];

const legendLeft = [
  { color: 'bg-red-400', label: 'Disponível (pré-requisitos ok)' },
  { color: 'bg-neutral-500', label: 'Bloqueada (falta pré-requisito)' },
  { color: 'bg-purple-500', label: 'Destravada pela selecionada' },
  { color: 'bg-zinc-400', label: 'Vaga de humanidades' },
];

const legendRight = [
  { color: 'bg-green-500', label: 'Concluída' },
  { color: 'bg-blue-500', label: 'Pré-requisito da selecionada' },
  { color: 'bg-pink-500', label: 'Vaga de eletiva do curso' },
  { color: 'bg-zinc-600', label: 'Vaga de livre escolha' },
];

export function About() {
  const [theme, setTheme] = usePersistedState<'dark' | 'light'>('flowchart:theme', 'dark');
  const isDark = theme === 'dark';

  function handleToggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  const cardClass = isDark ? 'bg-neutral-900' : 'bg-neutral-100';
  const bodyClass = isDark ? 'text-neutral-300' : 'text-neutral-700';
  const badgeClass = isDark ? 'bg-neutral-700 text-white' : 'bg-neutral-300 text-neutral-900';

  return (
    <>
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <div className={`min-h-screen p-4 ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'}`}>
        <div className="mx-auto max-w-2xl">
            <h2 className="mb-1 text-xl font-bold">Sobre</h2>
          <p className={`mb-6 text-sm leading-relaxed ${bodyClass}`}>
            Um mapa interativo da grade curricular do Bacharelado em Ciência da Computação da UFRJ.
          </p>

          <div className={`mb-4 rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-3 text-sm font-semibold">Como usar o fluxograma</h3>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${badgeClass}`}
                  >
                    {index + 1}
                  </span>
                  <p className={`text-sm leading-relaxed ${bodyClass}`}>
                    {step.title && <span className="font-semibold text-current">{step.title} </span>}
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className={`mb-4 rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-3 text-sm font-semibold">Como usar o Montar Grade</h3>
            <ol className="space-y-3">
              {gradeSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${badgeClass}`}
                  >
                    {index + 1}
                  </span>
                  <p className={`text-sm leading-relaxed ${bodyClass}`}>
                    {step.title && <span className="font-semibold text-current">{step.title} </span>}
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className={`mb-4 rounded-xl p-5 ${cardClass}`}>
            <h3 className="mb-3 text-sm font-semibold">O que cada cor significa</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[...legendLeft, ...legendRight].map((item) => (
                <span key={item.label} className={`flex items-center gap-2 text-sm ${bodyClass}`}>
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.color}`} />
                  {item.label}
                </span>
              ))}
            </div>
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

          <p className={`mt-6 text-center text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Feito por: João Victor Borges Nascimento
          </p>
        </div>
      </div>
    </>
  );
}