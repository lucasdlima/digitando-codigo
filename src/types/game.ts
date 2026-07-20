export interface Desafio {
  id: number;
  categoria: string;
  titulo: string;
  instrucao: string;
  dica?: string;
  metasWpm: [number, number, number];
  outputEsperado: string;
  partes: {
    antes: string;
    lacuna: string;
    depois: string;
  };
}