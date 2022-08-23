import { Router } from 'express';
import { 
create,
getById,
getAll
} from '../controllers/user.js';
import {
    validateAuthentication
} from '../middleware/auth.js'

const router = Router();

router.post('/', create);
router.get('/:id', validateAuthentication, getById)

router.get('/', getAll)

export default router