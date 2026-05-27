// src/components/TecladoVirtual.tsx
import { useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const shiftMap: Record<string, string> = {
  '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
  '_': '-', '+': '=', '{': '[', '}': ']', '|': '\\',
  ':': ';', '"': "'", '<': ',', '>': '.', '?': '/',
};

const fingerColors: Record<string, string> = {
  mindinhoE: 'border-b-4 border-pink-500',
  anelarE: 'border-b-4 border-orange-500',
  medioE: 'border-b-4 border-yellow-500',
  indicadorE: 'border-b-4 border-blue-500',
  polegar: 'border-b-4 border-purple-500',
  indicadorD: 'border-b-4 border-blue-500',
  medioD: 'border-b-4 border-yellow-500',
  anelarD: 'border-b-4 border-orange-500',
  mindinhoD: 'border-b-4 border-pink-500',
  nenhum: 'border-b-4 border-gray-700',
};

const fingerActiveColors: Record<string, string> = {
  mindinhoE: 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.7)]',
  anelarE: 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.7)]',
  medioE: 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(202,138,4,0.7)]',
  indicadorE: 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]',
  polegar: 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.7)]',
  indicadorD: 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]',
  medioD: 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(202,138,4,0.7)]',
  anelarD: 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.7)]',
  mindinhoD: 'bg-pink-600 text-white shadow-[0_0_15px_rgba(219,39,119,0.7)]',
  nenhum: 'bg-gray-600 text-white shadow-[0_0_15px_rgba(75,85,99,0.7)]',
};

const keyboardLayout = [
  [
    { id: '`', label: '`', shift: '~', finger: 'mindinhoE' },
    { id: '1', label: '1', shift: '!', finger: 'mindinhoE' },
    { id: '2', label: '2', shift: '@', finger: 'anelarE' },
    { id: '3', label: '3', shift: '#', finger: 'medioE' },
    { id: '4', label: '4', shift: '$', finger: 'indicadorE' },
    { id: '5', label: '5', shift: '%', finger: 'indicadorE' },
    { id: '6', label: '6', shift: '^', finger: 'indicadorD' },
    { id: '7', label: '7', shift: '&', finger: 'indicadorD' },
    { id: '8', label: '8', shift: '*', finger: 'medioD' },
    { id: '9', label: '9', shift: '(', finger: 'anelarD' },
    { id: '0', label: '0', shift: ')', finger: 'mindinhoD' },
    { id: '-', label: '-', shift: '_', finger: 'mindinhoD' },
    { id: '=', label: '=', shift: '+', finger: 'mindinhoD' },
    { id: 'backspace', label: 'Backspace', width: 'w-24', finger: 'mindinhoD' },
  ],
  [
    { id: 'tab', label: 'Tab', width: 'w-20', finger: 'mindinhoE' },
    { id: 'q', label: 'Q', finger: 'mindinhoE' },
    { id: 'w', label: 'W', finger: 'anelarE' },
    { id: 'e', label: 'E', finger: 'medioE' },
    { id: 'r', label: 'R', finger: 'indicadorE' },
    { id: 't', label: 'T', finger: 'indicadorE' },
    { id: 'y', label: 'Y', finger: 'indicadorD' },
    { id: 'u', label: 'U', finger: 'indicadorD' },
    { id: 'i', label: 'I', finger: 'medioD' },
    { id: 'o', label: 'O', finger: 'anelarD' },
    { id: 'p', label: 'P', finger: 'mindinhoD' },
    { id: '[', label: '[', shift: '{', finger: 'mindinhoD' },
    { id: ']', label: ']', shift: '}', finger: 'mindinhoD' },
    { id: '\\', label: '\\', shift: '|', width: 'w-16', finger: 'mindinhoD' },
  ],
  [
    { id: 'caps', label: 'Caps', width: 'w-24', finger: 'mindinhoE' },
    { id: 'a', label: 'A', finger: 'mindinhoE' },
    { id: 's', label: 'S', finger: 'anelarE' },
    { id: 'd', label: 'D', finger: 'medioE' },
    { id: 'f', label: 'F', finger: 'indicadorE' },
    { id: 'g', label: 'G', finger: 'indicadorE' },
    { id: 'h', label: 'H', finger: 'indicadorD' },
    { id: 'j', label: 'J', finger: 'indicadorD' },
    { id: 'k', label: 'K', finger: 'medioD' },
    { id: 'l', label: 'L', finger: 'anelarD' },
    { id: ';', label: ';', shift: ':', finger: 'mindinhoD' },
    { id: "'", label: "'", shift: '"', finger: 'mindinhoD' },
    { id: 'enter', label: 'Enter', width: 'w-20', finger: 'mindinhoD' },
  ],
  [
    { id: 'shiftL', label: 'Shift', width: 'w-32', finger: 'mindinhoE' },
    { id: 'z', label: 'Z', finger: 'mindinhoE' },
    { id: 'x', label: 'X', finger: 'anelarE' },
    { id: 'c', label: 'C', finger: 'medioE' },
    { id: 'v', label: 'V', finger: 'indicadorE' },
    { id: 'b', label: 'B', finger: 'indicadorE' },
    { id: 'n', label: 'N', finger: 'indicadorD' },
    { id: 'm', label: 'M', finger: 'indicadorD' },
    { id: ',', label: ',', shift: '<', finger: 'medioD' },
    { id: '.', label: '.', shift: '>', finger: 'anelarD' },
    { id: '/', label: '/', shift: '?', finger: 'mindinhoD' },
    { id: 'shiftR', label: 'Shift', width: 'w-28', finger: 'mindinhoD' },
  ],
  [
    { id: 'space', label: 'Espaço', width: 'w-96', finger: 'polegar' },
  ]
];

