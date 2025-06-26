# LLM Output Schema Template for Knowledge Objects (階層構造版)

以下のJSON形式で知識オブジェクトを出力してください。大きなトピックは複数のページ（chapters）に分割し、段階的に学習できる構造にしてください。

```json
{
  "title": "[トピック全体のタイトル（例：機械学習）]",
  "description": "[トピック全体の概要を2-3文で説明]",
  "category": "[Programming/Science/Mathematics/History/Language/Business/Art/Other から選択]",
  "tags": ["[関連タグ1]", "[関連タグ2]", "[関連タグ3]"],
  "totalEstimatedHours": "[全体の学習予想時間を時間単位で数値のみ]",
  "difficulty": "[beginner/intermediate/advanced/expert から選択]",
  "prerequisites": ["[前提知識のタイトル1]", "[前提知識のタイトル2]"],
  
  "overview": {
    "summary": "[トピック全体の要約を200-300語で記述]",
    "learningPath": "[推奨される学習の進め方を説明]",
    "totalChapters": "[チャプター総数を数値で]",
    "learningObjectives": [
      "[全体を通じた学習目標1]",
      "[全体を通じた学習目標2]",
      "[全体を通じた学習目標3]",
      "[全体を通じた学習目標4]"
    ]
  },
  
  "chapters": [
    {
      "chapterId": "[chapter_001]",
      "chapterNumber": 1,
      "title": "[第1章のタイトル（例：機械学習の基礎概念）]",
      "description": "[この章で学ぶ内容の概要]",
      "difficulty": "[beginner/intermediate/advanced/expert から選択]",
      "estimatedMinutes": "[この章の学習予想時間を分単位で数値のみ]",
      "prerequisites": ["[この章に必要な前提知識]"],
      
      "content": {
        "introduction": "[この章の導入文を100語程度で]",
        
        "sections": [
          {
            "sectionId": "[section_001]",
            "type": "concept",
            "title": "[セクションタイトル（例：機械学習とは何か）]",
            "content": "[マークダウン形式で内容を記述]",
            "estimatedMinutes": "[学習予想時間を分単位で数値のみ]",
            "media": [
              {
                "type": "[image/diagram/chart/code_snippet から選択]",
                "data": "[コードやBase64エンコードされたデータ]",
                "caption": "[メディアの説明]"
              }
            ]
          },
          {
            "sectionId": "[section_002]",
            "type": "explanation",
            "title": "[セクションタイトル]",
            "content": "[マークダウン形式で詳細な説明を記述]",
            "estimatedMinutes": "[学習予想時間を分単位で数値のみ]"
          },
          {
            "sectionId": "[section_003]",
            "type": "example",
            "title": "[セクションタイトル]",
            "content": "[マークダウン形式で具体例を記述]",
            "estimatedMinutes": "[学習予想時間を分単位で数値のみ]",
            "codeExamples": [
              {
                "language": "[python/javascript/java など]",
                "code": "[実行可能なコード例]",
                "explanation": "[コードの説明]"
              }
            ]
          },
          {
            "sectionId": "[section_004]",
            "type": "practice",
            "title": "[練習問題のタイトル]",
            "content": "[マークダウン形式で練習問題を記述]",
            "estimatedMinutes": "[学習予想時間を分単位で数値のみ]"
          }
        ],
        
        "keyConcepts": [
          {
            "term": "[この章の重要用語1]",
            "definition": "[用語の定義を簡潔に説明]",
            "importance": "[high/medium/low から選択]"
          },
          {
            "term": "[この章の重要用語2]",
            "definition": "[用語の定義を簡潔に説明]",
            "importance": "[high/medium/low から選択]"
          }
        ],
        
        "chapterSummary": "[この章のまとめを100-150語で]",
        
        "checkpoints": [
          "[理解度確認ポイント1]",
          "[理解度確認ポイント2]",
          "[理解度確認ポイント3]"
        ]
      },
      
      "quiz": {
        "questions": [
          {
            "question": "[問題文]",
            "type": "[multiple_choice/true_false/short_answer から選択]",
            "options": ["[選択肢1]", "[選択肢2]", "[選択肢3]", "[選択肢4]"],
            "correctAnswer": "[正解]",
            "explanation": "[解説]"
          }
        ]
      },
      
      "resources": [
        {
          "type": "[article/video/book/course/documentation から選択]",
          "title": "[リソースのタイトル]",
          "url": "[リソースのURL]",
          "description": "[リソースの説明]",
          "isRequired": [true/false]
        }
      ],
      
      "nextChapter": {
        "chapterId": "[chapter_002]",
        "title": "[次章のタイトル]",
        "preview": "[次章で学ぶ内容の予告]"
      }
    },
    {
      "chapterId": "[chapter_002]",
      "chapterNumber": 2,
      "title": "[第2章のタイトル（例：教師あり学習）]",
      "description": "[この章で学ぶ内容の概要]",
      "difficulty": "[beginner/intermediate/advanced/expert から選択]",
      "estimatedMinutes": "[この章の学習予想時間を分単位で数値のみ]",
      "prerequisites": ["[chapter_001]", "[その他の前提知識]"],
      
      "content": {
        "introduction": "[この章の導入文]",
        "sections": [
          {
            "sectionId": "[section_001]",
            "type": "concept",
            "title": "[セクションタイトル]",
            "content": "[内容]",
            "estimatedMinutes": "[時間]"
          }
        ],
        "keyConcepts": [],
        "chapterSummary": "[まとめ]",
        "checkpoints": []
      },
      
      "quiz": {
        "questions": []
      },
      
      "resources": [],
      
      "nextChapter": {
        "chapterId": "[chapter_003]",
        "title": "[次章のタイトル]",
        "preview": "[次章の予告]"
      }
    }
  ],
  
  "learningPath": {
    "recommended": ["chapter_001", "chapter_002", "chapter_003"],
    "alternative": {
      "fastTrack": ["chapter_001", "chapter_003"],
      "thorough": ["chapter_001", "chapter_002", "chapter_supplementary", "chapter_003"]
    }
  },
  
  "glossary": [
    {
      "term": "[用語集の用語1]",
      "definition": "[定義]",
      "firstMentionedIn": "[chapter_001]"
    },
    {
      "term": "[用語集の用語2]",
      "definition": "[定義]",
      "firstMentionedIn": "[chapter_002]"
    }
  ],
  
  "relatedTopics": ["[関連トピック1]", "[関連トピック2]", "[関連トピック3]"]
}
```

