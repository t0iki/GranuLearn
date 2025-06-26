import { Request, Response, NextFunction } from 'express';
import { courseService } from '../services/courseService';
import { CreateCourseInput } from '../types/course.types';
import { AppError } from '../middleware/errorHandler';

class CourseController {
  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body as CreateCourseInput;
      const course = await courseService.createCourse(courseData);
      res.status(201).json({
        status: 'success',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.getCourses();
      res.json({
        status: 'success',
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const course = await courseService.getCourseById(id);
      res.json({
        status: 'success',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  async getChapter(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, chapterId } = req.params;
      const chapter = await courseService.getChapterById(courseId, chapterId);
      res.json({
        status: 'success',
        data: chapter,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const progressData = req.body;
      const progress = await courseService.updateProgress(courseId, progressData);
      res.json({
        status: 'success',
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      // TODO: Implement getProgress in service
      res.json({
        status: 'success',
        data: {
          courseId,
          completedChapters: [],
          currentChapter: '',
          completionPercentage: 0,
          totalTimeSpent: 0,
          lastAccessedAt: new Date(),
          chapterProgress: {},
          achievements: [],
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async importCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = req.body;
      
      // Validate the imported data
      if (!courseData.title || !courseData.chapters || !Array.isArray(courseData.chapters)) {
        throw new AppError('Invalid course data format', 400);
      }

      // Transform the imported data to match our schema
      const transformedData: CreateCourseInput = {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        tags: courseData.tags || [],
        totalEstimatedHours: courseData.totalEstimatedHours || 0,
        difficulty: courseData.difficulty,
        prerequisites: courseData.prerequisites || [],
        overview: courseData.overview || {
          summary: courseData.description,
          learningPath: '',
          totalChapters: courseData.chapters.length,
          learningObjectives: courseData.learningObjectives || [],
        },
        chapters: courseData.chapters,
        learningPath: courseData.learningPath || {
          recommended: courseData.chapters.map((c: any) => c.chapterId),
          alternative: {
            fastTrack: [],
            thorough: [],
          },
        },
        glossary: courseData.glossary || [],
        relatedTopics: courseData.relatedTopics || [],
      };

      const course = await courseService.createCourse(transformedData);
      res.status(201).json({
        status: 'success',
        message: 'Course imported successfully',
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();