import dbClient from '../utils/dbClient.js'

export default class Exercise {
  static fromDb(exercise) {
    return new Exercise(
      exercise.githubImage,
      exercise.githubUrl,
      exercise.profile,
      exercise.id,
      exercise.createdAt,
      exercise.updatedAt,
    //   exercise.userId,
    //   exercise.edited
    )
  }

  static async fromJson(githubImage, githubUrl, profileId) {
    // const { githubImage, githubUrl } = json
    return new Exercise(githubImage, githubUrl, profileId)
  }

  constructor(
    githubImage,
    githubUrl,
    profile,
    id,
    createdAt,
    updatedAt,
    // user,
    // edited,
  ) {
    this.githubImage = githubImage
    this.githubUrl = githubUrl
    this.id = id
    this.profileId = profile
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    // this.userId = user
    // this.edited = edited
  }

  async save() {
    const createdFavouriteExercise = await dbClient.favouriteExercise.create({
      data: {
        githubImage: this.githubImage,
        githubUrl: this.githubUrl,
        profileId: this.profileId
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
    const foundExercise = await dbClient.favouriteExercise.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        profile: true,
      }
    })
    return foundExercise.map((exercise) => Exercise.fromDb(exercise))
  }

  static async delete(foundId) {
    await dbClient.favouriteExercise.delete({
      where: {
        id: foundId
      }
    })
  }
}