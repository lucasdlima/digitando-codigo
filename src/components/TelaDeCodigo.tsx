// src/components/TelaDeCodigo.tsx
import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function TelaDeCodigo() {
  const { 
    desafioAtual, 
    textoDigitado, 
    processarTecla, 
    status, 
    erros, 
    validarLacuna 
  } = useGameStore();

  const [inputLacuna, setInputLacuna] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca automaticamente no input quando entra no modo lacuna
  useEffect(() => {
    if (status === 'NA_LACUNA' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  // Limpa o input apenas quando a fase mudar para a digitação final (sucesso na compilação)
  useEffect(() => {
    if (status === 'DIGITANDO_DEPOIS') {
      setInputLacuna('');
    }
  }, [status]);

  // Efeito de tremer a tela quando um erro é cometido
  useEffect(() => {
    if (erros > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 300);
      return () => clearTimeout(timer);
    }
  }, [erros]);

  // Escuta as teclas para a digitação guiada
  useEffect(() => {
    const lidarComTeclado = (evento: KeyboardEvent) => {
      // Ignora digitação guiada se estiver na lacuna ou validando o Python
      if (status === 'NA_LACUNA' || status === 'VALIDANDO') return;
      if (evento.key.length !== 1) return;
      if (evento.key === ' ') evento.preventDefault();

      processarTecla(evento.key);
    };

    window.addEventListener('keydown', lidarComTeclado);
    return () => window.removeEventListener('keydown', lidarComTeclado);
  }, [processarTecla, status]);

  const handleSubmeterLacuna = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && status !== 'VALIDANDO') {
      validarLacuna(inputLacuna);
    }
  };

  const renderizarTrechoGuiado = (textoAlvo: string, isAtivo: boolean) => {
    if (!isAtivo) return <span className="text-gray-500">{textoAlvo}</span>;

    const digitado = textoAlvo.slice(0, textoDigitado.length);
    const textoFaltante = textoAlvo.slice(textoDigitado.length);
    const caractereAtual = textoFaltante.charAt(0);
    const restoDoTexto = textoFaltante.slice(1);

    return (
      <>
        <span className="text-emerald-400">{digitado}</span>
        {caractereAtual && (
          <span className="bg-blue-600/40 text-blue-100 border-b-4 border-blue-500 animate-pulse">
            {caractereAtual === ' ' ? '\u00A0' : caractereAtual}
          </span>
        )}
        <span className="text-gray-500">{restoDoTexto}</span>
      </>
    );
  };

  // Como o usuário pode digitar uma lógica diferente da padrão (ex: 5 + 5 em vez de 10)
  // vamos mostrar a resposta que ele digitou se ele tiver acertado
  const respostaExibida = inputLacuna.trim() !== '' && (status === 'DIGITANDO_DEPOIS' || status === 'CONCLUIDO') 
    ? inputLacuna 
    : desafioAtual.partes.lacuna;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
      
      {/* Console Output */}
      <div className="w-full bg-black border border-gray-800 p-4 rounded-md font-mono text-sm text-gray-300 shadow-inner">
        <div className="text-gray-500 mb-2">// Console Output Esperado:</div>
        <div className="text-green-400 font-bold">{desafioAtual.outputEsperado}</div>
      </div>

      <div className="flex justify-between w-full text-gray-400 text-sm font-mono px-2 mt-2">
        <span>Erros de Sintaxe/Lógica: <span className="text-red-400 font-bold">{erros}</span></span>
        {status === 'CONCLUIDO' && <span className="text-green-400 font-bold">COMPILADO COM SUCESSO</span>}
        {status === 'VALIDANDO' && <span className="text-yellow-400 font-bold animate-pulse">COMPILANDO...</span>}
      </div>

      {/* Editor de Código (Agora reage a erros) */}
      <div className={`
        p-8 rounded-lg shadow-2xl font-mono text-2xl text-left w-full tracking-wider leading-relaxed flex flex-wrap items-center transition-colors duration-200
        ${isShaking ? 'bg-red-950/30 border-2 border-red-500 animate-shake' : 'bg-gray-900 border border-gray-700'}
      `}>
        
        {/* PARTE 1 */}
        {status === 'DIGITANDO_ANTES' 
          ? renderizarTrechoGuiado(desafioAtual.partes.antes, true)
          : <span className="text-emerald-400">{desafioAtual.partes.antes}</span>
        }

        {/* PARTE 2: A Lacuna */}
        {status === 'DIGITANDO_ANTES' && (
          <span className="mx-2 text-gray-700 bg-gray-800 px-2 rounded">???</span>
        )}
        
        {(status === 'NA_LACUNA' || status === 'VALIDANDO') && (
          <input
            ref={inputRef}
            type="text"
            value={inputLacuna}
            onChange={(e) => setInputLacuna(e.target.value)}
            onKeyDown={handleSubmeterLacuna}
            disabled={status === 'VALIDANDO'}
            className={`
              mx-2 outline-none border-b-2 text-center px-1 font-bold min-w-[6rem] transition-colors
              ${status === 'VALIDANDO' ? 'bg-gray-700 text-gray-400 border-gray-500 cursor-not-allowed' : ''}
              ${isShaking ? 'bg-red-900/50 text-red-200 border-red-500' : 'bg-gray-800 text-yellow-400 border-yellow-500'}
            `}
            placeholder="..."
            style={{ width: `${Math.max(6, inputLacuna.length)}ch` }} /* Expande conforme digita */
          />
        )}

        {(status === 'DIGITANDO_DEPOIS' || status === 'CONCLUIDO') && (
          <span className="mx-2 text-yellow-400 font-bold">{respostaExibida}</span>
        )}

        {/* PARTE 3 */}
        {status === 'DIGITANDO_DEPOIS' 
          ? renderizarTrechoGuiado(desafioAtual.partes.depois, true)
          : status === 'CONCLUIDO' 
            ? <span className="text-emerald-400">{desafioAtual.partes.depois}</span>
            : <span className="text-gray-500">{desafioAtual.partes.depois}</span>
        }

      </div>
    </div>
  );
}