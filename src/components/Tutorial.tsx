import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function Tutorial() {
  const { voltarParaMenu } = useGameStore();
  const [paginaAtual, setPaginaAtual] = useState(0);

  const paginas = [
    {
      titulo: "O Ciclo em Duas Etapas",
      icone: "🔄",
      conteudo: (
        <div className="flex flex-col gap-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            O <strong>Digitando Código</strong> não é um teste de digitação comum. Cada fase é dividida em dois momentos cruciais: o reflexo muscular e o raciocínio lógico.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Etapa 1 */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2 block">Etapa 1: Digitação</span>
              <h4 className="text-slate-200 font-bold mb-2">Reflexo e Velocidade</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Copie o código inicial que aparece na tela o mais rápido que puder. <strong className="text-slate-300">O cronômetro está rodando</strong> e é aqui que o seu WPM (Palavras por Minuto) é calculado.
              </p>
              {/* Mockup */}
              <div className="font-mono text-xs bg-slate-900 p-3 rounded border border-slate-700">
                <span className="text-pink-400">for</span> <span className="text-slate-300">numero</span> <span className="text-pink-400">in</span>
                <span className="ml-1 bg-cyan-500/30 border-b-2 border-cyan-400 animate-pulse text-cyan-100"> </span>
                <span className="text-slate-600">range(</span>
              </div>
            </div>

            {/* Etapa 2 */}
            <div className="bg-slate-950 p-5 rounded-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-2 block">Etapa 2: A Lacuna</span>
              <h4 className="text-slate-200 font-bold mb-2">Pausa para a Lógica</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Ao chegar na lacuna, <strong className="text-slate-300">o relógio congela</strong>. O WPM para de contar. Respire, leia o desafio e construa a lógica necessária para prosseguir.
              </p>
              {/* Mockup */}
              <div className="font-mono text-xs bg-slate-900 p-3 rounded border border-slate-700 border-l-2 border-l-yellow-500">
                <span className="text-yellow-300">range(1, 101):</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      titulo: "O Interpretador e as Dicas",
      icone: "🧠",
      conteudo: (
        <div className="flex flex-col gap-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Seu código não é apenas texto. Quando você preenche a lacuna e clica em Executar, rodamos um interpretador real de Python direto no seu navegador.
          </p>

          <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex flex-col gap-4">
            
            <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-500 text-xs font-mono ml-2">Console Output:</span>
              <span className="text-green-400 text-xs font-mono font-bold mr-2">5050</span>
            </div>

            <p className="text-slate-500 text-xs text-center">
              Seu objetivo na lacuna é escrever a lógica que faça o console cuspir exatamente o resultado esperado pelo desafio.
            </p>

            <div className="mt-2 p-4 bg-slate-900/50 border border-slate-800 rounded-md flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h4 className="text-slate-300 text-sm font-bold mb-1">Travou na lógica?</h4>
                <p className="text-slate-500 text-xs">
                  Não perca tempo preso. Durante a lacuna, um botão de dica estará disponível para te dar o caminho das pedras sem entregar a resposta completa.
                </p>
              </div>
              <button className="shrink-0 px-4 py-2 bg-cyan-950/50 border border-cyan-900 text-cyan-400 text-xs rounded-full font-sans cursor-default">
                💡 Pedir uma dica
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      titulo: "O Teclado e Seus Dedos",
      icone: "⌨️",
      conteudo: (
        <div className="flex flex-col gap-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Nós usamos <strong>Keystroke Dynamics</strong>. O sistema mede os milissegundos de atraso entre uma tecla e outra, gerando uma velocidade instantânea para cada dedo seu.
          </p>
          
          <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 flex flex-col items-center gap-6">
            <p className="text-slate-300 text-sm font-bold text-center">
              A regra de ouro: <span className="text-cyan-400">Não olhe para suas mãos!</span>
            </p>

            {/* Diagrama Visual das Mãos */}
            <div className="w-full max-w-lg bg-slate-900 p-5 rounded-lg border border-slate-700 flex justify-between gap-4 text-center text-xs font-mono">
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2">Mão Esquerda</span>
                <span className="text-pink-400">Mindinho: Shift, A, Q, 1</span>
                <span className="text-orange-400">Anelar: S, W, 2</span>
                <span className="text-yellow-400">Médio: D, E, 3</span>
                <span className="text-green-400">Indicador: F, R, G, T</span>
                <span className="text-cyan-400">Polegar: Espaço</span>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2">Mão Direita</span>
                <span className="text-cyan-400">Polegar: Espaço</span>
                <span className="text-green-400">Indicador: J, U, H, Y</span>
                <span className="text-yellow-400">Médio: K, I, 8</span>
                <span className="text-orange-400">Anelar: L, O, 9</span>
                <span className="text-pink-400">Mindinho: Ç, P, Enter, Back</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      titulo: "Estrelas e Progressão",
      icone: "⭐",
      conteudo: (
        <div className="flex flex-col gap-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Para avançar na trilha de módulos, apenas terminar a fase não é o suficiente. Você precisa atingir o WPM mínimo exigido pela fase.
          </p>

          <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="flex flex-col items-center text-center p-4 bg-slate-900 rounded border border-slate-800">
              <span className="text-yellow-400 text-xl mb-2">★</span>
              <h4 className="text-slate-200 text-sm font-bold mb-1">Passe de Fase</h4>
              <p className="text-slate-500 text-xs">Atingir 1 estrela desbloqueia o próximo desafio da trilha.</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-slate-900 rounded border border-slate-800">
              <span className="text-yellow-400 text-xl mb-2">★★</span>
              <h4 className="text-slate-200 text-sm font-bold mb-1">Nível Profissional</h4>
              <p className="text-slate-500 text-xs">Indica que sua memória muscular para aquela sintaxe está fluida.</p>
            </div>

            <div className="flex flex-col items-center text-center p-4 bg-slate-900 rounded border border-cyan-900/50 relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-cyan-500"></div>
              <span className="text-yellow-400 text-xl mb-2">★★★</span>
              <h4 className="text-slate-200 text-sm font-bold mb-1">Mestre</h4>
              <p className="text-slate-500 text-xs">Digitação automática. Seus dedos programam antes de você pensar.</p>
            </div>

          </div>

          <div className="flex justify-center mt-2">
            <span className="px-4 py-2 bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-mono rounded">
              ⚠ Erros de digitação diminuem o WPM e a Precisão final.
            </span>
          </div>
        </div>
      )
    }
  ];

  const irParaProxima = () => {
    if (paginaAtual < paginas.length - 1) setPaginaAtual(prev => prev + 1);
    else voltarParaMenu(); // Se for a última página, vai pro jogo
  };

  const irParaAnterior = () => {
    if (paginaAtual > 0) setPaginaAtual(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-6 animate-fade-in pb-10">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <span className="text-3xl">{paginas[paginaAtual].icone}</span>
            {paginas[paginaAtual].titulo}
          </h2>
        </div>
        <button 
          onClick={voltarParaMenu}
          className="text-slate-500 hover:text-cyan-400 font-mono text-sm transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Sair
        </button>
      </div>

      {/* Conteúdo da Página */}
      <div className="min-h-[350px] flex flex-col justify-center">
        {paginas[paginaAtual].conteudo}
      </div>

      {/* Navegação Inferior */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
        
        <button 
          onClick={irParaAnterior}
          className={`px-5 py-2 font-mono text-sm rounded-lg transition-all ${paginaAtual === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:bg-slate-900 border border-slate-700'}`}
        >
          ← Anterior
        </button>

        {/* Indicadores de Progresso (Bolinhas) */}
        <div className="flex gap-2">
          {paginas.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${paginaAtual === idx ? 'bg-cyan-400 scale-125' : 'bg-slate-800'}`}
            ></div>
          ))}
        </div>

        <button 
          onClick={irParaProxima}
          className={`px-6 py-2 font-bold font-mono text-sm rounded-lg shadow-lg transition-all transform hover:scale-105 ${
            paginaAtual === paginas.length - 1 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
          }`}
        >
          {paginaAtual === paginas.length - 1 ? 'Começar! ✓' : 'Próximo ➔'}
        </button>

      </div>
    </div>
  );
}