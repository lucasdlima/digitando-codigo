import TelaDeCodigo from './components/TelaDeCodigo';
import TecladoVirtual from './components/TecladoVirtual';
import { useGameStore } from './store/useGameStore';
import type { Desafio } from './types/game';
import desafiosData from './data/desafios.json'; // <-- Importando o JSON

// Convertendo o JSON para o tipo correto do TypeScript
const listaDesafios = desafiosData as Desafio[];

function App() {
  const { desafioAtual, proximoDesafio, status } = useGameStore();

  const handleReiniciar = () => {
    proximoDesafio(desafioAtual);
  };

  const handleProximaFase = () => {
    const indexAtual = listaDesafios.findIndex(d => d.id === desafioAtual.id);
    const proximoIndex = indexAtual + 1;
    
    if (proximoIndex < listaDesafios.length) {
      proximoDesafio(listaDesafios[proximoIndex]);
    } else {
      proximoDesafio(listaDesafios[0]); // Volta ao início quando zera
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gray-950 text-gray-100">
      
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">
          Digitando Código
        </h1>
        <p className="text-gray-400 font-mono">Prática de Digitação e Lógica de Programação</p>
      </div>

      <div className="w-full max-w-4xl bg-gray-800/50 border border-gray-700 p-5 rounded-md mb-6 shadow-md text-left">
        <h2 className="text-xl font-bold text-blue-300">{desafioAtual.titulo}</h2>
        <p className="text-gray-300 mt-1">{desafioAtual.instrucao}</p>
      </div>

      <TelaDeCodigo />
      <TecladoVirtual />

      <div className="flex gap-4 mt-8">
        <button 
          onClick={handleReiniciar}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono rounded-md border border-gray-600 transition-colors"
        >
          Reiniciar Script
        </button>

        {status === 'CONCLUIDO' && (
          <button 
            onClick={handleProximaFase}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono rounded-md shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105"
          >
            Próxima Fase ➔
          </button>
        )}
      </div>

    </div>
  );
}

export default App;