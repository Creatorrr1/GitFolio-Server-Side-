import dbClient from '../utils/dbClient.js'

export default class Exercise {
  static fromDb(exercise) {
    return new Exercise(
      exercise.id,
      exercise.githubImage,
      exercise.githubUrl,
      exercise.profile,
      exercise.createdAt,
      exercise.updatedAt,
    //   exercise.userId,
    //   exercise.edited
    )
  }

  static async fromJson(githubImage, githubUrl) {
    // const { githubImage, githubUrl } = json
    return new Exercise(githubImage, githubUrl)
  }

  constructor(
    githubImage,
    githubUrl,
    id,
    profile,
    createdAt,
    updatedAt,
    // user,
    // edited,
  ) {
    this.githubImage = githubImage
    this.githubUrl = githubUrl
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.profileId = profile
    // this.userId = user
    // this.edited = edited
  }

  async save() {
    const createdFavouriteExercise = await dbClient.exercise.create({
      data: {
        githubImage: this.githubImage,
        githubUrl: this.githubUrl,
        // userId: this.userId,
        // createdAt: this.createdAt
        // updatedAt: this.updatedAt,
      },
      include: { profile: true }
    })
    return Exercise.fromDb(createdFavouriteExercise)
  }

  async update() {
    const findExercise = await dbClient.exercise.findUnique({
      where: { id: this.id }
    })

    const updatedExercise = await dbClient.exercise.update({
      where: {
        id: this.id
      },
      data: {
        content: this.content,
        edited: findExercise.edited ? undefined : true
      }
    })
    return Exercise.fromDb(updatedExercise)
  }

  static async findAll() {
    return Exercise._findMany()
  }

  static async _findMany() {
    const foundExercise = await dbClient.exercise.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { include: { profile: true } },
      }
    })
    return foundExercise.map((exercise) => Exercise.fromDb(exercise))
  }

  static async delete(foundId) {
    await dbClient.exercise.delete({
      where: {
        id: foundId
      }
    })
  }
}