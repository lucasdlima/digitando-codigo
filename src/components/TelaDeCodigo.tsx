import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const realcarSintaxe = (texto: string) => {
  const partes = texto.split(/(\bdef\b|\bfor\b|\bin\b|\bwhile\b|\bif\b|\belse\b|\belif\b|\breturn\b|\bprint\b|\bTrue\b|\bFalse\b|\b\d+\b|"[^"]*"|'[^']*')/g);
  return partes.map((parte, index) => {
    if (/^(def|for|in|while|if|else|elif|return|print|True|False)$/.test(parte)) {
      return <span key={index} className="text-pink-400 font-bold">{parte}</span>;
    }
    if (/^\d+$/.test(parte)) {
      return <span key={index} className="text-purple-300">{parte}</span>;
    }
    if (/^".*"$|^'.*'$/.test(parte)) {
      return <span key={index} className="text-orange-300">{parte}</span>;
    }
    return <span key={index}>{parte}</span>;
  });
};

export default function TelaDeCodigo() {
  const { 
    desafioAtual, 
    textoDigitado, 
    lacunaPreenchida,
    status, 
    erros, 
    validarLacuna 
  } = useGameStore();

  const [inputLacuna, setInputLacuna] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (status === 'NA_LACUNA' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (erros > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 300);
      return () => clearTimeout(timer);
    }
  }, [erros]);

  useEffect(() => {
    if (status === 'DIGITANDO_ANTES') {
      setInputLacuna('');
    }
  }, [status]);

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (status === 'VALIDANDO') return;
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const novoTexto = inputLacuna.substring(0, start) + "    " + inputLacuna.substring(end);
      setInputLacuna(novoTexto);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const renderizarTrechoGuiado = (textoAlvo: string, isAtivo: boolean) => {
    if (!isAtivo) return <span className="text-slate-600">{textoAlvo}</span>;
    const digitado = textoAlvo.slice(0, textoDigitado.length);
    const textoFaltante = textoAlvo.slice(textoDigitado.length);
    const caractereAtual = textoFaltante.charAt(0);
    const restoDoTexto = textoFaltante.slice(1);

    return (
      <>
        <span>{realcarSintaxe(digitado)}</span>
        {caractereAtual && (
          <span className="bg-cyan-600/40 text-cyan-100 border-b-[3px] border-cyan-400 animate-pulse relative">
            {caractereAtual === ' ' ? '\u00A0' : caractereAtual === '\n' ? '↵\n' : caractereAtual}
          </span>
        )}
        <span className="text-slate-600">{restoDoTexto}</span>
      </>
    );
  };

  const respostaExibida = status === 'DIGITANDO_DEPOIS' || status === 'CONCLUIDO'
    ? lacunaPreenchida
    : desafioAtual.partes.lacuna;

  const linhasTextarea = Math.max(2, inputLacuna.split('\n').length);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      
      {/* Console Output (Margens menores p-3) */}
      <div className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-slate-300 shadow-inner">
        <div className="text-slate-500 mb-1">// Console Output Esperado:</div>
        <div className="text-green-400 font-bold whitespace-pre-wrap">{desafioAtual.outputEsperado}</div>
      </div>

      <div className="flex justify-between w-full text-slate-400 text-xs font-mono px-1 mt-1">
        <span>Erros de Sintaxe/Lógica: <span className="text-red-400 font-bold">{erros}</span></span>
        {status === 'CONCLUIDO' && <span className="text-green-400 font-bold">COMPILADO COM SUCESSO</span>}
        {status === 'VALIDANDO' && <span className="text-yellow-400 font-bold animate-pulse">COMPILANDO...</span>}
      </div>

      {/* Editor de Código (Diminuição da fonte para text-lg/xl e padding p-5) */}
      <div className={`
        p-5 md:p-6 rounded-xl shadow-2xl font-mono text-lg md:text-xl text-left w-full tracking-wide leading-relaxed whitespace-pre-wrap transition-colors duration-200
        ${isShaking ? 'bg-red-950/20 border border-red-500/50 animate-shake' : 'bg-slate-900 border border-slate-800'}
      `}>
        
        {status === 'DIGITANDO_ANTES' 
          ? renderizarTrechoGuiado(desafioAtual.partes.antes, true)
          : <span>{realcarSintaxe(desafioAtual.partes.antes)}</span>
        }

        {status === 'DIGITANDO_ANTES' && (
          <span className="mx-2 text-slate-700 bg-slate-950 px-2 rounded">???</span>
        )}
        
        {(status === 'NA_LACUNA' || status === 'VALIDANDO') && (
          <div className="inline-flex flex-col relative w-full mt-2 mb-2 pl-3 border-l-2 border-cyan-500/50">
            <textarea
              ref={textareaRef}
              value={inputLacuna}
              onChange={(e) => setInputLacuna(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              disabled={status === 'VALIDANDO'}
              rows={linhasTextarea}
              className={`
                outline-none bg-slate-950/80 text-yellow-300 p-2 rounded resize-none w-full transition-colors leading-relaxed text-base md:text-lg
                ${status === 'VALIDANDO' ? 'opacity-50 cursor-not-allowed' : 'focus:ring-1 focus:ring-cyan-500/50'}
              `}
              placeholder="Digite a lógica aqui... (Enter pula linha)"
              spellCheck="false"
            />
            <button
              onClick={() => validarLacuna(inputLacuna)}
              disabled={status === 'VALIDANDO'}
              className="mt-2 self-end px-5 py-1.5 bg-green-600/90 hover:bg-green-500 text-white text-xs uppercase tracking-wider rounded font-bold shadow-md transition-all active:scale-95"
            >
              ▶ Executar
            </button>
          </div>
        )}

        {(status === 'DIGITANDO_DEPOIS' || status === 'CONCLUIDO') && (
          <span className="text-yellow-400 font-bold">{realcarSintaxe(respostaExibida)}</span>
        )}

        {status === 'DIGITANDO_DEPOIS' 
          ? renderizarTrechoGuiado(desafioAtual.partes.depois, true)
          : status === 'CONCLUIDO' 
            ? <span>{realcarSintaxe(desafioAtual.partes.depois)}</span>
            : <span className="text-slate-600">{desafioAtual.partes.depois}</span>
        }

      </div>
    </div>
  );
}