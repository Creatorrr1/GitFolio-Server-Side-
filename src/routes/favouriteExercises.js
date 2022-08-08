import { Router } from 'express'
import {
  create,
  getAll
} from '../controllers/favouriteExercises.js'
// import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', getAll)

export default router