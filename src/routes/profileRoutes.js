import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import * as profileController from '../controllers/profile/index.js';

const router = express.Router();

// Define routes without additional prefixes
router.post('/', authenticate, profileController.createProfile); // POST /api/v1/profiles
router.get('/', authenticate, profileController.getAllProfiles); // GET /api/v1/profiles
router.put('/:profileId', authenticate, profileController.updateProfile); // PUT /api/v1/profiles/:profileId
router.delete('/:profileId', authenticate, profileController.deleteProfile); // DELETE /api/v1/profiles/:profileId
router.put('/:profileId/reading-level', authenticate, profileController.updateReadingLevel); // PUT /api/v1/profiles/:profileId/reading-level
router.post('/:profileId/page-data', authenticate, profileController.savePageData); // POST /api/v1/profiles/:profileId/page-data
router.get('/:profileId/pages', authenticate, profileController.fetchPages); // GET /api/v1/profiles
router.get('/:profileId/books', authenticate, profileController.fetchBooks); // GET /api/v1/profiles
// In your routes file
router.get('/:profileId/latest-book-number', authenticate, profileController.getLatestBookNumber);
router.post('/:profileId/create-book', authenticate, profileController.createBook);
router.get('/:profileId/get-book', authenticate, profileController.getBook);
router.delete('/:profileId/books/:bookNumber', authenticate, profileController.deleteBook);
router.put('/:profileId/books/:bookNumber', authenticate, profileController.updateBookTitle);


export default router;