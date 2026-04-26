export interface Desafio {
  id: number;
  titulo: string;
  instrucao: string;
  outputEsperado: string;
  // O código é dividido em partes: [Texto Fixo, Lacuna, Texto Fixo]
  partes: {
    antes: string;     // O que ele digita guiado
    lacuna: string;    // A resposta lógica (ele digita sem guia)
    depois: string;    // O que ele volta a digitar guiado
  };
}