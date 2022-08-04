import { sendDataResponse } from '../utils/responses.js'
import Exercise from '../domain/favouriteExercises.js'

export const create = async (req, res) => {
  const { githubImage, githubUrl } = req.body

  try {
    // if (!githubUrl) {
    //   throw new Error('Please provide content')
    // }
    const exerciseToCreate = await Exercise.fromJson(githubImage, githubUrl)
    console.log(exerciseToCreate)
    // exerciseToCreate.userId = req.user.id

    const favouriteExercise = await exerciseToCreate.save()
    console.log(favouriteExercise)
    return sendDataResponse(res, 201, favouriteExercise)
  } catch (err) {
    return sendDataResponse(res, 401, { err: err.message })
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