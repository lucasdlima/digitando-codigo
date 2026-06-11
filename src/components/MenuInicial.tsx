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
              
              return (
                <button
                  key={desafio.id}
                  onClick={() => iniciarDesafio(desafio)}
                  // Removido o "h-28", adicionado min-h-[120px] e h-full para ajuste inteligente
                  className="flex flex-col text-left p-5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(8,145,178,0.15)] hover:-translate-y-1 relative overflow-hidden h-full min-h-[120px]"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/80 transition-all duration-500"></div>

                  <div className="flex justify-between items-center w-full mb-2">
                    <span className="bg-slate-950 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                      Fase {desafio.id}
                    </span>
                  </div>
                  
                  {/* O texto pode crescer o quanto quiser agora */}
                  <span className="text-slate-100 font-bold text-base mb-4 group-hover:text-cyan-50 transition-colors w-full">
                    {desafio.titulo}
                  </span>
                  
                  {/* O mt-auto garante que as métricas fiquem grudadas no fundo, alinhando todos os cartões */}
                  <div className="mt-auto pt-3 border-t border-slate-800/80 flex justify-between items-end w-full text-xs font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Melhor Tempo</span>
                      <span className={recorde ? "text-slate-300" : "text-slate-600"}>
                        {recorde ? formatarTempo(recorde.tempoMs) : '--:--'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">Recorde</span>
                      <span className={recorde ? "text-cyan-400 font-bold" : "text-slate-600 font-bold"}>
                        {recorde ? `${recorde.wpm} WPM` : '-- WPM'}
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