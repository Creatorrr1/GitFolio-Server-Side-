import { Router } from 'express'
import {
  create,
  getAll,
  deleteFExercise
} from '../controllers/favouriteExercises.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication ,create)
router.get('/' ,getAll)
router.delete('/:id', validateAuthentication, deleteFExercise)

export default router