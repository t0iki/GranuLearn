import { useState } from "react";
import type { Quiz } from "../types/course.types";

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number, maxScore: number) => void;
}

export function QuizView({ quiz, onComplete }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateScore();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach((question) => {
      const points = question.points || 1;
      maxScore += points;
      if (selectedAnswers[question.id] === question.correctAnswer) {
        totalScore += points;
      }
    });

    setScore(totalScore);
    setShowResults(true);
  };

  const handleComplete = () => {
    onComplete(
      score,
      quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    );
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">クイズ結果</h2>

        <div className="mb-8">
          <div className="text-4xl font-bold text-center mb-4">
            {score} / {quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)}
          </div>
          <div className="text-center text-gray-600">正答率: {Math.round((score / quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)) * 100)}%</div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = selectedAnswers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="mb-2">
                  <span className="font-medium">問題 {index + 1}:</span> {question.question}
                </div>
                <div className={`mb-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  あなたの回答: {userAnswer} {isCorrect ? "✓" : "✗"}
                </div>
                {!isCorrect && <div className="text-gray-600">正解: {question.correctAnswer}</div>}
                <div className="mt-2 text-sm text-gray-600">解説: {question.explanation}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={handleComplete} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            チャプターを完了
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">理解度チェック</h2>
          <span className="text-sm text-gray-500">
            問題 {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>

        {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "true_false" && (
          <div className="space-y-3">
            {["正しい", "誤り"].map((option) => (
              <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(option)}
                  className="mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === "short_answer" && (
          <input
            type="text"
            value={selectedAnswers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswerSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="回答を入力してください"
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          className={`px-6 py-3 rounded-lg font-medium ${
            selectedAnswers[currentQuestion.id] ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLastQuestion ? "結果を見る" : "次の問題"}
        </button>
      </div>
    </div>
  );
}
