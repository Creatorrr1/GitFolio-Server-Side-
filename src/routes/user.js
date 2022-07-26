import { Router } from 'express';
import { create, getAll } from '../controllers/user.js';

const router = Router();

router.post('/', create);
router.get('/', getAll);
