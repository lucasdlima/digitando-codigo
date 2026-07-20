// src/services/pythonRunner.ts

declare const Sk: any;

export const executarPython = (codigo: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let outputDoConsole = '';

    Sk.configure({
      output: (texto: string) => {
        outputDoConsole += texto;
      },
      read: (arquivo: string) => {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][arquivo] === undefined) {
          throw "Arquivo não encontrado: '" + arquivo + "'";
        }
        return Sk.builtinFiles["files"][arquivo];
      }
    });

    Sk.misceval.asyncToPromise(() => {
      return Sk.importMainWithBody("<stdin>", false, codigo, true);
    }).then(() => {
      resolve(outputDoConsole);
    }).catch((erro: any) => {
      reject(erro.toString());
    });
  });
};