export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  totalEstimatedHours: number;
  difficulty: string;
  prerequisites: string[];
  overviewSummary: string;
  learningPath: string;
  totalChapters: number;
  learningObjectives: string[];
  chapters?: Chapter[];
  glossaryTerms?: GlossaryTerm[];
  learningPaths: LearningPath;
  metadata: CourseMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  chapterId: string;
  chapterNumber: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedMinutes: number;
  prerequisites: string[];
  introduction: string;
  chapterSummary: string;
  checkpoints: string[];
  sections: Section[];
  keyConcepts: KeyConcept[];
  quiz?: Quiz;
  resources: Resource[];
  nextChapterId?: string;
  nextChapterTitle?: string;
  nextChapterPreview?: string;
}

export interface Section {
  id: string;
  sectionId: string;
  type: string;
  title: string;
  content: string;
  estimatedMinutes: number;
  order: number;
  mediaAttachments: MediaAttachment[];
  codeExamples: CodeExample[];
}

export interface KeyConcept {
  id: string;
  term: string;
  definition: string;
  importance: string;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points?: number;
}

export interface Resource {
  id: string;
  type: string;
  title: string;
  url: string;
  description: string;
  isRequired: boolean;
}

export interface MediaAttachment {
  id: string;
  type: string;
  url?: string;
  data?: string;
  caption: string;
}

export interface CodeExample {
  id: string;
  language: string;
  code: string;
  explanation: string;
  runnable: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  firstMentionedIn: string;
}

export interface LearningPath {
  recommended: string[];
  alternative: {
    fastTrack: string[];
    thorough: string[];
  };
}

export interface CourseMetadata {
  version: string;
  createdAt: string;
  language: string;
}

export interface LearningProgress {
  id: string;
  courseId: string;
  completedChapters: string[];
  currentChapter: string;
  completionPercentage: number;
  totalTimeSpent: number;
  lastAccessedAt: string;
  chapterProgress: ChapterProgress;
  achievements: Achievement[];
}

export interface ChapterProgress {
  [chapterId: string]: {
    completedSections: string[];
    quizScores: QuizScore[];
    timeSpent: number;
    completedAt?: string;
  };
}

export interface QuizScore {
  blockId: string;
  score: number;
  maxScore: number;
  attemptedAt: string;
}

export interface Achievement {
  type: string;
  title: string;
  earnedAt: string;
}
