import { create } from 'zustand';
import type { Desafio } from '../types/game';
import desafiosData from '../data/desafios.json';
import { executarPython } from '../services/pythonRunner';

type GameStatus = 'DIGITANDO_ANTES' | 'NA_LACUNA' | 'VALIDANDO' | 'DIGITANDO_DEPOIS' | 'CONCLUIDO';
export type FingerName = 'mindinhoE' | 'anelarE' | 'medioE' | 'indicadorE' | 'polegar' | 'indicadorD' | 'medioD' | 'anelarD' | 'mindinhoD' | 'nenhum';

interface FingerStats {
  acertos: number;
  erros: number;
  atrasoAcumulado: number;
}

// --- NOVO: Interface de Recordes ---
interface Recorde {
  tempoMs: number;
  wpm: number;
}

const initialMetricas: Record<FingerName, FingerStats> = {
  mindinhoE: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, anelarE: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  medioE: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, indicadorE: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  polegar: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, indicadorD: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  medioD: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, anelarD: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  mindinhoD: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, nenhum: { acertos: 0, erros: 0, atrasoAcumulado: 0 }
};

interface GameState {
  telaAtual: 'MENU' | 'JOGO';
  desafioAtual: Desafio;
  textoDigitado: string;
  lacunaPreenchida: string;
  status: GameStatus;
  erros: number;
  
  tempoAtivoTotal: number;
  ultimoInicioTempo: number | null;
  ultimoToqueAtivo: number | null;
  metricasDedos: Record<FingerName, FingerStats>;
  
  // --- NOVO: Variável e Função de Recordes ---
  recordes: Record<number, Recorde>;
  salvarRecorde: (id: number, tempoMs: number, wpm: number) => void;
  
  voltarParaMenu: () => void;
  iniciarDesafio: (desafio: Desafio) => void;
  processarTecla: (tecla: string) => void;
  validarLacuna: (entrada: string) => Promise<void>;
  proximoDesafio: (desafio: Desafio) => void;
  registrarToque: (dedo: FingerName, isAcerto: boolean) => void;
  iniciarTimer: () => void;
  pausarTimer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Lê do cache do navegador ao abrir o app
  recordes: JSON.parse(localStorage.getItem('digitando_codigo_recordes') || '{}'),
  
  telaAtual: 'MENU',
  desafioAtual: desafiosData[0] as Desafio,
  textoDigitado: '',
  lacunaPreenchida: '',
  status: 'DIGITANDO_ANTES',
  erros: 0,
  tempoAtivoTotal: 0,
  ultimoInicioTempo: null,
  ultimoToqueAtivo: null,
  metricasDedos: JSON.parse(JSON.stringify(initialMetricas)),

  // --- NOVA FUNÇÃO ---
  salvarRecorde: (id, tempoMs, wpm) => {
    set((state) => {
      const recordeAntigo = state.recordes[id];
      // Só salva se não tiver recorde, ou se o WPM for maior, ou se o WPM for igual e o tempo for menor
      if (!recordeAntigo || wpm > recordeAntigo.wpm || (wpm === recordeAntigo.wpm && tempoMs < recordeAntigo.tempoMs)) {
        const novosRecordes = { ...state.recordes, [id]: { tempoMs, wpm } };
        localStorage.setItem('digitando_codigo_recordes', JSON.stringify(novosRecordes));
        return { recordes: novosRecordes };
      }
      return state;
    });
  },

  voltarParaMenu: () => set({ telaAtual: 'MENU' }),

  iniciarDesafio: (desafioSelecionado) => {
    set({
      telaAtual: 'JOGO',
      desafioAtual: desafioSelecionado,
      textoDigitado: '',
      lacunaPreenchida: '',
      status: 'DIGITANDO_ANTES',
      erros: 0,
      tempoAtivoTotal: 0,
      ultimoInicioTempo: null,
      ultimoToqueAtivo: null,
      metricasDedos: JSON.parse(JSON.stringify(initialMetricas))
    });
  },

  iniciarTimer: () => {
    const agora = Date.now();
    if (!get().ultimoInicioTempo) set({ ultimoInicioTempo: agora, ultimoToqueAtivo: agora });
  },

  pausarTimer: () => {
    const { ultimoInicioTempo, tempoAtivoTotal } = get();
    if (ultimoInicioTempo) {
      set({ 
        tempoAtivoTotal: tempoAtivoTotal + (Date.now() - ultimoInicioTempo), 
        ultimoInicioTempo: null,
        ultimoToqueAtivo: null 
      });
    }
  },

  registrarToque: (dedo, isAcerto) => {
    set((state) => {
      const agora = Date.now();
      const atrasoReal = state.ultimoToqueAtivo ? (agora - state.ultimoToqueAtivo) : 0;
      const atrasoValido = Math.min(atrasoReal, 1500);

      const novasMetricas = { ...state.metricasDedos };
      novasMetricas[dedo] = { ...novasMetricas[dedo] }; 

      if (isAcerto) {
        novasMetricas[dedo].acertos += 1;
        novasMetricas[dedo].atrasoAcumulado += atrasoValido;
      } else {
        novasMetricas[dedo].erros += 1;
      }

      return { metricasDedos: novasMetricas, ultimoToqueAtivo: agora };
    });
  },

  processarTecla: (teclaPressionada) => {
    const { desafioAtual, textoDigitado, status, pausarTimer } = get();
    if (status === 'NA_LACUNA' || status === 'VALIDANDO' || status === 'CONCLUIDO') return;

    const parteAlvo = status === 'DIGITANDO_ANTES' ? desafioAtual.partes.antes : desafioAtual.partes.depois;
    const caractereEsperado = parteAlvo[textoDigitado.length];

    if (teclaPressionada === caractereEsperado) {
      const novoTexto = textoDigitado + teclaPressionada;
      set({ textoDigitado: novoTexto });

      if (status === 'DIGITANDO_ANTES' && novoTexto === desafioAtual.partes.antes) {
        set({ status: 'NA_LACUNA', textoDigitado: '' }); 
        pausarTimer();
      } 
      else if (status === 'DIGITANDO_DEPOIS' && novoTexto === desafioAtual.partes.depois) {
        set({ status: 'CONCLUIDO' });
        pausarTimer(); 
      }
    } else {
      set((state) => ({ erros: state.erros + 1 }));
    }
  },

  validarLacuna: async (entrada) => {
    const { desafioAtual, iniciarTimer } = get();
    set({ status: 'VALIDANDO' });

    const codigoCompleto = desafioAtual.partes.antes + entrada + desafioAtual.partes.depois;

    try {
      const resultadoConsole = await executarPython(codigoCompleto);
      if (resultadoConsole.trim() === desafioAtual.outputEsperado.trim()) {
        set({ status: 'DIGITANDO_DEPOIS', textoDigitado: '', lacunaPreenchida: entrada });
        iniciarTimer();
      } else {
        set((state) => ({ erros: state.erros + 1, status: 'NA_LACUNA' }));
      }
    } catch (erro) {
      set((state) => ({ erros: state.erros + 1, status: 'NA_LACUNA' }));
    }
  },

  proximoDesafio: (novoDesafio) => {
    set({
      desafioAtual: novoDesafio,
      textoDigitado: '',
      lacunaPreenchida: '',
      status: 'DIGITANDO_ANTES',
      erros: 0,
      tempoAtivoTotal: 0,
      ultimoInicioTempo: null,
      ultimoToqueAtivo: null,
      metricasDedos: JSON.parse(JSON.stringify(initialMetricas))
    });
  }
}));