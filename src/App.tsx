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
    <div className="min-h-screen flex flex-col items-center py-12 bg-slate-950 text-slate-300 selection:bg-cyan-900 selection:text-cyan-50 relative overflow-hidden font-sans">
      
      {/* Efeito de luz de fundo (Glow) para estética moderna */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl px-4 z-10 flex flex-col items-center">
        
        {/* Header Global */}
        <div className="text-center mb-12 w-full">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-sm">
            Digitando Código
          </h1>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
            Prática de Memória Muscular para Programadores
          </p>
        </div>

        {/* ROTEAMENTO DE TELA VIA ESTADO */}
        {telaAtual === 'MENU' ? (
          <MenuInicial />
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in">
            
            {/* Header da Fase */}
            <div className="w-full max-w-4xl flex justify-between items-start md:items-end mb-6 px-6 py-5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md shadow-lg">
              <div>
                <span className="text-[11px] font-mono text-cyan-500 font-bold uppercase tracking-widest mb-1 block">
                  {desafioAtual.categoria}
                </span>
                <h2 className="text-2xl font-bold text-slate-100">{desafioAtual.titulo}</h2>
                <p className="text-slate-400 mt-1 text-sm max-w-2xl leading-relaxed">{desafioAtual.instrucao}</p>
              </div>
              
              <button 
                onClick={voltarParaMenu}
                className="text-slate-500 hover:text-cyan-400 font-mono text-sm transition-colors flex items-center gap-2 group mt-4 md:mt-0"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Menu
              </button>
            </div>

            <TelaDeCodigo />
            
            {status === 'CONCLUIDO' ? <PainelMetricas /> : <TecladoVirtual />}

            {/* Botões Inferiores */}
            <div className="flex gap-4 mt-10">
              <button 
                type="button"
                onClick={handleReiniciar}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-sm rounded-lg border border-slate-700 hover:border-slate-500 transition-all shadow-sm"
              >
                ⟳ Reiniciar Script
              </button>

              {status === 'CONCLUIDO' && (
                <button 
                  type="button"
                  onClick={voltarParaMenu}
                  className="px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold font-mono text-sm rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all transform hover:scale-105"
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