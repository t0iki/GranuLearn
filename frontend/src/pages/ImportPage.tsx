import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';

export function ImportPage() {
  const navigate = useNavigate();
  const { importCourse, loading, error } = useCourseStore();
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    try {
      const courseData = JSON.parse(jsonInput);
      
      // Basic validation
      if (!courseData.title || !courseData.chapters || !Array.isArray(courseData.chapters)) {
        setValidationError('必須フィールドが不足しています: title, chapters');
        return;
      }

      // Calculate total chapters and estimated hours if not provided
      if (!courseData.totalChapters) {
        courseData.totalChapters = courseData.chapters.length;
      }

      if (!courseData.totalEstimatedHours) {
        const totalMinutes = courseData.chapters.reduce((sum: number, chapter: any) => {
          return sum + (chapter.estimatedMinutes || 0);
        }, 0);
        courseData.totalEstimatedHours = Math.round(totalMinutes / 60 * 10) / 10;
      }

      // Ensure required fields have defaults
      courseData.category = courseData.category || 'General';
      courseData.tags = courseData.tags || [];
      courseData.difficulty = courseData.difficulty || 'Intermediate';
      courseData.prerequisites = courseData.prerequisites || [];
      courseData.learningObjectives = courseData.learningObjectives || [];
      courseData.overviewSummary = courseData.overviewSummary || courseData.description || '';
      courseData.learningPath = courseData.learningPath || '';
      courseData.learningPaths = courseData.learningPaths || { recommended: [], alternative: { fastTrack: [], thorough: [] } };
      courseData.metadata = courseData.metadata || { version: '1.0', createdAt: new Date().toISOString(), language: 'ja' };

      await importCourse(courseData);
      navigate('/');
    } catch (error) {
      if (error instanceof SyntaxError) {
        setValidationError('JSONの形式が正しくありません');
      } else {
        setValidationError('インポートに失敗しました');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      setValidationError('');
    };
    reader.readAsText(file);
  };

  const loadSampleCourse = () => {
    const sampleCourse = {
      title: "React入門コース",
      description: "Reactの基礎から実践的なアプリケーション開発まで学べるコース",
      category: "Programming",
      tags: ["React", "JavaScript", "Frontend"],
      difficulty: "Beginner",
      chapters: [
        {
          chapterNumber: 1,
          title: "Reactとは",
          description: "Reactの基本概念と特徴を学習します",
          estimatedMinutes: 30,
          sections: [
            {
              title: "Reactの概要",
              content: "Reactは、Facebookが開発したUIライブラリです。コンポーネントベースの開発が特徴で、再利用可能なUI部品を組み合わせてアプリケーションを構築します。",
              type: "lecture"
            },
            {
              title: "仮想DOMとは",
              content: "仮想DOMは、実際のDOMの軽量なJavaScript表現です。Reactは仮想DOMを使用して効率的にUIを更新します。",
              type: "lecture"
            }
          ]
        },
        {
          chapterNumber: 2,
          title: "コンポーネント",
          description: "Reactコンポーネントの作成方法と使い方",
          estimatedMinutes: 45,
          sections: [
            {
              title: "関数コンポーネント",
              content: "関数コンポーネントは、propsを受け取ってReact要素を返すJavaScript関数です。",
              type: "lecture"
            },
            {
              title: "Propsとは",
              content: "Propsは、親コンポーネントから子コンポーネントにデータを渡すための仕組みです。",
              type: "lecture"
            }
          ]
        }
      ]
    };
    setJsonInput(JSON.stringify(sampleCourse, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">知識オブジェクトのインポート</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">JSONファイルから読み込む</h2>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">JSONを直接入力</h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 text-sm font-medium">
                Deep Research結果のJSON
              </label>
              <button
                type="button"
                onClick={loadSampleCourse}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                サンプルコースを読み込む
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-96 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={`{
  "title": "コースタイトル",
  "description": "コースの説明",
  "category": "Programming",
  "tags": ["tag1", "tag2"],
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "チャプター1",
      "description": "チャプターの説明",
      "sections": [
        {
          "title": "セクション1",
          "content": "セクションの内容",
          "type": "lecture"
        }
      ]
    }
  ]
}`}
            />
          </div>

          {validationError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {validationError}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !jsonInput}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'インポート中...' : 'インポート'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">JSONスキーマについて</h3>
        <p className="text-gray-600 mb-4">
          LLMに以下のプロンプトを使用して、適切な形式のJSONを生成してもらってください：
        </p>
        <div className="bg-white p-4 rounded border border-gray-200">
          <code className="text-sm">
            docs/llm-output-schema-template-v2.md のスキーマに従って、[トピック名]についての知識オブジェクトをJSON形式で出力してください。
          </code>
        </div>
      </div>
    </div>
  );
}