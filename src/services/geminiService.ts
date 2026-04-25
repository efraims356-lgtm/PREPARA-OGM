import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { Question, MOCK_EXAM_STRUCTURE, DISCIPLINES, FlashCard } from "../types";

const getApiKey = () => {
  // Use platform-provided process.env
  const key = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || "";
  
  if (!key) {
    console.warn("GEMINI_API_KEY não encontrada no ambiente.");
  }
  return key;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

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
      // Look for "Enunciado:" or just the text before the first alternative
      const enunciadoMatch = block.match(/Enunciado:\s*([\s\S]*?)(?=\n\s*[A-E][\)\.\-]|Gabarito:)/i) || 
                             block.match(/^([\s\S]*?)(?=\n\s*[A-E][\)\.\-]|Gabarito:)/i);
      
      if (enunciadoMatch) {
        statement = enunciadoMatch[1].trim();
        
        // If there's a lot of text before "Enunciado:", it might be the textContext
        if (statement.includes("Enunciado:")) {
          const parts = statement.split(/Enunciado:/i);
          textContext = parts[0].trim();
          statement = parts[1].trim();
        }
      }

      // Extract Alternatives A) through D)
      const altLetters = ['A', 'B', 'C', 'D'];
      altLetters.forEach(letter => {
        // More robust regex: looks for Letter followed by ) or . or - at the start of a line or after whitespace
        // and captures until the next alternative, Gabarito, or end of block.
        const regex = new RegExp(`(?:^|\\n)\\s*${letter}[\\)\\.\\-]\\s*([\\s\\S]*?)(?=\\n\\s*[A-D][\\)\\.\\-]|\\n\\s*Gabarito:|$)`, 'i');
        const match = block.match(regex);
        const text = match ? match[1].trim() : "";
        
        if (text.length > 0) {
          alternatives.push({ id: letter, text });
        }
      });

      // Extract Gabarito
      const gabaritoMatch = block.match(new RegExp(`Gabarito:\\s*([A-D])`, 'i'));
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

