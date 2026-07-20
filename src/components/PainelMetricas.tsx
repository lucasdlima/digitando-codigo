import { useGameStore, type FingerName } from '../store/useGameStore';

const fingerLabels: Record<FingerName, string> = {
  mindinhoE: 'Mindinho', anelarE: 'Anelar', medioE: 'Médio', indicadorE: 'Indicador',
  polegar: 'Polegar',
  indicadorD: 'Indicador', medioD: 'Médio', anelarD: 'Anelar', mindinhoD: 'Mindinho',
  nenhum: 'Outros'
};

// Micro-componente de Tooltip
const InfoTooltip = ({ texto, children }: { texto: string, children: React.ReactNode }) => (
  <div className="group relative inline-flex items-center gap-1 cursor-help">
    {children}
    <span className="text-slate-500 text-[10px] bg-slate-800 rounded-full w-3.5 h-3.5 flex items-center justify-center border border-slate-700 font-serif italic">i</span>
    
    {/* Caixa do Tooltip */}
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-50 bg-slate-800 text-slate-300 text-[10px] font-sans font-normal p-2.5 rounded-lg shadow-xl border border-slate-700 text-center leading-relaxed normal-case tracking-normal">
      {texto}
      {/* Setinha para baixo */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
    </div>
  </div>
);

export default function PainelMetricas() {
  const { metricasDedos, tempoAtivoTotal } = useGameStore();

  const minutosGlobais = Math.max(tempoAtivoTotal / 60000, 0.01);

  let totalAcertosGlobais = 0;
  let totalErrosGlobais = 0;

  Object.values(metricasDedos).forEach(stats => {
    totalAcertosGlobais += stats.acertos;
    totalErrosGlobais += stats.erros;
  });

  const wpmGlobal = Math.round((totalAcertosGlobais / 5) / minutosGlobais);
  const precisaoGlobal = totalAcertosGlobais === 0 ? 0 : Math.round((totalAcertosGlobais / (totalAcertosGlobais + totalErrosGlobais)) * 100);

  // --- Cálculo das Estrelas para Exibição ---
  const { metasWpm } = useGameStore(state => state.desafioAtual);
  let estrelasAtuais = 0;
  if (wpmGlobal >= metasWpm[2]) estrelasAtuais = 3;
  else if (wpmGlobal >= metasWpm[1]) estrelasAtuais = 2;
  else if (wpmGlobal >= metasWpm[0]) estrelasAtuais = 1;

  // Função para desenhar as estrelas
  const renderizarEstrelas = () => {
    return (
      <div className="flex gap-2 text-2xl drop-shadow-md">
        {[1, 2, 3].map((num) => (
          <span 
            key={num} 
            className={`transition-all duration-500 transform ${
              num <= estrelasAtuais 
                ? 'text-yellow-400 scale-110' 
                : 'text-slate-700 scale-90'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderFingerStat = (key: FingerName, align: 'left' | 'right') => {
    const stats = metricasDedos[key];
    const totalToques = stats.acertos + stats.erros;
    if (totalToques === 0) return null; 

    const precisao = Math.round((stats.acertos / totalToques) * 100);
    const mediaAtrasoMs = stats.acertos > 0 ? stats.atrasoAcumulado / stats.acertos : 0;
    const wpmInstantaneo = mediaAtrasoMs > 0 ? Math.round(60000 / (mediaAtrasoMs * 5)) : 0;

    return (
      <div key={key} className={`flex flex-col gap-1 w-full ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <div className="flex justify-between w-full text-xs font-mono text-slate-400">
          <span>{fingerLabels[key]}</span>
          <span className={precisao < 90 ? 'text-red-400' : 'text-green-400'}>{precisao}% Acerto</span>
        </div>
        <div className="flex items-center gap-3 w-full">
          {align === 'right' && (
            <span className="text-blue-400 font-bold text-sm" title={`Média de atraso: ${Math.round(mediaAtrasoMs)}ms`}>
              {wpmInstantaneo} <span className="text-[10px]">WPM</span>
            </span>
          )}
          
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: `${precisao}%` }} className={`h-full ${precisao === 100 ? 'bg-green-500' : precisao >= 90 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          </div>
          
          {align === 'left' && (
            <span className="text-blue-400 font-bold text-sm" title={`Média de atraso: ${Math.round(mediaAtrasoMs)}ms`}>
              {wpmInstantaneo} <span className="text-[10px]">WPM</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 w-full max-w-4xl bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl p-6 animate-fade-in">
      
      {/* Cabeçalho do Relatório */}
      <div className="flex justify-between items-start border-b border-slate-800 pb-5 mb-6">
        
        {/* Lado Esquerdo: Título, Estrelas e Tempo */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-slate-200">Relatório de Desempenho</h3>
          
          <div className="flex items-center gap-4">
            {renderizarEstrelas()}
            <InfoTooltip texto={`Metas de WPM desta fase:\n⭐ ${metasWpm[0]}\n⭐⭐ ${metasWpm[1]}\n⭐⭐⭐ ${metasWpm[2]}`}>
              <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-700 hover:bg-slate-800 transition-colors">Ver Metas</span>
            </InfoTooltip>
          </div>

          <div className="mt-1">
            <InfoTooltip texto="Pausas para raciocínio e execução do código foram subtraídas. Reflete apenas o tempo em que você esteve digitando ativamente.">
              <p className="text-sm text-slate-500 font-mono">{(tempoAtivoTotal / 1000).toFixed(1)}s de tempo líquido</p>
            </InfoTooltip>
          </div>
        </div>
        
        {/* Lado Direito: WPM e Precisão */}
        <div className="flex gap-8">
          <div className="text-right flex flex-col items-end">
            <InfoTooltip texto="Palavras por Minuto (Words Per Minute). O padrão de cálculo internacional considera que 1 palavra = 5 caracteres digitados.">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Velocidade</p>
            </InfoTooltip>
            <p className="text-3xl font-bold text-cyan-400 mt-1">{wpmGlobal} <span className="text-sm">WPM</span></p>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <InfoTooltip texto="Porcentagem de teclas corretas em relação ao total de teclas pressionadas nesta fase.">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Precisão</p>
            </InfoTooltip>
            <p className="text-3xl font-bold text-green-400 mt-1">{precisaoGlobal}%</p>
          </div>
        </div>

      </div>
      
      {/* Título da Seção de Dedos com Explicação */}
      <div className="w-full flex justify-center mb-6">
        <InfoTooltip texto="Calculado usando Dinâmica de Digitação (Keystroke Dynamics). Exibe a velocidade instantânea de cada dedo com base no atraso em milissegundos entre toques, não dependendo da duração total do desafio.">
          <span className="text-xs text-slate-500 font-mono border border-slate-800 bg-slate-900/50 px-4 py-1.5 rounded-full cursor-help">
            Métricas por Dedo (Velocidade Instantânea)
          </span>
        </InfoTooltip>
      </div>

      {/* Grid de Mãos */}
      <div className="grid grid-cols-2 gap-12 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 transform -translate-x-1/2"></div>
        <div className="flex flex-col gap-4">
          <h4 className="text-center text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">Mão Esquerda</h4>
          {renderFingerStat('mindinhoE', 'left')}
          {renderFingerStat('anelarE', 'left')}
          {renderFingerStat('medioE', 'left')}
          {renderFingerStat('indicadorE', 'left')}
          {renderFingerStat('polegar', 'left')}
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-center text-sm font-bold text-slate-500 tracking-widest uppercase mb-2">Mão Direita</h4>
          {renderFingerStat('indicadorD', 'right')}
          {renderFingerStat('medioD', 'right')}
          {renderFingerStat('anelarD', 'right')}
          {renderFingerStat('mindinhoD', 'right')}
        </div>
      </div>
    </div>
  );
}