## 出力時の注意事項

### チャプター分割の基準
1. **各チャプターは独立した学習単位**として30-60分で学習可能な量に
2. **論理的な順序**で、基礎から応用へ段階的に構成
3. **1つのチャプター**には4-8個のセクションを含める

### セクションタイプ
- **concept**: 新しい概念の導入
- **explanation**: 詳細な説明
- **example**: 具体例やケーススタディ
- **practice**: 実践演習
- **deep_dive**: 発展的内容
- **review**: 復習・まとめ

### 大規模トピックの分割例

#### 「機械学習」の場合
1. Chapter 1: 機械学習の基礎概念（入門）
2. Chapter 2: データの前処理と特徴量エンジニアリング
3. Chapter 3: 教師あり学習：分類
4. Chapter 4: 教師あり学習：回帰
5. Chapter 5: 教師なし学習
6. Chapter 6: モデルの評価と改善
7. Chapter 7: ニューラルネットワーク入門
8. Chapter 8: 実践プロジェクト

### コンテンツ作成ガイドライン
1. **各チャプターは前のチャプターの知識を前提**とする
2. **セクション間の流れ**を意識し、スムーズな学習体験を提供
3. **実践的な例**を各チャプターに必ず含める
4. **理解度確認**のためのチェックポイントを設定
5. **次のチャプターへの橋渡し**を明確に示す