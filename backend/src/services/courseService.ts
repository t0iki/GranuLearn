import { PrismaClient } from '@prisma/client';
import { CreateCourseInput } from '../types/course.types';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class CourseService {
  async createCourse(data: CreateCourseInput) {
    try {
      const course = await prisma.course.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          tags: JSON.stringify(data.tags),
          totalEstimatedHours: data.totalEstimatedHours,
          difficulty: data.difficulty,
          prerequisites: JSON.stringify(data.prerequisites),
          overviewSummary: data.overview.summary,
          learningPath: data.overview.learningPath,
          totalChapters: data.overview.totalChapters,
          learningObjectives: JSON.stringify(data.overview.learningObjectives),
          learningPaths: JSON.stringify(data.learningPath),
          metadata: JSON.stringify({
            version: '1.0',
            createdAt: new Date().toISOString(),
            language: 'ja',
          }),
          chapters: {
            create: data.chapters.map((chapter, index) => ({
              chapterId: chapter.chapterId,
              chapterNumber: chapter.chapterNumber,
              title: chapter.title,
              description: chapter.description,
              difficulty: chapter.difficulty,
              estimatedMinutes: chapter.estimatedMinutes,
              prerequisites: JSON.stringify(chapter.prerequisites),
              introduction: chapter.content.introduction,
              chapterSummary: chapter.content.chapterSummary,
              checkpoints: JSON.stringify(chapter.content.checkpoints),
              nextChapterId: chapter.nextChapter?.chapterId,
              nextChapterTitle: chapter.nextChapter?.title,
              nextChapterPreview: chapter.nextChapter?.preview,
              sections: {
                create: chapter.content.sections.map((section, sectionIndex) => ({
                  sectionId: section.sectionId,
                  type: section.type,
                  title: section.title,
                  content: section.content,
                  estimatedMinutes: section.estimatedMinutes,
                  order: sectionIndex,
                  mediaAttachments: section.media ? {
                    create: section.media.map(media => ({
                      type: media.type,
                      url: media.url,
                      data: media.data,
                      caption: media.caption,
                    })),
                  } : undefined,
                  codeExamples: section.codeExamples ? {
                    create: section.codeExamples.map(example => ({
                      language: example.language,
                      code: example.code,
                      explanation: example.explanation,
                      runnable: example.runnable || false,
                    })),
                  } : undefined,
                })),
              },
              keyConcepts: {
                create: chapter.content.keyConcepts.map(concept => ({
                  term: concept.term,
                  definition: concept.definition,
                  importance: concept.importance,
                })),
              },
              quiz: chapter.quiz ? {
                create: {
                  questions: {
                    create: chapter.quiz.questions.map(question => ({
                      question: question.question,
                      type: question.type,
                      options: question.options ? JSON.stringify(question.options) : null,
                      correctAnswer: question.correctAnswer,
                      explanation: question.explanation,
                      points: question.points,
                    })),
                  },
                },
              } : undefined,
              resources: {
                create: chapter.resources.map(resource => ({
                  type: resource.type,
                  title: resource.title,
                  url: resource.url,
                  description: resource.description,
                  isRequired: resource.isRequired,
                })),
              },
            })),
          },
          glossaryTerms: {
            create: data.glossary.map(term => ({
              term: term.term,
              definition: term.definition,
              firstMentionedIn: term.firstMentionedIn,
            })),
          },
        },
        include: {
          chapters: {
            include: {
              sections: {
                include: {
                  mediaAttachments: true,
                  codeExamples: true,
                },
              },
              keyConcepts: true,
              quiz: {
                include: {
                  questions: true,
                },
              },
              resources: true,
            },
          },
          glossaryTerms: true,
        },
      });

      return this.formatCourseResponse(course);
    } catch (error) {
      console.error('Error creating course:', error);
      throw new AppError('Failed to create course', 500);
    }
  }

  async getCourses() {
    try {
      const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return courses.map(course => ({
        ...course,
        tags: JSON.parse(course.tags),
        prerequisites: JSON.parse(course.prerequisites),
        learningObjectives: JSON.parse(course.learningObjectives),
        learningPaths: JSON.parse(course.learningPaths),
        metadata: JSON.parse(course.metadata),
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new AppError('Failed to fetch courses', 500);
    }
  }

  async getCourseById(id: string) {
    try {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          chapters: {
            include: {
              sections: {
                include: {
                  mediaAttachments: true,
                  codeExamples: true,
                },
                orderBy: { order: 'asc' },
              },
              keyConcepts: true,
              quiz: {
                include: {
                  questions: true,
                },
              },
              resources: true,
            },
            orderBy: { chapterNumber: 'asc' },
          },
          glossaryTerms: true,
          progresses: true,
        },
      });

      if (!course) {
        throw new AppError('Course not found', 404);
      }

      return this.formatCourseResponse(course);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error fetching course:', error);
      throw new AppError('Failed to fetch course', 500);
    }
  }

  async getChapterById(courseId: string, chapterId: string) {
    try {
      const chapter = await prisma.chapter.findFirst({
        where: {
          courseId,
          chapterId,
        },
        include: {
          sections: {
            include: {
              mediaAttachments: true,
              codeExamples: true,
            },
            orderBy: { order: 'asc' },
          },
          keyConcepts: true,
          quiz: {
            include: {
              questions: true,
            },
          },
          resources: true,
          course: true,
        },
      });

      if (!chapter) {
        throw new AppError('Chapter not found', 404);
      }

      return this.formatChapterResponse(chapter);
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error fetching chapter:', error);
      throw new AppError('Failed to fetch chapter', 500);
    }
  }

  async updateProgress(courseId: string, progressData: any) {
    try {
      const progress = await prisma.learningProgress.upsert({
        where: { courseId },
        update: {
          completedChapters: JSON.stringify(progressData.completedChapters),
          currentChapter: progressData.currentChapter,
          completionPercentage: progressData.completionPercentage,
          totalTimeSpent: progressData.totalTimeSpent,
          lastAccessedAt: new Date(),
          chapterProgress: JSON.stringify(progressData.chapterProgress),
          achievements: JSON.stringify(progressData.achievements || []),
        },
        create: {
          courseId,
          completedChapters: JSON.stringify(progressData.completedChapters || []),
          currentChapter: progressData.currentChapter,
          completionPercentage: progressData.completionPercentage || 0,
          totalTimeSpent: progressData.totalTimeSpent || 0,
          lastAccessedAt: new Date(),
          chapterProgress: JSON.stringify(progressData.chapterProgress || {}),
          achievements: JSON.stringify(progressData.achievements || []),
        },
      });

      return {
        ...progress,
        completedChapters: JSON.parse(progress.completedChapters),
        chapterProgress: JSON.parse(progress.chapterProgress),
        achievements: JSON.parse(progress.achievements),
      };
    } catch (error) {
      console.error('Error updating progress:', error);
      throw new AppError('Failed to update progress', 500);
    }
  }

  private formatCourseResponse(course: any) {
    return {
      ...course,
      tags: JSON.parse(course.tags),
      prerequisites: JSON.parse(course.prerequisites),
      learningObjectives: JSON.parse(course.learningObjectives),
      learningPaths: JSON.parse(course.learningPaths),
      metadata: JSON.parse(course.metadata),
      chapters: course.chapters.map((chapter: any) => this.formatChapterResponse(chapter)),
    };
  }

  private formatChapterResponse(chapter: any) {
    return {
      ...chapter,
      prerequisites: JSON.parse(chapter.prerequisites),
      checkpoints: JSON.parse(chapter.checkpoints),
      sections: chapter.sections.map((section: any) => ({
        ...section,
        mediaAttachments: section.mediaAttachments || [],
        codeExamples: section.codeExamples || [],
      })),
      quiz: chapter.quiz ? {
        ...chapter.quiz,
        questions: chapter.quiz.questions.map((q: any) => ({
          ...q,
          options: q.options ? JSON.parse(q.options) : null,
        })),
      } : null,
    };
  }
}

export const courseService = new CourseService();