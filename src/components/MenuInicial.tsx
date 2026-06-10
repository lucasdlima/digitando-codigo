import { useGameStore } from '../store/useGameStore';
import desafiosData from '../data/desafios.json';
import type { Desafio } from '../types/game';

export default function MenuInicial() {
  const { iniciarDesafio } = useGameStore();

  // Agrupa os desafios do JSON por categoria automaticamente
  const desafiosPorCategoria = (desafiosData as Desafio[]).reduce((acumulador, desafio) => {
    if (!acumulador[desafio.categoria]) {
      acumulador[desafio.categoria] = [];
    }
    acumulador[desafio.categoria].push(desafio);
    return acumulador;
  }, {} as Record<string, Desafio[]>);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-800 pb-2">
        Trilha de Conhecimento
      </h2>

      <div className="flex flex-col gap-8">
        {Object.entries(desafiosPorCategoria).map(([categoria, desafios]) => (
          <div key={categoria}>
            <h3 className="text-lg font-mono text-blue-400 mb-4 tracking-wider uppercase">
              {categoria}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {desafios.map((desafio) => (
                <button
                  key={desafio.id}
                  onClick={() => iniciarDesafio(desafio)}
                  className="flex flex-col text-left p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500 rounded-lg transition-all duration-200 group hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:-translate-y-1"
                >
                  <span className="text-gray-400 text-xs font-mono mb-1 group-hover:text-blue-300">
                    Desafio #{desafio.id}
                  </span>
                  <span className="text-gray-100 font-bold text-md mb-2">
                    {desafio.titulo}
                  </span>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {desafio.instrucao}
                  </p>
                  
                  {/* Espaço reservado para os recordes futuros */}
                  <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-500 font-mono">
                    <span>Melhor Tempo: --</span>
                    <span>WPM: --</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}