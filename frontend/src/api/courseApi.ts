const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const courseApi = {
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data;
  },

  async getCourse(id: string) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    const data = await response.json();
    return data.data;
  },

  async getChapter(courseId: string, chapterId: string) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/chapters/${chapterId}`);
    if (!response.ok) throw new Error('Failed to fetch chapter');
    const data = await response.json();
    return data.data;
  },

  async importCourse(courseData: any) {
    const response = await fetch(`${API_BASE_URL}/courses/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to import course');
    const data = await response.json();
    return data.data;
  },

  async updateProgress(courseId: string, progressData: any) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressData),
    });
    if (!response.ok) throw new Error('Failed to update progress');
    const data = await response.json();
    return data.data;
  },

  async getProgress(courseId: string) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/progress`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    const data = await response.json();
    return data.data;
  },
};