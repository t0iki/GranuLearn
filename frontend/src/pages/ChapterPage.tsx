import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';
import { SectionView } from '../components/SectionView';
import { QuizView } from '../components/QuizView';

export function ChapterPage() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { currentChapter, progress, loading, error, fetchChapter, updateProgress } = useCourseStore();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  useEffect(() => {
    if (courseId && chapterId) {
      fetchChapter(courseId, chapterId);
    }
  }, [courseId, chapterId, fetchChapter]);

  useEffect(() => {
    if (progress && chapterId) {
      const chapterProgress = progress.chapterProgress[chapterId];
      if (chapterProgress) {
        setCompletedSections(chapterProgress.completedSections);
      }
    }
  }, [progress, chapterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !currentChapter) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'チャプターが見つかりません'}
      </div>
    );
  }

  const currentSection = currentChapter.sections && currentChapter.sections[currentSectionIndex];
  const isLastSection = currentChapter.sections && currentSectionIndex === currentChapter.sections.length - 1;

  const handleSectionComplete = async () => {
    if (!currentSection || !courseId) return;

    const newCompletedSections = [...completedSections, currentSection.sectionId];
    setCompletedSections(newCompletedSections);

    // Update progress
    await updateProgress({
      chapterProgress: {
        ...progress?.chapterProgress,
        [chapterId!]: {
          completedSections: newCompletedSections,
          quizScores: [],
          timeSpent: 0,
        },
      },
    });

    if (isLastSection && currentChapter.quiz) {
      setShowQuiz(true);
    } else if (isLastSection) {
      handleChapterComplete();
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleChapterComplete = async () => {
    if (!courseId || !progress) return;

    const newCompletedChapters = [...progress.completedChapters, chapterId!];
    await updateProgress({
      completedChapters: newCompletedChapters,
      completionPercentage: 0, // TODO: Calculate based on total chapters
    });

    if (currentChapter.nextChapterId) {
      navigate(`/courses/${courseId}/chapters/${currentChapter.nextChapterId}`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  const handleQuizComplete = (score: number, maxScore: number) => {
    handleChapterComplete();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to={`/courses/${courseId}`}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← コース概要に戻る
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chapter {currentChapter.chapterNumber}: {currentChapter.title}
        </h1>
        <p className="text-gray-600">{currentChapter.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            進捗: {completedSections.length} / {currentChapter.sections?.length || 0} セクション完了
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(completedSections.length / (currentChapter.sections?.length || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {showQuiz && currentChapter.quiz ? (
        <QuizView quiz={currentChapter.quiz} onComplete={handleQuizComplete} />
      ) : currentSection ? (
        <SectionView
          section={currentSection}
          onComplete={handleSectionComplete}
          isCompleted={completedSections.includes(currentSection.sectionId || currentSection.id)}
        />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          このチャプターにはセクションがありません
        </div>
      )}
    </div>
  );
}