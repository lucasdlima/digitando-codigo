import { useGameStore } from '../store/useGameStore';
import desafiosData from '../data/desafios.json';
import type { Desafio } from '../types/game';

export default function MenuInicial() {
  const { iniciarDesafio } = useGameStore();

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {desafios.map((desafio) => (
              <button
                key={desafio.id}
                onClick={() => iniciarDesafio(desafio)}
                className="flex flex-col text-left p-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(8,145,178,0.15)] hover:-translate-y-1 relative overflow-hidden h-28"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/80 transition-all duration-500"></div>

                <div className="flex justify-between items-center w-full mb-1">
                  <span className="bg-slate-950 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    Fase {desafio.id}
                  </span>
                </div>
                
                <span className="text-slate-100 font-bold text-base mb-2 group-hover:text-cyan-50 transition-colors truncate w-full">
                  {desafio.titulo}
                </span>
                
                <div className="mt-auto pt-2 border-t border-slate-800 flex justify-between items-end w-full text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Melhor Tempo</span>
                    <span className="text-slate-400">--:--</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-slate-600 uppercase tracking-wider mb-0.5">Recorde</span>
                    <span className="text-cyan-500 font-bold">-- WPM</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}