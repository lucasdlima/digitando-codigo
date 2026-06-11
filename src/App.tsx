import TelaDeCodigo from './components/TelaDeCodigo';
import TecladoVirtual from './components/TecladoVirtual';
import PainelMetricas from './components/PainelMetricas';
import MenuInicial from './components/MenuInicial';
import { useGameStore } from './store/useGameStore';

function App() {
  const { telaAtual, desafioAtual, status, voltarParaMenu } = useGameStore();

  const handleReiniciar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    useGameStore.getState().iniciarDesafio(desafioAtual); 
  };

  return (
    // Reduzimos o padding vertical drásticamente na tela de Jogo (py-4) vs Menu (py-12)
    <div className={`min-h-screen flex flex-col items-center ${telaAtual === 'MENU' ? 'py-12' : 'py-4 md:py-6'} bg-slate-950 text-slate-300 selection:bg-cyan-900 selection:text-cyan-50 relative overflow-hidden font-sans transition-all`}>
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl px-4 z-10 flex flex-col items-center h-full">
        
        {/* Mostra o Título Principal APENAS no Menu para economizar muito espaço vertical na Fase */}
        {telaAtual === 'MENU' && (
          <div className="text-center mb-12 w-full animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-1 pb-2 leading-normal tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-sm">
              Digitando Código
            </h1>
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
              Prática de digitação e Programação Python
            </p>
          </div>
        )}

        {telaAtual === 'MENU' ? (
          <MenuInicial />
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in max-w-4xl">
            
            {/* Header da Fase mais compacto (py-3 px-5 mb-4) */}
            <div className="w-full flex justify-between items-start md:items-end mb-4 px-5 py-3 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
              <div>
                <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest mb-0.5 block">
                  {desafioAtual.categoria}
                </span>
                <h2 className="text-xl font-bold text-slate-100 leading-tight">{desafioAtual.titulo}</h2>
                <p className="text-slate-400 mt-0.5 text-xs max-w-2xl leading-relaxed">{desafioAtual.instrucao}</p>
              </div>
              
              <button 
                onClick={voltarParaMenu}
                className="text-slate-500 hover:text-cyan-400 font-mono text-xs transition-colors flex items-center gap-1.5 group mt-3 md:mt-0 whitespace-nowrap"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Menu
              </button>
            </div>

            <TelaDeCodigo />
            
            {status === 'CONCLUIDO' ? <PainelMetricas /> : <TecladoVirtual />}

            {/* Botões Inferiores com margens menores (mt-6 ao invés de mt-10) */}
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={handleReiniciar}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs rounded-lg border border-slate-700 hover:border-slate-500 transition-all shadow-sm"
              >
                ⟳ Reiniciar Script
              </button>

              {status === 'CONCLUIDO' && (
                <button 
                  type="button"
                  onClick={voltarParaMenu}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-xs rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all transform hover:scale-105"
                >
                  Concluir e Voltar ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;