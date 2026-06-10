export interface Desafio {
  id: number;
  categoria: string; // <-- NOVA PROPRIEDADE
  titulo: string;
  instrucao: string;
  outputEsperado: string;
  partes: {
    antes: string;
    lacuna: string;
    depois: string;
  };
}