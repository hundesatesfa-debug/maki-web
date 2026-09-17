import { Router } from 'express';
import {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
  getMyHouses,
  uploadHousePhoto,
} from '../controllers/house.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadSingleImage } from '../middlewares/upload.middleware';

const router = Router();

router.post('/', protect, createHouse);
router.get('/', getHouses);
router.get('/mine', protect, getMyHouses);
router.get('/:id', getHouseById);
router.put('/:id', protect, updateHouse);
router.delete('/:id', protect, deleteHouse);
router.post('/upload-image', protect, authorizeRoles('OWNER', 'ADMIN'), uploadSingleImage, uploadHousePhoto);

export default router;