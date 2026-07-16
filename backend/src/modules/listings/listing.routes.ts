import { Router } from 'express';
import * as ListingController from './listing.controller';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createListingSchema } from './listing.validation';
import { uploadMultiple } from '../../middleware/upload';

const router = Router();

router.get('/', ListingController.getAll);

router.get(
  '/me/listings',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  ListingController.getMyListings
);

router.get('/:id', ListingController.getById);

router.post(
  '/',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  uploadMultiple,
  ListingController.createListing
);

router.put(
  '/:id',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  uploadMultiple,
  ListingController.updateListing
);

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  ListingController.deleteListing
);

router.delete(
  '/:listingId/images/:imageId',
  authenticate,
  authorizeRoles('OWNER', 'ADMIN'),
  ListingController.deleteImage
);

export default router;