export async function generateQuestions(subject: string | string[], amount: number, disciplineId: string, isDisciplineWide = false, retries = 1): Promise<Question[]> {
  // Using gemini-3-flash-preview for much faster response times as requested by user
  const model = "gemini-3-flash-preview";
  
  let subjectContext = "";
  if (Array.isArray(subject)) {
    subjectContext = `distribuídas equilibradamente entre os seguintes temas: ${subject.join(', ')}`;
  } else {
    subjectContext = `sobre o tema: "${subject}"`;
  }
  
  if (isDisciplineWide) {
    const discipline = DISCIPLINES.find(d => d.id === disciplineId);
    if (discipline) {
      const subjectsList = discipline.subjects.map(s => `- ${s.title}`).join('\n');
      subjectContext = `da disciplina "${discipline.title}", distribuídas equilibradamente entre os temas:\n${subjectsList}`;
    }
  }

  const prompt = `🎯 INSTRUÇÃO PARA IA:
Você é uma banca examinadora especialista no estilo da Consulplan.
Gere exatamente ${amount} questões inéditas ${subjectContext}.

---
📌 REGRAS OBRIGATÓRIAS:
- Gere EXATAMENTE a quantidade solicitada (${amount})
- Não trave, não explique o processo, apenas gere
- Não repita questões
- Não repita alternativas
- Linguagem formal de concurso público
- Nível: Médio a Difícil (conforme padrão rigoroso da banca Consulplan para guardas municipais)
- Mantenha o padrão de cobrança da Consulplan: questões de múltipla escolha com textos de apoio, interpretação e pegadinhas clássicas da banca.
- Formato: Múltipla escolha com exatamente 4 alternativas (A, B, C, D)
- Todas as 4 alternativas (A, B, C, D) DEVEM conter texto obrigatório. NUNCA deixe uma alternativa em branco ou apenas com a letra.
- Para temas de Informática, utilize conceitos técnicos atualizados, atalhos de teclado comuns, funcionalidades de softwares (Office/Windows) e segurança da informação.
- Para temas de Geografia e História Regional, utilize dados reais, contexto local e situações contextualizadas da região.
- Para temas de Ética e Direitos Humanos, utilize legislação atualizada, interpretação de normas jurídicas e situações práticas aplicadas ao cotidiano de agentes públicos.
- Para temas de Direito Constitucional, utilize o texto literal da Constituição Federal de 1988, interpretação de artigos e situações práticas aplicadas ao serviço público, mesclando questões diretas e interpretativas.
- Para temas de Direito Penal, utilize doutrina penal básica (teoria do crime), interpretação de conceitos jurídicos e situações práticas (casos concretos), mesclando teoria e aplicação prática.
- Para temas de Direito Penal 2, utilize o texto literal das leis (Código Penal), interpretação de artigos, situações práticas do serviço público e atuação de agentes de segurança, focando na cobrança típica da banca Consulplan.
- Para temas de Direito Processual Penal, utilize procedimentos penais reais, situações práticas de atuação policial, interpretação da legislação processual penal e casos concretos envolvendo investigação e prova.
- Para temas de Legislação de Trânsito, utilize o texto da legislação de trânsito (CTB), interpretação de normas, situações práticas de fiscalização, infrações, penalidades e medidas administrativas.
- Para temas de Legislação Específica, utilize o texto literal das leis, interpretação de artigos, situações práticas do serviço público e atuação de agentes de segurança.

---
📊 FORMATO DE SAÍDA (OBRIGATÓRIO):
Responda EXATAMENTE neste formato para cada questão:

QUESTÃO 1  
Enunciado: (texto da questão)

A) (alternativa A)
B) (alternativa B)
C) (alternativa C)
D) (alternativa D)

Gabarito: (letra correta)
Explicação: (explicação detalhada, clara e objetiva, comentando por que a correta está certa e as outras erradas)

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
- Se o tema envolver interpretação, inclua o texto necessário antes do enunciado.`;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Tempo limite de geração excedido (60s).")), 60000)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.7,
          safetySettings
        }
      }),
      timeoutPromise
    ]) as any;

    const text = response.text;
    if (!text) throw new Error("Nenhuma resposta da IA");
    
    console.log("Resposta bruta da IA:", text.substring(0, 200) + "...");
    
    const subjectLabel = Array.isArray(subject) ? subject.join(', ') : subject;
    const parsedQuestions = parseTextToQuestions(text, isDisciplineWide ? "Simulado Geral" : subjectLabel, disciplineId);
    
    if (parsedQuestions.length === 0 && retries > 0) {
      console.warn(`Nenhuma questão parseada. Tentando novamente... (${retries} tentativas restantes)`);
      return generateQuestions(subject, amount, disciplineId, isDisciplineWide, retries - 1);
    }
    
    if (parsedQuestions.length === 0) {
      throw new Error("A IA gerou uma resposta mas o sistema não conseguiu extrair as questões. Tente um tema mais específico ou quantidade menor.");
    }

    return parsedQuestions;
  } catch (error: any) {
    console.error("Erro na generateQuestions:", error);
    if (retries > 0) {
      return generateQuestions(subject, amount, disciplineId, isDisciplineWide, retries - 1);
    }
    throw error;
  }
}

