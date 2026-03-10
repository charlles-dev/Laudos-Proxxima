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
  tone: 'técnico' | 'didático' | 'executivo' = 'técnico',
  outcomeType?: 'internal_fix' | 'parts_request' | 'external_assistance',
  existingParts?: { name: string; quantity: number; partNumber?: string }[]
): Promise<{ defect: string; analysis: string; recommendation: string; partsRequested?: { name: string; quantity: number }[] }> => {

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

  let outcomeContext = "";
  if (outcomeType === 'parts_request') {
    outcomeContext = "O desfecho deste laudo é uma solicitação de peças. Por favor, liste as peças que você sugere serem trocadas com base no diagnóstico.";
    if (existingParts && existingParts.length > 0) {
      const partsList = existingParts.map(p => `${p.quantity}x ${p.name} ${p.partNumber ? `(PN: ${p.partNumber})` : ''}`).join(', ');
      outcomeContext += `\nNOTA: O técnico já inseriu manualmente as seguintes peças na lista de solicitação: ${partsList}. Você deve usar essas informações para basear sua recomendação e NÃO DEVERÁ sugerir peças redundantes.`;
    }
  } else if (outcomeType === 'external_assistance') {
    outcomeContext = "O desfecho deste laudo é o encaminhamento para Assistência Externa. O texto deve justificar a necessidade de serviço especializado.";
  } else if (outcomeType === 'internal_fix') {
    outcomeContext = "O desfecho deste laudo é um reparo interno já realizado. O texto deve concluir atestando a funcionalidade do equipamento.";
  }

  const promptText = `
    Você é um especialista de TI sênior.
    Gere um laudo técnico com TOM: ${tone.toUpperCase()}.
    
    Contexto do Equipamento: ${deviceContext}
    
    Anotações do técnico: 
    "${roughNotes}"
    
    ${imageParts.length > 0 ? "IMPORTANTE: Analise também as imagens fornecidas para identificar danos físicos visíveis, estado de conservação ou códigos de erro na tela." : ""}
    ${outcomeContext}
    
    Regras de Formatação:
    1. "Defeito Relatado": Descrição clara do problema em um único parágrafo conciso.
    2. "Análise Técnica": Estritamente 3 tópicos (bullet points). Cada tópico deve ter no máximo 2 frases curtas.
    3. "Recomendação": Solução definitiva em poucas linhas.
    ${outcomeType === 'parts_request' ? '4. "Peças Sugeridas": Como é uma solicitação de peça, liste as peças sugeridas com nome e quantidade.' : ''}
    
    OBJETIVO PRINCIPAL: O texto deve ser extremamente conciso. O "3. Parecer Técnico" NÃO PODE ir para a segunda página.

    Retorne estritamente em JSON.
  `;

  try {
    const contents = [
      { role: "user", parts: [{ text: promptText }, ...imageParts.map(part => ({ inlineData: part.inlineData }))] }
    ];

    const schemaProperties: any = {
      defect: {
        type: Type.STRING,
        description: "Descrição técnica do problema."
      },
      analysis: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Lista de EXATAMENTE 3 pontos técnicos de diagnóstico. Cada item deve ser curto."
      },
      recommendation: {
        type: Type.STRING,
        description: "Solução recomendada."
      }
    };

    if (outcomeType === 'parts_request') {
      schemaProperties.partsRequested = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.INTEGER }
          },
          required: ["name", "quantity"]
        },
        description: "Lista de peças sugeridas para troca, se aplicável."
      };
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents as any,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: schemaProperties,
          required: ["defect", "analysis", "recommendation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const json = JSON.parse(text);

    // Convert array back to string with bullets for compatibility
    if (Array.isArray(json.analysis)) {
      json.analysis = json.analysis.map((item: string) => `- ${item}`).join('\n');
    }

    return json;

  } catch (error) {
    console.error("Erro ao gerar laudo com IA:", error);
    throw error;
  }
};