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
      { id: 'i1', title: 'Sistemas Operacionais: Noções de Windows' },
      { id: 'i2', title: 'Suítes de Escritório: Edição de textos, Planilhas, Apresentações, Microsoft Office 365' },
      { id: 'i3', title: 'Redes de Computadores: Conceitos básicos, Ferramentas, Aplicativos, Procedimentos de Internet e Intranet' },
      { id: 'i4', title: 'Navegadores: Internet Explorer, Mozilla Firefox, Google Chrome' },
      { id: 'i5', title: 'Correio Eletrônico: Outlook, Mozilla Thunderbird' },
      { id: 'i6', title: 'Busca e Nuvem: Sítios de busca, Grupos de discussão, Redes sociais, Cloud computing' },
      { id: 'i7', title: 'Arquivos: Organização, Gerenciamento, Pastas e programas' },
      { id: 'i8', title: 'Segurança: Vírus, Antivírus, Firewall, Anti-spyware, Backup' },
      { id: 'i9', title: 'Armazenamento em Nuvem: Cloud storage' },
    ],
  },
  {
    id: 'geografia_historia_manaus',
    title: 'Geografia e História de Manaus',
    icon: 'MapPin',
    subjects: [
      { id: 'gh1', title: 'Localização e limites' },
      { id: 'gh2', title: 'Hidrografia' },
      { id: 'gh3', title: 'População' },
      { id: 'gh4', title: 'Aspectos políticos, administrativos, econômicos e culturais' },
      { id: 'gh5', title: 'Pontos turísticos' },
      { id: 'gh6', title: 'Patrimônio cultural' },
      { id: 'gh7', title: 'Clima e vegetação' },
      { id: 'gh8', title: 'Ocupação geográfica' },
      { id: 'gh9', title: 'História da cidade' },
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
      { id: 'ed12', title: 'Código de Conduta Ética do Agente Público de Manaus: Decreto Municipal nº 6.153/2025' },
    ],
  },
  {
    id: 'direito_constitucional',
    title: 'Direito Constitucional',
    icon: 'Gavel',
    subjects: [
      { id: 'dc1', title: 'Princípios Fundamentais: Artigos 1º ao 4º da Constituição Federal de 1988' },
      { id: 'dc2', title: 'Direitos e Garantias Fundamentais: Individuais e coletivos, Sociais, Nacionalidade, Cidadania, Políticos, Partidos' },
      { id: 'dc3', title: 'Organização Político-Administrativa: Artigos 18 e 19 da Constituição Federal' },
      { id: 'dc4', title: 'Organização da Federação: União (Art. 20-24), Estados (Art. 25-28), Municípios (Art. 29-31)' },
      { id: 'dc5', title: 'Administração Pública e Servidor Público: Artigos 37 a 41 da Constituição Federal' },
      { id: 'dc6', title: 'Organização dos Poderes: Artigos 44 a 135 (Legislativo, Executivo, Judiciário)' },
      { id: 'dc7', title: 'Defesa do Estado e das Instituições Democráticas: Artigos 136 a 144 (Defesa, Sítio, Segurança Pública)' },
      { id: 'dc8', title: 'Ordem Social: Seguridade, Educação, Cultura, Ciência, Comunicação, Meio Ambiente, Família, Criança, Idoso' },
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
      { id: 'le1', title: 'Estatuto Geral das Guardas Municipais: Lei nº 13.022/2014' },
      { id: 'le2', title: 'Estatuto da Guarda Municipal de Manaus: Lei Complementar nº 16/2021' },
      { id: 'le3', title: 'Sistema Único de Segurança Pública (SUSP): Lei nº 13.675/2018' },
      { id: 'le4', title: 'Estatuto do Desarmamento: Lei nº 10.826/2003' },
      { id: 'le5', title: 'Improbidade Administrativa: Lei nº 8.429/1992' },
      { id: 'le6', title: 'Lei de Acesso à Informação: Lei nº 12.527/2011' },
      { id: 'le7', title: 'Lei Geral de Proteção de Dados (LGPD): Lei nº 13.709/2018' },
      { id: 'le8', title: 'Abuso de Autoridade: Lei nº 13.869/2019' },
      { id: 'le9', title: 'Estatuto da Criança e do Adolescente (ECA): Lei nº 8.069/1990' },
      { id: 'le10', title: 'Crimes Hediondos: Lei nº 8.072/1990' },
      { id: 'le11', title: 'Lei de Drogas: Lei nº 11.343/2006' },
      { id: 'le12', title: 'Lei Maria da Penha: Lei nº 11.340/2006' },
      { id: 'le13', title: 'Crimes Ambientais: Lei nº 9.605/1998' },
      { id: 'le14', title: 'Lei Orgânica do Município de Manaus' },
      { id: 'le15', title: 'Estatuto dos Servidores Públicos de Manaus: Lei nº 1.118/1971' },
      { id: 'le16', title: 'Acesso à Informação em Manaus: Decreto Municipal nº 4.157/2018' },
    ],
  },
];

export interface MockExamConfig {
  disciplineId: string;
  count: number;
  weight: number;
}

export const MOCK_EXAM_STRUCTURE: MockExamConfig[] = [
  { disciplineId: 'portugues', count: 10, weight: 1.5 },
  { disciplineId: 'informatica', count: 5, weight: 1.5 },
  { disciplineId: 'geografia_historia_manaus', count: 5, weight: 1.5 },
  { disciplineId: 'etica_direitos_humanos', count: 5, weight: 1.5 },
  { disciplineId: 'direito_constitucional', count: 5, weight: 2.0 },
  { disciplineId: 'direito_penal', count: 5, weight: 1.5 },
  { disciplineId: 'direito_processual_penal', count: 5, weight: 1.5 },
  { disciplineId: 'legislacao_transito', count: 5, weight: 1.5 },
  { disciplineId: 'legislacao_especifica', count: 15, weight: 2.0 },
];
