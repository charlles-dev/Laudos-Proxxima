import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTechnicalReport = async (
  roughNotes: string,
  deviceContext: string
): Promise<{ defect: string; analysis: string; recommendation: string }> => {
  
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Você é um especialista de TI. Gere um laudo técnico equilibrado (nem muito curto, nem verboso).
    
    Contexto do Equipamento: ${deviceContext}
    
    Anotações do técnico: 
    "${roughNotes}"
    
    Regras de Formatação:
    1. "Defeito Relatado": Uma descrição técnica clara e direta do problema, com cerca de 2 a 3 linhas. Evite ser excessivamente breve, mas não conte histórias.
    2. "Análise Técnica": Gere 3 a 4 tópicos técnicos (bullet points) sobre o diagnóstico. Use linguagem técnica apropriada.
    3. "Recomendação": A solução definitiva em 1 ou 2 frases objetivas.
    
    Retorne estritamente em JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            defect: {
              type: Type.STRING,
              description: "Descrição técnica do problema (tamanho médio)."
            },
            analysis: {
              type: Type.STRING,
              description: "Lista de diagnóstico técnico."
            },
            recommendation: {
              type: Type.STRING,
              description: "Solução recomendada."
            }
          },
          required: ["defect", "analysis", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Erro ao gerar laudo com IA:", error);
    throw error;
  }
};