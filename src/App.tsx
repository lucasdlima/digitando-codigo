import TelaDeCodigo from './components/TelaDeCodigo';
import TecladoVirtual from './components/TecladoVirtual';
import PainelMetricas from './components/PainelMetricas';
import MenuInicial from './components/MenuInicial'; // <-- Importa o menu
import { useGameStore } from './store/useGameStore';

function App() {
  const { telaAtual, desafioAtual, status, voltarParaMenu } = useGameStore();

  const handleReiniciar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    // Reinicia acionando a própria fase novamente
    useGameStore.getState().iniciarDesafio(desafioAtual); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-gray-950 text-gray-100">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-2 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]">
          Aprendiz de Código
        </h1>
        <p className="text-gray-400 font-mono">Prática de Memória Muscular para Programadores</p>
      </div>

      {/* ROTEAMENTO DE TELA VIA ESTADO */}
      {telaAtual === 'MENU' ? (
        <MenuInicial />
      ) : (
        <>
          <div className="w-full max-w-4xl flex justify-between items-end mb-4 px-2">
            <div>
              <h2 className="text-xl font-bold text-blue-300">{desafioAtual.titulo}</h2>
              <p className="text-gray-400 mt-1 max-w-2xl">{desafioAtual.instrucao}</p>
            </div>
            
            <button 
              onClick={voltarParaMenu}
              className="text-gray-500 hover:text-gray-300 font-mono text-sm underline transition-colors"
            >
              ← Voltar ao Menu
            </button>
          </div>

          <TelaDeCodigo />
          
          {status === 'CONCLUIDO' ? <PainelMetricas /> : <TecladoVirtual />}

          {/* Botões Inferiores */}
          <div className="flex gap-4 mt-8">
            <button 
              type="button"
              onClick={handleReiniciar}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono rounded-md border border-gray-600 transition-colors"
            >
              Reiniciar Script
            </button>

            {status === 'CONCLUIDO' && (
              <button 
                type="button"
                onClick={voltarParaMenu}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono rounded-md shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all transform hover:scale-105"
              >
                Concluir e Voltar ➔
              </button>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default App;