export default function TecladoVirtual() {
  // Apenas lemos esses dados para renderização visual
  const { status, desafioAtual, textoDigitado } = useGameStore();
  const [teclaErrada, setTeclaErrada] = useState<string | null>(null);
  const [teclaCorreta, setTeclaCorreta] = useState<string | null>(null);

  // Escutador Mestre do Teclado
  useEffect(() => {
    const handleTeclado = (evento: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (state.status === 'NA_LACUNA' || state.status === 'VALIDANDO' || state.status === 'CONCLUIDO') return;

      // Inicia o cronômetro no primeiro toque na tecla
      state.iniciarTimer();

      let teclaPressionada = evento.key;
      if (teclaPressionada === 'Enter') {
        teclaPressionada = '\n';
        evento.preventDefault();
        evento.stopPropagation();
      }

      if (teclaPressionada.length !== 1) return;
      evento.preventDefault(); 

      let charEsperado: string | null = null;
      if (state.status === 'DIGITANDO_ANTES') {
        charEsperado = state.desafioAtual.partes.antes[state.textoDigitado.length] || null;
      } else if (state.status === 'DIGITANDO_DEPOIS') {
        charEsperado = state.desafioAtual.partes.depois[state.textoDigitado.length] || null;
      }

      if (!charEsperado) return;

      // --- NOVA LÓGICA DE IDENTIFICAÇÃO DE DEDO ---
      let targetKeyId = charEsperado.toLowerCase();
      if (targetKeyId === ' ') targetKeyId = 'space';
      else if (targetKeyId === '\n') targetKeyId = 'enter';
      else if (shiftMap[charEsperado]) targetKeyId = shiftMap[charEsperado];

      // Busca qual dedo é responsável por essa tecla esperada
      let dedoResponsavel: string = 'nenhum';
      for (const row of keyboardLayout) {
        const key = row.find(k => k.id === targetKeyId);
        if (key && key.finger) {
          dedoResponsavel = key.finger;
          break;
        }
      }
      // ---------------------------------------------

      let keyId = teclaPressionada.toLowerCase();
      if (keyId === ' ') keyId = 'space';
      else if (keyId === '\n') keyId = 'enter';
      else if (shiftMap[teclaPressionada]) keyId = shiftMap[teclaPressionada];

      // Registra a métrica e pisca a cor
      if (teclaPressionada === charEsperado) {
        state.registrarToque(dedoResponsavel as any, true);
        setTeclaCorreta(keyId);
        setTimeout(() => setTeclaCorreta(null), 100);
      } else {
        state.registrarToque(dedoResponsavel as any, false);
        setTeclaErrada(keyId);
        setTimeout(() => setTeclaErrada(null), 300);
      }

      state.processarTecla(teclaPressionada);
    };

    window.addEventListener('keydown', handleTeclado, true);
    return () => window.removeEventListener('keydown', handleTeclado, true);
  }, []);

  let caractereAtual: string | null = null;
  if (status === 'DIGITANDO_ANTES') {
    caractereAtual = desafioAtual.partes.antes[textoDigitado.length] || null;
  } else if (status === 'DIGITANDO_DEPOIS') {
    caractereAtual = desafioAtual.partes.depois[textoDigitado.length] || null;
  }

  let teclaAlvoId = caractereAtual?.toLowerCase();
  let precisaShift = false;

  if (caractereAtual) {
    if (caractereAtual === ' ') teclaAlvoId = 'space';
    else if (caractereAtual === '\n') teclaAlvoId = 'enter';
    else if (caractereAtual >= 'A' && caractereAtual <= 'Z') precisaShift = true;
    else if (shiftMap[caractereAtual]) {
      precisaShift = true;
      teclaAlvoId = shiftMap[caractereAtual];
    }
  }

  const isTeclaAtiva = (keyId: string) => {
    if (!caractereAtual) return false;
    if (precisaShift && keyId.startsWith('shift')) return true; 
    return keyId === teclaAlvoId;
  };

  return (
    <div className="mt-8 p-4 bg-gray-900 rounded-xl border border-gray-700 shadow-2xl">
      <div className="flex flex-col gap-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {row.map((key) => {
              const ativa = isTeclaAtiva(key.id);
              const isErro = teclaErrada === key.id;
              const isSucesso = teclaCorreta === key.id;
              
              let classesEstado = '';

              if (isErro) {
                classesEstado = `bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.8)] transform scale-95 border-none z-20`;
              } else if (isSucesso) {
                classesEstado = `bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.8)] transform scale-95 border-none z-20`;
              } else if (ativa) {
                const corAtiva = fingerActiveColors[key.finger] || fingerActiveColors.nenhum;
                classesEstado = `${corAtiva} transform scale-105 z-10 border-none`;
              } else {
                const corBase = fingerColors[key.finger] || fingerColors.nenhum;
                classesEstado = `bg-gray-800 text-gray-400 ${corBase}`;
              }
              
              return (
                <div
                  key={key.id}
                  className={`relative flex flex-col items-center justify-center rounded-md font-mono text-sm transition-all duration-75 ${key.width || 'w-12'} h-12 ${classesEstado}`}
                >
                  {key.shift && (
                    <span className={`absolute top-1 left-2 text-[10px] ${ativa || isErro || isSucesso ? 'text-white/70' : 'text-gray-500'}`}>
                      {key.shift}
                    </span>
                  )}
                  <span className={key.shift ? 'mt-2' : ''}>{key.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-6 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded-full"></div> Mindinho</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Anelar</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Médio</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Indicador</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Polegar</span>
      </div>
    </div>
  );
}