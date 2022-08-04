import { sendDataResponse } from '../utils/responses.js'
import Exercise from '../domain/favouriteExercises.js'

export const create = async (req, res) => {
  const { content } = req.body

  try {
    if (!content) {
      throw new Error('Please provide content')
    }
    const exerciseToCreate = await Exercise.fromJson(req.body)
    exerciseToCreate.userId = req.user.id

    const favouriteExercise = await exerciseToCreate.save()
    return sendDataResponse(res, 201, favouriteExercise)
  } catch (err) {
    return sendDataResponse(res, 400, { err: err.message })
  }
}

export const getAll = async (req, res) => {
    try {
      const favouriteExercises = await Exercise.findAll()
      if (favouriteExercises.length === 0) {
        throw new Error(`Posts not found`)
      }
      const data = { favouriteExercises }
      return sendDataResponse(res, 200, data)
    } catch (err) {
      return sendDataResponse(res, 400, { err: err.message })
    }
  }