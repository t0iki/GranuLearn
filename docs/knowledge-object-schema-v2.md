# Knowledge Object Schema V2 - 階層構造対応版

## Overview
大規模なトピックを段階的に学習できるよう、Knowledge Objectsを階層構造（Course > Chapters > Sections）で管理します。

## Schema Definition

### Course (最上位の学習単位)
```typescript
interface Course {
  id: string;                      // Unique identifier
  title: string;                   // コース全体のタイトル
  description: string;             // コース概要
  category: string;                // メインカテゴリ
  tags: string[];                  // 検索用タグ
  totalEstimatedHours: number;     // 全体の予想学習時間（時間）
  difficulty: DifficultyLevel;     // 全体の難易度
  prerequisites: string[];         // 前提知識（他のCourse IDまたは説明）
  
  overview: CourseOverview;        // コース全体の概要
  chapters: Chapter[];             // チャプターの配列
  learningPath: LearningPath;      // 学習パス
  glossary: GlossaryTerm[];        // 用語集
  
  metadata: CourseMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface CourseOverview {
  summary: string;                 // 200-300語の要約
  learningPath: string;            // 推奨学習方法
  totalChapters: number;           // チャプター総数
  learningObjectives: string[];    // 学習目標
}

interface Chapter {
  chapterId: string;               // チャプターID
  chapterNumber: number;           // チャプター番号
  title: string;                   // チャプタータイトル
  description: string;             // チャプター概要
  difficulty: DifficultyLevel;     // このチャプターの難易度
  estimatedMinutes: number;        // 予想学習時間（分）
  prerequisites: string[];         // 前提となるチャプターID
  
  content: ChapterContent;         // チャプターコンテンツ
  quiz: Quiz;                      // 理解度確認クイズ
  resources: Resource[];           // 参考リソース
  
  nextChapter?: NextChapter;       // 次のチャプター情報
  status?: ChapterStatus;          // 学習状況
}

interface ChapterContent {
  introduction: string;            // 導入文
  sections: Section[];             // セクションの配列
  keyConcepts: KeyConcept[];       // 重要概念
  chapterSummary: string;          // チャプターまとめ
  checkpoints: string[];           // 理解度確認ポイント
}

interface Section {
  sectionId: string;               // セクションID
  type: SectionType;               // セクションタイプ
  title: string;                   // セクションタイトル
  content: string;                 // Markdown形式のコンテンツ
  estimatedMinutes: number;        // 予想学習時間（分）
  
  media?: MediaAttachment[];       // メディア添付
  codeExamples?: CodeExample[];    // コード例
  interactiveElements?: InteractiveElement[]; // インタラクティブ要素
}

enum SectionType {
  CONCEPT = "concept",             // 概念説明
  EXPLANATION = "explanation",     // 詳細説明
  EXAMPLE = "example",             // 具体例
  PRACTICE = "practice",           // 実践演習
  DEEP_DIVE = "deep_dive",        // 発展内容
  REVIEW = "review"               // 復習・まとめ
}

interface CodeExample {
  language: string;                // プログラミング言語
  code: string;                    // コード
  explanation: string;             // 説明
  runnable?: boolean;              // 実行可能かどうか
}

interface Quiz {
  questions: QuizQuestion[];       // クイズ問題
}

interface QuizQuestion {
  id: string;
  question: string;                // 問題文
  type: QuestionType;              // 問題タイプ
  options?: string[];              // 選択肢（選択問題の場合）
  correctAnswer: string | string[]; // 正解
  explanation: string;             // 解説
  points?: number;                 // 配点
}

enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  CODE_COMPLETION = "code_completion"
}

interface LearningPath {
  recommended: string[];           // 推奨チャプター順序
  alternative: {
    fastTrack: string[];          // 速習コース
    thorough: string[];           // じっくりコース
  };
}

interface NextChapter {
  chapterId: string;
  title: string;
  preview: string;                 // 次章の予告
}

interface CourseMetadata {
  version: string;                 // スキーマバージョン
  author?: string;                 // 作成者
  lastReviewDate?: Date;           // 最終レビュー日
  language: string;                // コンテンツ言語
  targetAudience?: string;         // 対象者
}

// 学習進捗管理
interface LearningProgress {
  courseId: string;
  userId: string;
  
  overallProgress: {
    completedChapters: string[];
    currentChapter: string;
    completionPercentage: number;
    totalTimeSpent: number;        // 分単位
    lastAccessedAt: Date;
  };
  
  chapterProgress: {
    [chapterId: string]: {
      completedSections: string[];
      quizScores: QuizScore[];
      timeSpent: number;
      completedAt?: Date;
    };
  };
  
  achievements: Achievement[];
}

interface Achievement {
  type: string;
  title: string;
  earnedAt: Date;
}

interface ChapterStatus {
  isLocked: boolean;               // ロック状態
  isCompleted: boolean;            // 完了状態
  progress: number;                // 進捗率
}
```

## Database Schema (Prisma)

```prisma
model Course {
  id                  String   @id @default(cuid())
  title               String
  description         String
  category            String
  tags                String[]
  totalEstimatedHours Float
  difficulty          String
  prerequisites       String[]
  
  overviewSummary     String   @db.Text
  learningPath        String
  totalChapters       Int
  learningObjectives  String[]
  
  chapters            Chapter[]
  glossaryTerms       GlossaryTerm[]
  learningPaths       Json
  
  metadata            Json
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  progresses          LearningProgress[]
}

model Chapter {
  id                String   @id @default(cuid())
  chapterId         String   @unique
  chapterNumber     Int
  title             String
  description       String
  difficulty        String
  estimatedMinutes  Int
  prerequisites     String[]
  
  courseId          String
  course            Course   @relation(fields: [courseId], references: [id])
  
  introduction      String   @db.Text
  chapterSummary    String   @db.Text
  checkpoints       String[]
  
  sections          Section[]
  keyConcepts       KeyConcept[]
  quiz              Quiz?
  resources         Resource[]
  
  nextChapterId     String?
  nextChapterTitle  String?
  nextChapterPreview String?
}

model Section {
  id               String   @id @default(cuid())
  sectionId        String   @unique
  type             String
  title            String
  content          String   @db.Text
  estimatedMinutes Int
  order            Int
  
  chapterId        String
  chapter          Chapter  @relation(fields: [chapterId], references: [id])
  
  mediaAttachments MediaAttachment[]
  codeExamples     CodeExample[]
}

model LearningProgress {
  id                   String   @id @default(cuid())
  courseId             String
  course               Course   @relation(fields: [courseId], references: [id])
  
  completedChapters    String[]
  currentChapter       String
  completionPercentage Float
  totalTimeSpent       Int
  lastAccessedAt       DateTime
  
  chapterProgress      Json
  achievements         Json[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@unique([courseId])
}
```

## 使用例

機械学習のような大規模トピックの場合：
- **Course**: 「機械学習完全マスター」
- **Chapter 1**: 「機械学習の基礎概念」（30-45分）
- **Chapter 2**: 「データの前処理」（45-60分）
- **Chapter 3**: 「教師あり学習：分類」（60-90分）
- など...

各チャプターは独立して学習可能で、必要に応じて前のチャプターを参照する構造になっています。