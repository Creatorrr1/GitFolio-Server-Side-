import dbClient from '../utils/dbClient.js'

export default class Exercise {
  static fromDb(exercise) {
    return new Exercise(
      exercise.content,
      exercise.id,
      exercise.createdAt,
      exercise.user,
      exercise.profile,
    //   exercise.edited
    )
  }

  static async fromJson(json) {
    const { content } = json
    return new Exercise(content)
  }

  constructor(
    content,
    id,
    createdAt,
    user,
    profile,
    // edited,
  ) {
    this.content = content
    this.id = id
    this.createdAt = createdAt
    this.user = user
    this.profile = profile
    // this.edited = edited
  }

  async save() {
    const createdFavouriteExercise = await dbClient.exercise.create({
      data: {
        content: this.content,
        userId: this.userId,
        createdAt: this.createdAt
      },
      include: { user: { include: { profile: true } } }
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