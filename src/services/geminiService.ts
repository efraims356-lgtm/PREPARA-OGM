import { GoogleGenAI } from "@google/genai";
import { Question, MOCK_EXAM_STRUCTURE, DISCIPLINES } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Parses the plain text response from Gemini into Question objects.
 * Improved robustness for variations in spacing and casing.
 */
function parseTextToQuestions(text: string, subject: string, disciplineId: string): Question[] {
  const questions: Question[] = [];
  
  // Split by "QUESTÃO" followed by a number
  const questionBlocks = text.split(/QUEST[AÃ]O\s+\d+/i).filter(block => block.trim().length > 20);

  questionBlocks.forEach((block, index) => {
    try {
      let statement = "";
      let textContext = "";
      const alternatives: { id: string, text: string }[] = [];
      let correctAlternativeId = "";
      let explanation = "";

      // Extract Enunciado
      // Look for "Enunciado:" or just the text before A)
      const enunciadoMatch = block.match(/Enunciado:\s*([\s\S]*?)(?=[A-E]\)|Gabarito:)/i) || 
                             block.match(/^([\s\S]*?)(?=[A-E]\)|Gabarito:)/i);
      
      if (enunciadoMatch) {
        statement = enunciadoMatch[1].trim();
        
        // If there's a lot of text before "Enunciado:", it might be the textContext
        if (statement.includes("Enunciado:")) {
          const parts = statement.split(/Enunciado:/i);
          textContext = parts[0].trim();
          statement = parts[1].trim();
        }
      }

      // Extract Alternatives A) through E)
      const altLetters = ['A', 'B', 'C', 'D', 'E'];
      altLetters.forEach(letter => {
        const regex = new RegExp(`${letter}\\)\\s*([\\s\\S]*?)(?=[A-E]\\)|Gabarito:|$)`, 'i');
        const match = block.match(regex);
        if (match) {
          alternatives.push({ id: letter, text: match[1].trim() });
        }
      });

      // Extract Gabarito
      const gabaritoMatch = block.match(/Gabarito:\s*([A-E])/i);
      if (gabaritoMatch) {
        correctAlternativeId = gabaritoMatch[1].toUpperCase();
      }

      // Extract Explicação
      const explicacaoMatch = block.match(/Explica[çc][ãa]o:\s*([\s\S]*)$/i);
      if (explicacaoMatch) {
        explanation = explicacaoMatch[1].trim();
      }

      if (statement && alternatives.length >= 4 && correctAlternativeId) {
        questions.push({
          id: `q-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          statement,
          textContext: textContext || undefined,
          alternatives,
          correctAlternativeId,
          explanation: explanation || "Sem explicação disponível.",
          incorrectComments: {},
          level: (['Fácil', 'Médio', 'Difícil'] as const)[index % 3],
          subject,
          disciplineId
        });
      }
    } catch (e) {
      console.error("Erro ao processar bloco de questão:", e);
    }
  });

  return questions;
}

export async function generateQuestions(subject: string, amount: number, disciplineId: string, retries = 2): Promise<Question[]> {
  // Using gemini-3-flash-preview for much faster generation
  const model = "gemini-3-flash-preview";
  
  const prompt = `🎯 INSTRUÇÃO PARA IA:
Você é uma banca examinadora especialista no estilo da Consulplan.
Gere exatamente ${amount} questões inéditas sobre o tema: "${subject}".

---
📌 REGRAS OBRIGATÓRIAS:
- Gere EXATAMENTE a quantidade solicitada (${amount})
- Não trave, não explique o processo, apenas gere
- Não repita questões
- Não repita alternativas
- Linguagem formal de concurso público
- Nível misto: fácil, médio e difícil
- Para temas de Geografia e História de Manaus, utilize dados reais, contexto local e situações contextualizadas da cidade.
- Para temas de Ética e Direitos Humanos, utilize legislação atualizada, interpretação de normas jurídicas e situações práticas aplicadas ao cotidiano de agentes públicos.
- Para temas de Direito Constitucional, utilize o texto literal da Constituição Federal de 1988, interpretação de artigos e situações práticas aplicadas ao serviço público, mesclando questões diretas e interpretativas.
- Para temas de Direito Penal, utilize doutrina penal básica (teoria do crime), interpretação de conceitos jurídicos e situações práticas (casos concretos), mesclando teoria e aplicação prática.
- Para temas de Direito Processual Penal, utilize procedimentos penais reais, situações práticas de atuação policial, interpretação da legislação processual penal e casos concretos envolvendo investigação e prova.
- Para temas de Legislação de Trânsito, utilize o texto da legislação de trânsito (CTB), interpretação de normas, situações práticas de fiscalização, infrações, penalidades e medidas administrativas.
- Para temas de Legislação Específica, utilize o texto literal das leis, interpretação de artigos, situações práticas do serviço público e atuação da Guarda Municipal.

---
📊 FORMATO DE SAÍDA (OBRIGATÓRIO):
Responda EXATAMENTE neste formato para cada questão:

QUESTÃO 1  
Enunciado: (texto da questão)

A) (alternativa A)
B) (alternativa B)
C) (alternativa C)
D) (alternativa D)
E) (alternativa E)

