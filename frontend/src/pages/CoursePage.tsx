import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseStore } from '../store/courseStore';

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse, progress, loading, error, fetchCourse } = useCourseStore();

  useEffect(() => {
    console.log('CoursePage: courseId =', courseId);
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  console.log('CoursePage render:', { loading, error, currentCourse });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error || !currentCourse) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || 'コースが見つかりません'}
      </div>
    );
  }

  const completedChapters = progress?.completedChapters || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentCourse.title}</h1>
        <p className="text-gray-600 mb-6">{currentCourse.description}</p>
        
        {currentCourse.overviewSummary && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">コース概要</h2>
            <p className="text-gray-700 mb-4">{currentCourse.overviewSummary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">カテゴリ:</span>{' '}
                <span className="text-gray-600">{currentCourse.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">難易度:</span>{' '}
                <span className="text-gray-600">{currentCourse.difficulty}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">推定学習時間:</span>{' '}
                <span className="text-gray-600">{currentCourse.totalEstimatedHours}時間</span>
              </div>
            </div>
            {currentCourse.learningObjectives && currentCourse.learningObjectives.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">学習目標:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentCourse.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">チャプター</h2>
            <div className="space-y-4">
              {currentCourse.chapters?.map((chapter, index) => {
                const chapterId = chapter.chapterId || chapter.id || `chapter_${index + 1}`;
                const isCompleted = completedChapters.includes(chapterId);
                const isLocked = chapter.prerequisites && chapter.prerequisites.length > 0 && 
                  chapter.prerequisites.some(
                    (prereq) => !completedChapters.includes(prereq)
                  );

                return (
                  <Link
                    key={chapter.id || index}
                    to={isLocked ? '#' : `/courses/${courseId}/chapters/${chapterId}`}
                    className={`block p-4 rounded-lg border ${
                      isLocked
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-medium text-gray-900">
                            Chapter {chapter.chapterNumber}
                          </span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {chapter.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-green-600">✓</span>
                          )}
                          {isLocked && (
                            <span className="text-gray-400">🔒</span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{chapter.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{chapter.estimatedMinutes}分</span>
                          <span>{chapter.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}