export interface Alternative {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  statement: string;
  textContext?: string;
  alternatives: Alternative[];
  correctAlternativeId: string;
  explanation: string;
  incorrectComments: Record<string, string>;
  level: 'Fácil' | 'Médio' | 'Difícil';
  subject: string;
  disciplineId: string;
}

export interface Subject {
  id: string;
  title: string;
}

export interface Discipline {
  id: string;
  title: string;
  icon: string;
  subjects: Subject[];
}

export const DISCIPLINES: Discipline[] = [
  {
    id: 'portugues',
    title: 'Língua Portuguesa',
    icon: 'BookOpen',
    subjects: [
      { id: '1', title: 'Compreensão e interpretação de textos' },
      { id: '2', title: 'Tipologia textual' },
      { id: '3', title: 'Ortografia oficial' },
      { id: '4', title: 'Acentuação gráfica' },
      { id: '5', title: 'Emprego das classes de palavras' },
      { id: '6', title: 'Emprego do sinal indicativo de crase' },
      { id: '7', title: 'Sintaxe da oração e do período' },
      { id: '8', title: 'Sintaxe de colocação' },
      { id: '9', title: 'Pontuação' },
      { id: '10', title: 'Concordância nominal e verbal' },
      { id: '11', title: 'Regência nominal e verbal' },
      { id: '12', title: 'Semântica' },
      { id: '13', title: 'Redação oficial' },
    ],
  },
  {
    id: 'informatica',
    title: 'Informática',
    icon: 'Monitor',
    subjects: [
      { id: 'i1', title: 'Sistemas Operacionais (Windows)' },
      { id: 'i2', title: 'Suítes de Escritório (Office e Google Workspace)' },
      { id: 'i3', title: 'Redes de Computadores e Internet' },
      { id: 'i4', title: 'Navegadores (Chrome, Firefox, Edge)' },
      { id: 'i5', title: 'Correio Eletrônico (Outlook, Thunderbird)' },
      { id: 'i6', title: 'Busca, Redes Sociais e Nuvem' },
      { id: 'i7', title: 'Organização e Gerenciamento de Arquivos' },
      { id: 'i8', title: 'Segurança da Informação (Vírus, Firewall, Backup)' },
      { id: 'i9', title: 'Armazenamento em Nuvem' },
    ],
  },
  {
    id: 'geografia_historia_regional',
    title: 'Geografia e História Regional',
    icon: 'MapPin',
    subjects: [
      { id: 'gh1', title: 'Localização e limites regionais' },
      { id: 'gh2', title: 'Hidrografia regional' },
      { id: 'gh3', title: 'População e demografia' },
      { id: 'gh4', title: 'Aspectos políticos, administrativos, econômicos e culturais' },
      { id: 'gh5', title: 'Pontos turísticos e patrimônio' },
      { id: 'gh6', title: 'Patrimônio cultural e histórico' },
      { id: 'gh7', title: 'Clima e vegetação regional' },
      { id: 'gh8', title: 'Ocupação geográfica e urbana' },
      { id: 'gh9', title: 'História regional' },
    ],
  },
  {
    id: 'etica_direitos_humanos',
    title: 'Ética e Direitos Humanos',
    icon: 'Scale',
    subjects: [
      { id: 'ed1', title: 'Teoria Geral dos Direitos Humanos: Conceitos, Terminologia, Estrutura normativa, Fundamentação' },
      { id: 'ed2', title: 'Afirmação histórica dos direitos humanos' },
      { id: 'ed3', title: 'Direitos humanos e responsabilidade do Estado' },
      { id: 'ed4', title: 'Tratados Internacionais de Proteção aos Direitos Humanos' },
      { id: 'ed5', title: 'Declaração Universal dos Direitos Humanos (1948)' },
      { id: 'ed6', title: 'Convenção Americana sobre Direitos Humanos: Decreto nº 678/1992, Pacto de São José da Costa Rica (1969)' },
      { id: 'ed7', title: 'Declaração de Pequim (Direitos das Mulheres)' },
      { id: 'ed8', title: 'Convenção para a Prevenção e Repressão do Crime de Genocídio' },
      { id: 'ed9', title: 'Estatuto da Igualdade Racial: Lei Federal nº 12.288/2010' },
      { id: 'ed10', title: 'Crimes de Preconceito: Lei Federal nº 7.716/1989' },
      { id: 'ed11', title: 'Estatuto do Idoso: Lei nº 10.741/2003' },
      { id: 'ed12', title: 'Código de Conduta Ética do Agente Público: Normas Municipais' },
    ],
  },
  {
    id: 'direito_constitucional',
    title: 'Direito Constitucional',
    icon: 'Gavel',
    subjects: [
      { id: 'dc1', title: 'Princípios Fundamentais (artigos 1º ao 4º da CF/88)' },
      { id: 'dc2', title: 'Dos direitos e deveres fundamentais: individuais e coletivos, sociais, nacionalidade, cidadania, políticos, partidos (Art. 5, 12, 14)' },
      { id: 'dc3', title: 'Da organização Político-Administrativa (arts. 18 e 19 da CF/88)' },
      { id: 'dc4', title: 'Da União (arts. 20 a 24 da CF/88)' },
      { id: 'dc5', title: 'Dos Estados Federados (arts. 25 a 28 da CF/88)' },
      { id: 'dc6', title: 'Dos Municípios (arts. 29 a 31 da CF/88) - Principalmente Art. 30' },
      { id: 'dc7', title: 'Normas Constitucionais relativas à Administração Pública e ao Servidor Público (arts. 37 a 41 da CF/88)' },
      { id: 'dc8', title: 'Organização dos Poderes (arts. 44 a 135 da CF/88)' },
      { id: 'dc9', title: 'Defesa do Estado e das instituições democráticas (art. 136 a 144) - Estado de Sítio, Defesa e Art. 144' },
      { id: 'dc10', title: 'Ordem social: base e objetivos; seguridade; educação, cultura e desporto; ciência e tecnologia; comunicação; meio ambiente; família, criança, adolescente e idoso' },
    ],
  },
  {
    id: 'direito_penal',
    title: 'Direito Penal',
    icon: 'ShieldAlert',
    subjects: [
      { id: 'dp1', title: 'Princípios Básicos do Direito Penal' },
      { id: 'dp2', title: 'Aplicação da Lei Penal: Tempo e Espaço' },
      { id: 'dp3', title: 'Teoria Geral do Crime: Conceito, Objeto, Sujeitos, Conduta, Tipicidade, Culpabilidade, Bem jurídico' },
      { id: 'dp4', title: 'Tempo e Lugar do Crime: Concurso de crimes, Crime continuado, Teoria do tipo' },
      { id: 'dp5', title: 'Espécies de Crime: Doloso, Culposo, Qualificado pelo resultado, Preterdoloso' },
      { id: 'dp6', title: 'Erro de Tipo e Classificação dos Crimes' },
      { id: 'dp7', title: 'Crimes Comissivos e Omissivos' },
      { id: 'dp8', title: 'Crimes de Dano e de Perigo: Consumado, Tentativa' },
      { id: 'dp9', title: 'Desistência e Arrependimento: Voluntária, Eficaz, Posterior' },
      { id: 'dp10', title: 'Crime Impossível e Ilicitude' },
      { id: 'dp11', title: 'Causas de Exclusão da Ilicitude: Estado de necessidade, Legítima defesa, Estrito cumprimento do dever legal, Exercício regular de direito' },
      { id: 'dp12', title: 'Culpabilidade: Teoria geral, Erro de proibição, Concurso de agentes' },
    ],
  },
  {
    id: 'direito_penal_2',
    title: 'Direito Penal 2',
    icon: 'ShieldAlert',
    subjects: [
      { id: 'dp2_1', title: 'Crimes contra a Vida' },
      { id: 'dp2_2', title: 'Homicídio doloso simples, privilegiado e qualificado' },
      { id: 'dp2_3', title: 'Homicídio culposo' },
      { id: 'dp2_4', title: 'Induzimento, instigação ou auxílio a suicídio ou a automutilação' },
      { id: 'dp2_5', title: 'Infanticídio' },
      { id: 'dp2_6', title: 'Aborto e suas modalidades' },
      { id: 'dp2_7', title: 'Crimes contra a Honra' },
      { id: 'dp2_8', title: 'Calúnia, difamação e injúria' },
      { id: 'dp2_9', title: 'Distinções e elementos de cada tipo' },
      { id: 'dp2_10', title: 'Causas de exclusão da ilicitude nos crimes contra a honra' },
      { id: 'dp2_11', title: 'Ação penal nos crimes contra a honra' },
      { id: 'dp2_12', title: 'Crimes contra o Patrimônio' },
      { id: 'dp2_13', title: 'Furto simples e qualificado' },
      { id: 'dp2_14', title: 'Roubo e extorsão' },
      { id: 'dp2_15', title: 'Estelionato' },
      { id: 'dp2_16', title: 'Receptação' },
      { id: 'dp2_17', title: 'Dano' },
      { id: 'dp2_18', title: 'Apropriação indébita' },
      { id: 'dp2_19', title: 'Demais tipos patrimoniais e suas qualificadoras' },
      { id: 'dp2_20', title: 'Crimes contra a Dignidade Sexual' },
      { id: 'dp2_21', title: 'Estupro e estupro de vulnerável' },
      { id: 'dp2_22', title: 'Assédio sexual' },
      { id: 'dp2_23', title: 'Importunação sexual' },
      { id: 'dp2_24', title: 'Exploração sexual' },
      { id: 'dp2_25', title: 'Disposições comuns e ação penal nos crimes sexuais' },
      { id: 'dp2_26', title: 'Crimes contra a Fé Pública' },
      { id: 'dp2_27', title: 'Moeda falsa' },
      { id: 'dp2_28', title: 'Falsidade documental: falsificação de documento público; falsificação de documento particular' },
      { id: 'dp2_29', title: 'Falsidade ideológica' },
      { id: 'dp2_30', title: 'Uso de documento falso' },
      { id: 'dp2_31', title: 'Demais crimes assimilados' },
      { id: 'dp2_32', title: 'Crimes contra a Administração Pública' },
      { id: 'dp2_33', title: 'Crimes praticados por funcionário público contra a administração em geral: peculato, concussão, corrupção passiva, prevaricação, condescendência criminosa' },
      { id: 'dp2_34', title: 'Crimes praticados por particular contra a administração em geral: corrupção ativa, resistência, desobediência, desacato' },
      { id: 'dp2_35', title: 'Crimes contra a administração da justiça' },
      { id: 'dp2_36', title: 'Crimes contra as finanças públicas' },
    ],
  },
  {
    id: 'direito_processual_penal',
    title: 'Direito Processual Penal',
    icon: 'Fingerprint',
    subjects: [
      { id: 'dpp1', title: 'Prisão: Conceito, Finalidades, Espécies, Mandado de prisão' },
      { id: 'dpp2', title: 'Prisão em Flagrante' },
      { id: 'dpp3', title: 'Prova: Conceito, Objeto, Classificação' },
      { id: 'dpp4', title: 'Preservação de Local de Crime: Procedimentos, Importância para investigação' },
      { id: 'dpp5', title: 'Requisitos e Ônus da Prova' },
      { id: 'dpp6', title: 'Provas Ilícitas' },
      { id: 'dpp7', title: 'Meios de Prova: Pericial, Interrogatório, Confissão, Ofendido, Testemunhas, Reconhecimento, Acareação, Documentos, Indícios' },
      { id: 'dpp8', title: 'Inquérito Policial' },
      { id: 'dpp9', title: 'Termo Circunstanciado de Ocorrência (TCO)' },
    ],
  },
  {
    id: 'legislacao_transito',
    title: 'Legislação de Trânsito',
    icon: 'TrafficCone',
    subjects: [
      { id: 'lt1', title: 'Código de Trânsito Brasileiro (CTB): Lei nº 9.503/1997' },
      { id: 'lt2', title: 'Fiscalização de Trânsito: Resolução CONTRAN nº 985/2022 e Manual Brasileiro de Fiscalização de Trânsito' },
    ],
  },
  {
    id: 'legislacao_especifica',
    title: 'Legislação Específica',
    icon: 'Library',
    subjects: [
      { id: 'le1', title: 'Lei nº 13.022/2014 (Estatuto Geral das Guardas)' },
      { id: 'le2', title: 'Lei Complementar nº 16/2021 - Estatuto da Guarda Municipal de Manaus' },
      { id: 'le3', title: 'Lei nº 13.675/2018 (Sistema Único de Segurança Pública - SUSP)' },
      { id: 'le4', title: 'Estatuto do desarmamento (Lei nº 10.826/2003)' },
      { id: 'le5', title: 'Improbidade administrativa - Lei nº 8.429/1992' },
      { id: 'le6', title: 'Lei nº 12.527/2011, Lei de Acesso à Informação' },
      { id: 'le7', title: 'Lei nº 13.709/2018: Lei Geral de Proteção de Dados (LGPD)' },
      { id: 'le8', title: 'Lei Federal nº 13.869/2019 (Abuso de autoridade)' },
      { id: 'le9', title: 'Crimes previstos no Estatuto da Criança e do Adolescente (Lei nº 8.069/1990)' },
      { id: 'le10', title: 'Crimes hediondos (Lei nº 8.072/1990)' },
      { id: 'le11', title: 'Lei de tortura (Lei nº 9.455/1997)' },
      { id: 'le12', title: 'Lei de drogas (Lei nº 11.343/2006)' },
      { id: 'le13', title: 'Lei Maria da Penha (Lei nº 11.340/2006)' },
      { id: 'le14', title: 'Lei de Crimes Ambientais (Lei 9.605/1998)' },
      { id: 'le15', title: 'Legislação municipal: Lei Orgânica do Município de Manaus' },
      { id: 'le16', title: 'Lei nº 1.118/1971 - Estatuto dos servidores públicos do Município de Manaus' },
      { id: 'le17', title: 'Processo Administrativo na Administração Municipal (Lei Municipal nº 1997/2015)' },
      { id: 'le18', title: 'Decreto Municipal nº 4.157/2018 - Acesso às informações no Município de Manaus' },
    ],
  },
];

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  explanation: string;
  bizu: string;
  disciplineId: string;
  subjectTitle: string;
}

export type FlashCardMode = 'Conceito e definição' | 'Pergunta e resposta' | 'Decoreba rápida' | 'Pegadinhas de prova' | 'Revisão final' | 'Modo Misto';

export interface MockExamConfig {
  disciplineId: string;
  count: number;
  weight: number;
}

export const MOCK_EXAM_STRUCTURE: MockExamConfig[] = [
  { disciplineId: 'portugues', count: 10, weight: 1.5 },
  { disciplineId: 'informatica', count: 5, weight: 1.5 },
  { disciplineId: 'geografia_historia_regional', count: 5, weight: 1.5 },
  { disciplineId: 'etica_direitos_humanos', count: 5, weight: 1.5 },
  { disciplineId: 'direito_constitucional', count: 5, weight: 2.0 },
  { disciplineId: 'direito_penal', count: 5, weight: 1.5 },
  { disciplineId: 'direito_processual_penal', count: 5, weight: 1.5 },
  { disciplineId: 'legislacao_transito', count: 5, weight: 1.5 },
  { disciplineId: 'legislacao_especifica', count: 15, weight: 2.0 },
];
