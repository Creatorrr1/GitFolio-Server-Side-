import dbClient from '../utils/dbClient.js'
import bcrypt from 'bcrypt'

export default class User {
  /**
   * This is JSDoc - a way for us to tell other developers what types functions/methods
   * take as inputs, what types they return, and other useful information that JS doesn't have built in
   * @tutorial https://www.valentinog.com/blog/jsdoc
   *
   * @param { { id: int, userName: string, password: string, email: string, } } user
   * @returns {User}
   */
  static fromDb(user) {
    return new User(
      user.id,
      user.userName,
      user.password,
      user.email
    )
  }

  static async fromJson(json) {
    const {
      userName,
      password,
      email
    } = json

    console.log('json in .fromJson -> ' , 'json data retrieved from req -> ',userName,
    password,
    email)

    let passwordHash
    if (password) {
      passwordHash = await bcrypt.hash(password, 8)
      console.log('passwordHash -> ', passwordHash)
    }

    return new User(
        // id would be null since it's shouldn't be assigned here
        null,
        userName,
        passwordHash,
        email
    )
  }

  constructor(
    id,
    userName,
    passwordHash,
    email
  ) {
    this.id = id
    this.userName = userName
    this.passwordHash = passwordHash
    this.email = email
  }

  toJSON() {
    return {
      user: {
        id: this.id,
        userName: this.userName,
        email: this.email
      }
    }
  }

  /**
   * @returns {User}
   *  A user instance containing an ID, representing the user data created in the database
   */
  async save() {
    console.log("IN the domain save func")
    const createdUser = await dbClient.user.create({
      data: {
          userName: this.userName,
          password: this.passwordHash,
          email: this.email
      }
    })

    return User.fromDb(createdUser)
  }

  async update() {
    const updatedUser = await dbClient.user.update({
      where: {
        id: this.id
      },
      data: {
        userName: this.userName,
        password: this.passwordHash,
        email: this.email
      }
    })

    return User.fromDb(updatedUser)
  }

  static async findByEmail(email) {
    return User._findByUnique('email', email)
  }

  static async findByUsername(username) {
    return User._findByUnique('userName', username)
  }

  static async findById(id) {
    return User._findByUnique('id', id)
  }

  static async findAll({ whereData }) {
    return User._findMany({ whereData })
  }

  static async _findByUnique(key, value) {
    const foundUser = await dbClient.user.findUnique({
      where: {
        [key]: value
      }
    })

    if (foundUser) {
      return User.fromDb(foundUser)
    }

    return null
  }

  static async _findMany({ key, value, whereData }) {
    const query = {
      where: { ...whereData },
      include: {
        profile: true
      }
    }

    if (key !== undefined && value !== undefined) {
      query.where = {
        profile: {
          [key]: value
        }
      }
    }

    const foundUsers = await dbClient.user.findMany(query)

    return foundUsers.map((user) => User.fromDb(user))
  }
}