export async function generateReview(disciplineTitle: string, subjectTitle?: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const selectionContext = subjectTitle 
    ? `- Matéria: ${disciplineTitle}\n- Assunto: ${subjectTitle}`
    : `- Matéria: ${disciplineTitle} (Revisão Geral da Disciplina)`;

  const prompt = `🎯 INSTRUÇÃO DO SISTEMA:
Ative o "MODO RETA FINAL – CONSULPLAN (2 DIAS)".
Você é um especialista em concursos públicos, com foco na banca CONSULPLAN, especialmente em provas de segurança pública.

O usuário selecionou:
${selectionContext}

Sua missão é gerar uma revisão estratégica de última hora, considerando que faltam apenas 2 dias para a prova.
${!subjectTitle ? "Como é uma revisão geral da matéria, foque nos temas mais recorrentes de todo o edital desta disciplina." : ""}

Siga EXATAMENTE esta estrutura:

---
📌 TÓPICOS MAIS IMPORTANTES (TOP 5)
Liste apenas os 5 pontos com maior probabilidade de cair, com base no padrão da CONSULPLAN.

---
⚠️ PEGADINHAS DA BANCA
Mostre como a CONSULPLAN costuma confundir os candidatos nesse assunto.

---
🧠 RESUMO ULTRA RÁPIDO
Explique de forma direta, simples e objetiva (estilo véspera de prova).

---
📝 5 QUESTÕES ESTILO CONSULPLAN
Crie 5 questões objetivas com 4 alternativas (A, B, C, D).
Nível: médio
Foco: estilo da banca CONSULPLAN

---
✅ GABARITO COMENTADO
Explique rapidamente cada resposta correta.

---
🔥 DICA FINAL DE PROVA
Uma dica estratégica para aumentar as chances de acerto nesse tema.

---
[REGRAS IMPORTANTES]
- NÃO gerar texto longo
- NÃO fugir do tema
- Linguagem simples e direta
- Foco total em revisão prática
- Priorizar padrões da banca CONSULPLAN
- Evitar teoria desnecessária
- Use Markdown para formatação.`;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Tempo limite de geração excedido (60s).")), 60000)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.5,
          safetySettings
        }
      }),
      timeoutPromise
    ]) as any;

    return response.text || "Não foi possível gerar a revisão.";
  } catch (error) {
    console.error("Erro ao gerar revisão:", error);
    throw error;
  }
}