Gabarito: (letra correta)
Explicação: (explicação clara e objetiva)

---
QUESTÃO 2  
(repete o mesmo padrão)

---
⚠️ IMPORTANTE:
- NÃO use JSON
- NÃO adicione comentários fora das questões
- NÃO pare no meio
- NÃO diga "aqui estão as questões"
- Comece diretamente da QUESTÃO 1
- Vá até a última questão sem interrupção

Se o tema for "interpretação de texto", inclua um pequeno texto antes da questão.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7, // Slightly higher for more variety
      }
    });

    const text = response.text;
    if (!text) throw new Error("Nenhuma resposta da IA");
    
    console.log("Resposta bruta da IA:", text.substring(0, 200) + "...");
    
    const parsedQuestions = parseTextToQuestions(text, subject, disciplineId);
    
    if (parsedQuestions.length === 0 && retries > 0) {
      console.warn(`Nenhuma questão parseada. Tentando novamente... (${retries} tentativas restantes)`);
      return generateQuestions(subject, amount, disciplineId, retries - 1);
    }

    // If we got some questions but less than requested, it's better than nothing, 
    // but we can try to fill if it's too few.
    return parsedQuestions;
  } catch (error) {
    if (retries > 0) {
      console.error(`Erro na geração. Tentando novamente... (${retries} tentativas restantes)`, error);
      return generateQuestions(subject, amount, disciplineId, retries - 1);
    }
    throw error;
  }
}

export async function generateMockExam(
  onProgress: (progress: number) => void
): Promise<Question[]> {
  const allQuestions: Question[] = [];
  const totalSteps = MOCK_EXAM_STRUCTURE.length;
  let completedSteps = 0;

  // Run generation in parallel chunks to avoid hitting rate limits too hard but still be fast
  const generationPromises = MOCK_EXAM_STRUCTURE.map(async (config) => {
    const discipline = DISCIPLINES.find(d => d.id === config.disciplineId);
    if (!discipline) return [];

    // Pick a random subject for this discipline
    const randomSubject = discipline.subjects[Math.floor(Math.random() * discipline.subjects.length)].title;
    
    try {
      const questions = await generateQuestions(randomSubject, config.count, discipline.id);
      completedSteps++;
      onProgress((completedSteps / totalSteps) * 100);
      return questions;
    } catch (error) {
      console.error(`Erro ao gerar questões para ${discipline.title}:`, error);
      completedSteps++;
      onProgress((completedSteps / totalSteps) * 100);
      return [];
    }
  });

  const results = await Promise.all(generationPromises);
  results.forEach(questions => allQuestions.push(...questions));

  if (allQuestions.length === 0) {
    throw new Error("Não foi possível gerar nenhuma questão para o simulado.");
  }

  // Shuffle questions to mix disciplines
  return allQuestions.sort(() => Math.random() - 0.5);
}
