import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
console.log("DEBUG: API Key loaded?", apiKey ? "YES (" + apiKey.substring(0, 4) + "...)" : "NO");
const ai = new GoogleGenAI({ apiKey });

// Função auxiliar para converter Blob URL para Base64
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove o prefixo "data:image/xxx;base64,"
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Erro ao converter imagem:", error);
    return "";
  }
}

export const generateTechnicalReport = async (
  roughNotes: string,
  deviceContext: string,
  photos?: string[],
  tone: 'técnico' | 'didático' | 'executivo' = 'técnico'
): Promise<{ defect: string; analysis: string; recommendation: string }> => {

  const model = "gemini-2.5-flash"; // Modelo estável e compatível com Free Tier

  // Tratamento das imagens
  const imageParts: any[] = [];
  if (photos && photos.length > 0) {
    for (const photoUrl of photos) {
      if (photoUrl) {
        // Blob URLs do local ou URLs comuns
        const base64Data = await urlToBase64(photoUrl);
        if (base64Data) {
          imageParts.push({
            inlineData: {
              mimeType: "image/jpeg", // Assumindo JPEG por simplicidade, ou poderia detectar
              data: base64Data
            }
          });
        }
      }
    }
  }

  const promptText = `
    Você é um especialista de TI sênior.
    Gere um laudo técnico com TOM: ${tone.toUpperCase()}.
    
    Contexto do Equipamento: ${deviceContext}
    
    Anotações do técnico: 
    "${roughNotes}"
    
    ${imageParts.length > 0 ? "IMPORTANTE: Analise também as imagens fornecidas para identificar danos físicos visíveis, estado de conservação ou códigos de erro na tela." : ""}
    
    Regras de Formatação:
    1. "Defeito Relatado": Descrição clara do problema.
    2. "Análise Técnica": 3 a 4 tópicos técnicos (bullet points) sobre o diagnóstico. Se houver imagens, cite evidências visuais se relevantes.
    3. "Recomendação": Solução definitiva.
    
    Retorne estritamente em JSON.
  `;

  try {
    const contents = [
      { role: "user", parts: [{ text: promptText }, ...imageParts.map(part => ({ inlineData: part.inlineData }))] }
    ];


    // SDK do Google GenAI para models.generateContent aceita array de contents
    // Mas a tipagem pode variar. Adaptando para a forma mais comum da lib nova:
    // A lib v0.1+ aceita { model, contents: [...] }

    // Hack para a lib @google/genai que pode esperar formatos específicos
    // Se a lib for a nova SDK experimental, 'contents' pode ser simples

    const response = await ai.models.generateContent({
      model: model,
      contents: contents as any, // Cast para evitar erros de tipagem estrita da lib nova
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            defect: {
              type: Type.STRING,
              description: "Descrição técnica do problema."
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