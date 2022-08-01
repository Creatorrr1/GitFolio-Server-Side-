import User from '../domain/user.js';
import jwt from 'jsonwebtoken';
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js';

export const create = async (req, res) => {
  // const userToCreate = req.body
  console.log('user', req.body)
  const { username, password, email} = req.body

  const userToCreate = {
    username,
    password,
    email
  }

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const user = await User.fromJson(userToCreate)

    const createdUser = await user.save()
    console.log('createdUser: ',createdUser)

    const token = generateJwt(createdUser.id)

    return sendDataResponse(res, 200, { token, ...createdUser })
  } catch (error) {
    // console.log('about to create user', userToCreate.userName, userToCreate.password, userToCreate.email)
    console.error('something went wrong', error.message)
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

// export const getAll = async (req, res) => {
//   return 'Works';
// };
