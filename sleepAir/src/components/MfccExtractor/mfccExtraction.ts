// src/components/MfccExtractor/mfccExtraction.ts

export const extractMFCCs = (audioFilePath: string): Promise<number[]> => {
    return new Promise((resolve, reject) => {
      // Simula a extração de MFCCs, retornando um array de números aleatórios
      setTimeout(() => {
        const simulatedMFCCs = Array.from({ length: 40 }, (_, i) => Math.random()); // 40 coeficientes simulados
        resolve(simulatedMFCCs);
      }, 1000); // Simula um delay de processamento
    });
  };
  