import { Router } from 'express';
import { 
create,
getById
} from '../controllers/user.js';
import {
    validateAuthentication
} from '../middleware/auth.js'

const router = Router();

router.post('/', create);
router.get('/:id', validateAuthentication, getById)

export default router