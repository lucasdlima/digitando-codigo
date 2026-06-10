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
    <div className="w-full flex flex-col gap-12 animate-fade-in pb-10">
      {Object.entries(desafiosPorCategoria).map(([categoria, desafios]) => (
        <section key={categoria} className="w-full relative">
          
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-200 tracking-wide">
              {categoria}
            </h3>
            <div className="h-px bg-slate-800 flex-1 mt-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {desafios.map((desafio) => (
              <button
                key={desafio.id}
                onClick={() => iniciarDesafio(desafio)}
                className="flex flex-col text-left p-6 bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all duration-300 group hover:shadow-[0_8px_30px_rgba(8,145,178,0.15)] hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Borda superior interativa */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/80 transition-all duration-500"></div>

                <div className="flex justify-between items-start w-full mb-3">
                  <span className="bg-slate-950 text-cyan-400 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                    Fase {desafio.id}
                  </span>
                </div>
                
                <span className="text-slate-100 font-bold text-lg mb-2 group-hover:text-cyan-50 transition-colors">
                  {desafio.titulo}
                </span>
                
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1">
                  {desafio.instrucao}
                </p>
                
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center w-full">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Status</span>
                    <span className="text-xs text-slate-400 font-mono">Pronto para iniciar</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:bg-cyan-900/30 group-hover:border-cyan-500/40 transition-colors">
                    <span className="text-cyan-500 text-sm leading-none transform group-hover:translate-x-0.5 transition-transform">➔</span>
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