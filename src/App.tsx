import TelaDeCodigo from './components/TelaDeCodigo';
import TecladoVirtual from './components/TecladoVirtual';
import PainelMetricas from './components/PainelMetricas';
import MenuInicial from './components/MenuInicial';
import Tutorial from './components/Tutorial';
import { useGameStore } from './store/useGameStore';
import desafiosData from './data/desafios.json';
import type { Desafio } from './types/game';

function App() {
  const { telaAtual, desafioAtual, status, voltarParaMenu, abrirTutorial, resultadoAtual } = useGameStore();

  const handleReiniciar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    useGameStore.getState().iniciarDesafio(desafioAtual); 
  };

  const currentIndex = (desafiosData as Desafio[]).findIndex(d => d.id === desafioAtual.id);
  const hasNext = currentIndex >= 0 && currentIndex < desafiosData.length - 1;

  const handleProximaFase = () => {
    if (hasNext) {
      useGameStore.getState().iniciarDesafio(desafiosData[currentIndex + 1] as Desafio);
    } else {
      voltarParaMenu();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center ${telaAtual === 'MENU' || telaAtual === 'TUTORIAL' ? 'py-12' : 'py-4 md:py-6'} bg-slate-950 text-slate-300 selection:bg-cyan-900 selection:text-cyan-50 relative overflow-hidden font-sans transition-all`}>
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl px-4 z-10 flex flex-col items-center h-full">
        
        {/* Cabeçalho Global (Aparece no Menu e no Tutorial) */}
        {(telaAtual === 'MENU' || telaAtual === 'TUTORIAL') && (
          <div className="text-center mb-10 w-full animate-fade-in flex flex-col items-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-1 pb-2 leading-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-sm">
              Digitando Código
            </h1>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mb-6">
              Prática de digitação e Programação
            </p>
            
            {/* Botão para abrir o Tutorial no Menu */}
            {telaAtual === 'MENU' && (
              <button 
                onClick={abrirTutorial}
                className="px-5 py-2 bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 font-mono text-xs rounded-full shadow-lg transition-all flex items-center gap-2 group"
              >
                <span className="text-lg leading-none">📖</span>
                <span>Como Funciona?</span>
              </button>
            )}
          </div>
        )}

        {/* --- ROTEAMENTO --- */}
        {telaAtual === 'MENU' ? (
          <MenuInicial />
        ) : telaAtual === 'TUTORIAL' ? (
          <Tutorial />
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in max-w-4xl">
            
            <div className="w-full flex gap-3 mb-4">
              <button 
                onClick={voltarParaMenu}
                title="Voltar ao Menu"
                className="shrink-0 flex flex-col items-center justify-center w-16 md:w-20 bg-slate-900/80 border border-slate-800 rounded-xl shadow-lg hover:border-cyan-500/50 text-slate-500 hover:text-cyan-400 transition-all group"
              >
                <span className="group-hover:-translate-x-1 transition-transform text-xl mb-1">←</span>
                <span className="text-[9px] font-mono uppercase tracking-widest">Menu</span>
              </button>

              <div className="flex-1 px-5 py-3 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
                <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest mb-0.5 block">
                  {desafioAtual.categoria}
                </span>
                <h2 className="text-xl font-bold text-slate-100 leading-tight">{desafioAtual.titulo}</h2>
                <p className="text-slate-400 mt-0.5 text-xs max-w-2xl leading-relaxed">{desafioAtual.instrucao}</p>
              </div>
            </div>

            <TelaDeCodigo />
            
            {status === 'CONCLUIDO' ? <PainelMetricas /> : <TecladoVirtual />}

            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={handleReiniciar}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 hover:border-slate-500 transition-all shadow-sm"
              >
                ⟳ Reiniciar Script
              </button>

              {status === 'CONCLUIDO' && (
                resultadoAtual && resultadoAtual.estrelas >= 1 ? (
                  <button 
                    type="button"
                    onClick={handleProximaFase}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all transform hover:scale-105"
                  >
                    {hasNext ? 'Próxima Fase ➔' : 'Concluir Trilha ➔'}
                  </button>
                ) : (
                  <span className="px-5 py-2 flex items-center bg-red-950/30 text-red-400 font-mono text-xs rounded-lg border border-red-900/50 cursor-not-allowed">
                    ⚠ Alcance no mínimo 1 estrela para avançar
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;