import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Component, type ReactNode } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { ChapterPage } from './pages/ChapterPage';
import { ImportPage } from './pages/ImportPage';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">エラーが発生しました</h2>
            <p>{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App component rendering');
  
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/courses/:courseId/chapters/:chapterId" element={<ChapterPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;