export async function generateEssaySkeleton(theme: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `🎯 INSTRUÇÃO DO SISTEMA:
Ative o "MODO REDAÇÃO – ESQUELETO MODERNO + CORES + BIZU".
Você é um especialista em redação para concursos públicos, com foco na banca CONSULPLAN.

Sua missão é gerar um ESQUELETO DE REDAÇÃO com estrutura clara, organização visual moderna e foco em memorização.

TEMA: ${theme}

---
🎯 DIRETRIZES DE DESIGN:
- Layout LIMPO (clean)
- Sem excesso de texto
- Títulos bem destacados
- Fácil leitura e memorização

---
Para o tema "${theme}", gere o conteúdo EXATAMENTE neste formato:

━━━━━━━━━━━━━━━━━━━━━━━
🧱 TEMA: ${theme}
━━━━━━━━━━━━━━━━━━━━━━━

[INTRODUCAO]
🔵 INTRODUÇÃO
- Contextualização: (frase pronta)
- Problema: (frase pronta)
- Tese: (frase pronta)

---

[DESENVOLVIMENTO]
🟡 DESENVOLVIMENTO 1 (CAUSAS)
- Causa principal: (argumento)
- Explicação: (desenvolvimento curto)
- Conectivo pronto: **(termo em negrito)**

---

🟠 DESENVOLVIMENTO 2 (CONSEQUÊNCIAS)
- Impacto social: (argumento)
- Consequência: (desenvolvimento curto)
- Continuação lógica: **(termo em negrito)**

---

[CONCLUSAO]
🟢 CONCLUSÃO (SOLUÇÃO)
- Intervenção: (o que fazer)
- Quem resolve: (agente)
- Como resolve: (meio/modo)
- Fechamento forte: (frase final)

---

🟣 FRASES CORINGA
- (Frase 1)
- (Frase 2)
- (Frase 3)

---

🔥 BIZU DE MEMORIZAÇÃO
Nome do Bizu: (curto)
Formato: (ex: ICCS)
Explicação: (I -> Introdução, C -> Causa, etc.)

---
⚠️ REGRAS:
- Use **NEGRITO** para palavras-chave e conectivos.
- Mantenha os marcadores [INTRODUCAO], [DESENVOLVIMENTO] e [CONCLUSAO] para organização do sistema.
- Linguagem simples e direta.`;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Tempo limite de geração excedido (60s).")), 60000)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.4,
          safetySettings
        }
      }),
      timeoutPromise
    ]) as any;

    return response.text || "Não foi possível gerar o esqueleto de redação.";
  } catch (error) {
    console.error("Erro ao gerar esqueleto de redação:", error);
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

export async function generateFlashCards(
  disciplineId: string, 
  subjectTitle: string | string[], 
  amount: number, 
  mode: string
): Promise<FlashCard[]> {
  const model = "gemini-3-flash-preview";
  
  let subjectContext = "";
  if (disciplineId === 'all') {
    subjectContext = "de todas as matérias do concurso Guarda Municipal de Manaus";
  } else {
    const disc = DISCIPLINES.find(d => d.id === disciplineId);
    subjectContext = `da disciplina "${disc?.title}" sobre ${Array.isArray(subjectTitle) ? subjectTitle.join(', ') : subjectTitle}`;
  }

  const prompt = `🎯 INSTRUÇÃO PARA IA:
Você é um especialista pedagógico em concursos públicos.
Sua missão é gerar EXATAMENTE ${amount} FLASH CARDS premiums ${subjectContext}.

MODO DE GERAÇÃO: "${mode}"

---
📌 REGRAS DE CONTEÚDO (PADRÃO CURSINHO PREMIUM):
- Linguagem simples e direta (foco em memorização)
- Use macetes, "bisus" e gatilhos mentais
- Destaque pontos que a banca (Consulplan) costuma cobrar
- Use palavras-chave estratégicas
- Conteúdo 100% focado em aprovação

---
📊 FORMATO DE SAÍDA (OBRIGATÓRIO):
Responda EXATAMENTE neste formato para cada card:

FLASHCARD 1
Frente: (pergunta, conceito ou palavra-chave curta)
Verso: (resposta objetiva e curta)
Explicação: (breve explicação pedagógica, máx 2 linhas)
Bizu: (dica de ouro, macete ou pegadinha da banca)

---
FLASHCARD 2
(repete o padrão)

---
⚠️ IMPORTANTE:
- NÃO use JSON
- Marque o início de cada card com "FLASHCARD X"
- Seja extremamente objetivo
- Siga rigorosamente o MODO DE GERAÇÃO solicitado.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        safetySettings
      }
    }) as any;

    const text = response.text;
    if (!text) throw new Error("Nenhuma resposta da IA");

    const cards: FlashCard[] = [];
    const blocks = text.split(/FLASHCARD\s+\d+/i).filter(b => b.trim().length > 10);

    blocks.forEach((block, index) => {
      const frenteMatch = block.match(/Frente:\s*([\s\S]*?)(?=\nVerso:|$)/i);
      const versoMatch = block.match(/Verso:\s*([\s\S]*?)(?=\nExplica[çc][ãa]o:|$)/i);
      const explicacaoMatch = block.match(/Explica[çc][ãa]o:\s*([\s\S]*?)(?=\nBizu:|$)/i);
      const bizuMatch = block.match(/Bizu:\s*([\s\S]*?)(?=\nFLASHCARD|$)/i);

      if (frenteMatch && versoMatch) {
        cards.push({
          id: `fc-${index}-${Date.now()}`,
          front: frenteMatch[1].trim(),
          back: versoMatch[1].trim(),
          explanation: explicacaoMatch ? explicacaoMatch[1].trim() : "",
          bizu: bizuMatch ? bizuMatch[1].trim() : "",
          disciplineId,
          subjectTitle: Array.isArray(subjectTitle) ? "Misto" : subjectTitle
        });
      }
    });

    return cards;
  } catch (error) {
    console.error("Erro ao gerar flashcards:", error);
    throw error;
  }
}
