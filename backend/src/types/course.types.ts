export interface CreateCourseInput {
  title: string;
  description: string;
  category: string;
  tags: string[];
  totalEstimatedHours: number;
  difficulty: string;
  prerequisites: string[];
  overview: {
    summary: string;
    learningPath: string;
    totalChapters: number;
    learningObjectives: string[];
  };
  chapters: ChapterInput[];
  learningPath: {
    recommended: string[];
    alternative: {
      fastTrack: string[];
      thorough: string[];
    };
  };
  glossary: GlossaryTermInput[];
  relatedTopics: string[];
}

export interface ChapterInput {
  chapterId: string;
  chapterNumber: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
  prerequisites: string[];
  content: {
    introduction: string;
    sections: SectionInput[];
    keyConcepts: KeyConceptInput[];
    chapterSummary: string;
    checkpoints: string[];
  };
  quiz?: QuizInput;
  resources: ResourceInput[];
  nextChapter?: {
    chapterId: string;
    title: string;
    preview: string;
  };
}

export interface SectionInput {
  sectionId: string;
  type: string;
  title: string;
  content: string;
  estimatedMinutes: number;
  media?: MediaAttachmentInput[];
  codeExamples?: CodeExampleInput[];
}

export interface KeyConceptInput {
  term: string;
  definition: string;
  importance: string;
}

export interface QuizInput {
  questions: QuizQuestionInput[];
}

export interface QuizQuestionInput {
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points?: number;
}

export interface ResourceInput {
  type: string;
  title: string;
  url: string;
  description: string;
  isRequired: boolean;
}

export interface MediaAttachmentInput {
  type: string;
  url?: string;
  data?: string;
  caption: string;
}

export interface CodeExampleInput {
  language: string;
  code: string;
  explanation: string;
  runnable?: boolean;
}

export interface GlossaryTermInput {
  term: string;
  definition: string;
  firstMentionedIn: string;
}