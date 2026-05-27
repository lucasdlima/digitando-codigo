import { create } from 'zustand';
import type { Desafio } from '../types/game';
import desafiosData from '../data/desafios.json';
import { executarPython } from '../services/pythonRunner';

type GameStatus = 'DIGITANDO_ANTES' | 'NA_LACUNA' | 'VALIDANDO' | 'DIGITANDO_DEPOIS' | 'CONCLUIDO';
export type FingerName = 'mindinhoE' | 'anelarE' | 'medioE' | 'indicadorE' | 'polegar' | 'indicadorD' | 'medioD' | 'anelarD' | 'mindinhoD' | 'nenhum';

interface FingerStats {
  acertos: number;
  erros: number;
  atrasoAcumulado: number; // Em milissegundos
}

const initialMetricas: Record<FingerName, FingerStats> = {
  mindinhoE: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, anelarE: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  medioE: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, indicadorE: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  polegar: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, indicadorD: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  medioD: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, anelarD: { acertos: 0, erros: 0, atrasoAcumulado: 0 },
  mindinhoD: { acertos: 0, erros: 0, atrasoAcumulado: 0 }, nenhum: { acertos: 0, erros: 0, atrasoAcumulado: 0 }
};

interface GameState {
  desafioAtual: Desafio;
  textoDigitado: string;
  lacunaPreenchida: string;
  status: GameStatus;
  erros: number;
  
  // Cronômetro Pausável e Dinâmica de Digitação
  tempoAtivoTotal: number;
  ultimoInicioTempo: number | null;
  ultimoToqueAtivo: number | null;
  metricasDedos: Record<FingerName, FingerStats>;
  
  processarTecla: (tecla: string) => void;
  validarLacuna: (entrada: string) => Promise<void>;
  proximoDesafio: (desafio: Desafio) => void;
  registrarToque: (dedo: FingerName, isAcerto: boolean) => void;
  iniciarTimer: () => void;
  pausarTimer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  desafioAtual: desafiosData[0] as Desafio,
  textoDigitado: '',
  lacunaPreenchida: '',
  status: 'DIGITANDO_ANTES',
  erros: 0,
  
  tempoAtivoTotal: 0,
  ultimoInicioTempo: null,
  ultimoToqueAtivo: null,
  metricasDedos: JSON.parse(JSON.stringify(initialMetricas)),

  iniciarTimer: () => {
    const agora = Date.now();
    if (!get().ultimoInicioTempo) {
      set({ ultimoInicioTempo: agora, ultimoToqueAtivo: agora });
    }
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
      // Calcula a velocidade instantânea (Limitado a 1.5s para punições não desviarem a métrica se o usuário espirrar)
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

      // PAUSA O RELÓGIO quando entra na lacuna ou conclui
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
        // VOLTA O RELÓGIO quando a parte final do código destrava
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