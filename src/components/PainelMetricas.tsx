import { useGameStore, type FingerName } from '../store/useGameStore';

const fingerLabels: Record<FingerName, string> = {
  mindinhoE: 'Mindinho', anelarE: 'Anelar', medioE: 'Médio', indicadorE: 'Indicador',
  polegar: 'Polegar',
  indicadorD: 'Indicador', medioD: 'Médio', anelarD: 'Anelar', mindinhoD: 'Mindinho',
  nenhum: 'Outros'
};

export default function PainelMetricas() {
  const { metricasDedos, tempoAtivoTotal } = useGameStore();

  // O tempo em minutos desconsidera as pausas lógicas da lacuna!
  const minutosGlobais = Math.max(tempoAtivoTotal / 60000, 0.01);

  let totalAcertosGlobais = 0;
  let totalErrosGlobais = 0;

  Object.values(metricasDedos).forEach(stats => {
    totalAcertosGlobais += stats.acertos;
    totalErrosGlobais += stats.erros;
  });

  const wpmGlobal = Math.round((totalAcertosGlobais / 5) / minutosGlobais);
  const precisaoGlobal = totalAcertosGlobais === 0 ? 0 : Math.round((totalAcertosGlobais / (totalAcertosGlobais + totalErrosGlobais)) * 100);

  const renderFingerStat = (key: FingerName, align: 'left' | 'right') => {
    const stats = metricasDedos[key];
    const totalToques = stats.acertos + stats.erros;
    if (totalToques === 0) return null; 

    const precisao = Math.round((stats.acertos / totalToques) * 100);
    
    // MÁGICA DA DINÂMICA DE DIGITAÇÃO AQUI
    // Calcula a média de ms que esse dedo levou entre acionamentos.
    const mediaAtrasoMs = stats.acertos > 0 ? stats.atrasoAcumulado / stats.acertos : 0;
    
    // 60.000 (ms em 1 min) dividido pelo tempo que leva para escrever 1 palavra (5 * atraso).
    const wpmInstataneo = mediaAtrasoMs > 0 ? Math.round(60000 / (mediaAtrasoMs * 5)) : 0;

    return (
      <div key={key} className={`flex flex-col gap-1 w-full ${align === 'right' ? 'items-end' : 'items-start'}`}>
        <div className="flex justify-between w-full text-xs font-mono text-gray-400">
          <span>{fingerLabels[key]}</span>
          <span className={precisao < 90 ? 'text-red-400' : 'text-green-400'}>{precisao}% Acerto</span>
        </div>
        <div className="flex items-center gap-3 w-full">
          {align === 'right' && <span className="text-blue-400 font-bold text-sm">{wpmInstataneo} <span className="text-[10px]">WPM</span></span>}
          
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden flex">
            <div style={{ width: `${precisao}%` }} className={`h-full ${precisao === 100 ? 'bg-green-500' : precisao >= 90 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
          </div>
          
          {align === 'left' && <span className="text-blue-400 font-bold text-sm">{wpmInstataneo} <span className="text-[10px]">WPM</span></span>}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 w-full max-w-4xl bg-gray-900 rounded-xl border border-gray-700 shadow-2xl p-6 animate-fade-in">
      
      <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-200">Relatório de Desempenho</h3>
          <p className="text-sm text-gray-500 font-mono">{(tempoAtivoTotal / 1000).toFixed(1)}s cronometrados (Apenas Digitação)</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-gray-500 text-xs font-mono uppercase">Velocidade</p>
            <p className="text-3xl font-bold text-blue-400">{wpmGlobal} <span className="text-sm">WPM</span></p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs font-mono uppercase">Precisão</p>
            <p className="text-3xl font-bold text-green-400">{precisaoGlobal}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 transform -translate-x-1/2"></div>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-center text-sm font-bold text-gray-500 tracking-widest uppercase mb-2">Mão Esquerda</h4>
          {renderFingerStat('mindinhoE', 'left')}
          {renderFingerStat('anelarE', 'left')}
          {renderFingerStat('medioE', 'left')}
          {renderFingerStat('indicadorE', 'left')}
          {renderFingerStat('polegar', 'left')}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-center text-sm font-bold text-gray-500 tracking-widest uppercase mb-2">Mão Direita</h4>
          {renderFingerStat('indicadorD', 'right')}
          {renderFingerStat('medioD', 'right')}
          {renderFingerStat('anelarD', 'right')}
          {renderFingerStat('mindinhoD', 'right')}
        </div>
      </div>

    </div>
  );
}