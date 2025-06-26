import { create } from 'zustand';
import type { Course, Chapter, LearningProgress } from '../types/course.types';

interface CourseStore {
  courses: Course[];
  currentCourse: Course | null;
  currentChapter: Chapter | null;
  progress: LearningProgress | null;
  loading: boolean;
  error: string | null;

  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  fetchChapter: (courseId: string, chapterId: string) => Promise<void>;
  importCourse: (courseData: any) => Promise<void>;
  updateProgress: (progressData: Partial<LearningProgress>) => Promise<void>;
  clearError: () => void;
}

// Load courses from localStorage
const loadCoursesFromStorage = (): Course[] => {
  try {
    const stored = localStorage.getItem('granulearn_courses');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save courses to localStorage
const saveCoursesToStorage = (courses: Course[]) => {
  localStorage.setItem('granulearn_courses', JSON.stringify(courses));
};

// Load progress from localStorage
const loadProgressFromStorage = (courseId: string): LearningProgress | null => {
  try {
    const stored = localStorage.getItem(`granulearn_progress_${courseId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Save progress to localStorage
const saveProgressToStorage = (courseId: string, progress: LearningProgress) => {
  localStorage.setItem(`granulearn_progress_${courseId}`, JSON.stringify(progress));
};

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: loadCoursesFromStorage(),
  currentCourse: null,
  currentChapter: null,
  progress: null,
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      // Load from localStorage
      const courses = loadCoursesFromStorage();
      set({ courses, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchCourse: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const courses = get().courses;
      const course = courses.find(c => c.id === id);
      if (!course) throw new Error('Course not found');
      
      // Load or create progress
      let progress = loadProgressFromStorage(id);
      if (!progress) {
        progress = {
          id: `progress_${id}`,
          courseId: id,
          completedChapters: [],
          currentChapter: '',
          completionPercentage: 0,
          totalTimeSpent: 0,
          lastAccessedAt: new Date().toISOString(),
          chapterProgress: {},
          achievements: []
        };
        saveProgressToStorage(id, progress);
      }
      
      set({ currentCourse: course, progress, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchChapter: async (courseId: string, chapterId: string) => {
    set({ loading: true, error: null });
    try {
      const course = get().courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');
      const chapter = course.chapters?.find(ch => 
        ch.id === chapterId || 
        ch.chapterId === chapterId || 
        `chapter_${ch.chapterNumber}` === chapterId
      );
      if (!chapter) throw new Error('Chapter not found');
      set({ currentChapter: chapter, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  importCourse: async (courseData: any) => {
    set({ loading: true, error: null });
    try {
      // Generate a unique ID for the course
      const course: Course = {
        ...courseData,
        id: courseData.id || `course_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const courses = [...get().courses, course];
      saveCoursesToStorage(courses);
      set({ courses, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateProgress: async (progressData: Partial<LearningProgress>) => {
    const currentProgress = get().progress;
    if (!currentProgress) return;

    try {
      const updatedProgress = { 
        ...currentProgress, 
        ...progressData,
        lastAccessedAt: new Date().toISOString()
      };
      saveProgressToStorage(currentProgress.courseId, updatedProgress);
      set({ progress: updatedProgress });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  clearError: () => set({ error: null }),
}));