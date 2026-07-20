import { useGameStore } from '../store/useGameStore';
import desafiosData from '../data/desafios.json';
import type { Desafio } from '../types/game';

const formatarTempo = (ms: number) => {
  const segundosTotais = Math.floor(ms / 1000);
  const minutos = Math.floor(segundosTotais / 60);
  const segundos = segundosTotais % 60;
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
};

export default function MenuInicial() {
  const { iniciarDesafio, recordes } = useGameStore();

  const desafiosPorCategoria = (desafiosData as Desafio[]).reduce((acumulador, desafio) => {
    if (!acumulador[desafio.categoria]) acumulador[desafio.categoria] = [];
    acumulador[desafio.categoria].push(desafio);
    return acumulador;
  }, {} as Record<string, Desafio[]>);

  return (
    <div className="w-full flex flex-col gap-10 animate-fade-in pb-10">
      {Object.entries(desafiosPorCategoria).map(([categoria, desafios]) => (
        <section key={categoria} className="w-full relative">
          
          <div className="flex items-center gap-4 mb-5">
            <h3 className="text-lg font-bold text-slate-200 tracking-wide">
              {categoria}
            </h3>
            <div className="h-px bg-slate-800 flex-1 mt-1"></div>
          </div>
          
          {/* Grid com os cartões flexíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {desafios.map((desafio) => {
              const recorde = recordes[desafio.id];
              
              // Verifica se a fase anterior foi vencida para desbloquear esta
              const indexAtual = (desafiosData as Desafio[]).findIndex(d => d.id === desafio.id);
              const desafioAnterior = indexAtual > 0 ? desafiosData[indexAtual - 1] as Desafio : null;
              const bloqueado = desafioAnterior ? !(recordes[desafioAnterior.id]?.estrelas >= 1) : false;
              
              return (
                <button
                  key={desafio.id}
                  onClick={() => !bloqueado && iniciarDesafio(desafio)}
                  className={`flex flex-col text-left p-5 rounded-xl transition-all duration-300 relative overflow-hidden h-full min-h-[120px] ${
                    bloqueado 
                      ? 'bg-slate-900/30 border border-slate-800/30 cursor-not-allowed opacity-50 grayscale' 
                      : 'bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 group hover:shadow-[0_8px_30px_rgba(8,145,178,0.15)] hover:-translate-y-1'
                  }`}
                >
                  {/* Borda superior interativa (apenas se não estiver bloqueado) */}
                  {!bloqueado && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/80 transition-all duration-500"></div>
                  )}

                  <div className="flex justify-between items-center w-full mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm ${bloqueado ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-slate-950 text-cyan-400 border border-slate-800'}`}>
                      Fase {desafio.id}
                    </span>
                    
                    {/* Exibição das estrelas ou cadeado */}
                    {bloqueado ? (
                      <span className="text-slate-600 text-xs">🔒 Bloqueado</span>
                    ) : (
                      <div className="flex gap-0.5 text-sm drop-shadow-sm">
                        {[1, 2, 3].map((starIdx) => (
                          <span 
                            key={starIdx} 
                            className={recorde && recorde.estrelas >= starIdx ? "text-yellow-400" : "text-slate-700"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <span className={`font-bold text-base mb-4 w-full ${bloqueado ? 'text-slate-500' : 'text-slate-100 group-hover:text-cyan-50 transition-colors'}`}>
                    {desafio.titulo}
                  </span>
                  
                  <div className="mt-auto pt-3 border-t border-slate-800/80 flex justify-between items-end w-full text-xs font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Melhor Tempo</span>
                      <span className={recorde && !bloqueado ? "text-slate-300" : "text-slate-600"}>
                        {recorde && !bloqueado ? formatarTempo(recorde.tempoMs) : '--:--'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Recorde</span>
                      <span className={recorde && !bloqueado ? "text-cyan-400 font-bold" : "text-slate-600 font-bold"}>
                        {recorde && !bloqueado ? `${recorde.wpm} WPM` : '-- WPM'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}