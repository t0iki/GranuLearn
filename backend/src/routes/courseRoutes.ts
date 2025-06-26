import { Router } from 'express';
import { courseController } from '../controllers/courseController';

const router = Router();

// Course routes
router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);
router.get('/:id', courseController.getCourse);
router.get('/:courseId/chapters/:chapterId', courseController.getChapter);

// Progress routes
router.post('/:courseId/progress', courseController.updateProgress);
router.get('/:courseId/progress', courseController.getProgress);

// Import route
router.post('/import', courseController.importCourse);

export default router;