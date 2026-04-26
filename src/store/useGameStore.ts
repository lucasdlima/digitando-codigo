import { create } from 'zustand';
import type { Desafio } from '../types/game';
import desafiosData from '../data/desafios.json';
import { executarPython } from '../services/pythonRunner'; // Importando o motor Python

// Adicionamos o estado VALIDANDO para o período entre o Enter e a resposta do Skulpt
type GameStatus = 'DIGITANDO_ANTES' | 'NA_LACUNA' | 'VALIDANDO' | 'DIGITANDO_DEPOIS' | 'CONCLUIDO';

interface GameState {
  desafioAtual: Desafio;
  textoDigitado: string;
  status: GameStatus;
  erros: number;
  
  processarTecla: (tecla: string) => void;
  validarLacuna: (entrada: string) => Promise<void>; // Agora é assíncrona
  proximoDesafio: (desafio: Desafio) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  desafioAtual: desafiosData[0] as Desafio,
  textoDigitado: '',
  status: 'DIGITANDO_ANTES',
  erros: 0,

  processarTecla: (teclaPressionada) => {
    const { desafioAtual, textoDigitado, status } = get();
    
    // Bloqueia entrada se estiver validando a lógica ou se o desafio acabou
    if (status === 'NA_LACUNA' || status === 'VALIDANDO' || status === 'CONCLUIDO') return;

    const parteAlvo = status === 'DIGITANDO_ANTES' 
      ? desafioAtual.partes.antes 
      : desafioAtual.partes.depois;

    const caractereEsperado = parteAlvo[textoDigitado.length];

    if (teclaPressionada === caractereEsperado) {
      const novoTexto = textoDigitado + teclaPressionada;
      set({ textoDigitado: novoTexto });

      if (status === 'DIGITANDO_ANTES' && novoTexto === desafioAtual.partes.antes) {
        set({ status: 'NA_LACUNA', textoDigitado: '' }); 
      } 
      else if (status === 'DIGITANDO_DEPOIS' && novoTexto === desafioAtual.partes.depois) {
        set({ status: 'CONCLUIDO' });
      }
    } else {
      set((state) => ({ erros: state.erros + 1 }));
    }
  },

  validarLacuna: async (entrada) => {
    const { desafioAtual } = get();
    
    // Indica que o código está sendo "compilado"
    set({ status: 'VALIDANDO' });

    // Montamos o script completo unindo as partes guiadas com a entrada do usuário
    const codigoCompleto = desafioAtual.partes.antes + entrada + desafioAtual.partes.depois;

    try {
      // Chama o interpretador Python (Skulpt)
      const resultadoConsole = await executarPython(codigoCompleto);
      
      // Compara o output real do Python com o esperado pelo desafio
      if (resultadoConsole.trim() === desafioAtual.outputEsperado.trim()) {
        set({ 
          status: 'DIGITANDO_DEPOIS', 
          textoDigitado: '' 
        });
      } else {
        // Erro de lógica: o código rodou mas o resultado foi diferente
        set((state) => ({ erros: state.erros + 1, status: 'NA_LACUNA' }));
      }
    } catch (erro) {
      // Erro de sintaxe: o código nem chegou a rodar (ex: esqueceu aspas ou parênteses)
      set((state) => ({ erros: state.erros + 1, status: 'NA_LACUNA' }));
    }
  },

  proximoDesafio: (novoDesafio) => {
    set({
      desafioAtual: novoDesafio,
      textoDigitado: '',
      status: 'DIGITANDO_ANTES',
      erros: 0
    });
  }
}));