import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const login = async (req, res) => {
  const { username, password, email } = req.body

  console.log('/login req',req.body)

  if (!username || !password) {
    return sendDataResponse(res, 401, {
        username: 'Invalid username or/and password provided'
    })
  }

  try {
    const foundUser = await User.findByEmail(email)
    
    if(foundUser === null) {
        return sendDataResponse( res, 401, {
            user: 'Invalid, user does not exist'
        })
    }

    const areCredentialsValid = await validateCredentials(password, foundUser)
    
    console.log('areCredentialsValid', areCredentialsValid)
    console.log('FOUNDUSER ---> ',foundUser)


    if (!areCredentialsValid) {
      return sendDataResponse(res, 401, {
        username: 'Invalid username and/or password provided'
      })
    }

    const token = generateJwt(foundUser.id)

    return sendDataResponse(res, 200, { token, 
        data: {
            id: foundUser.id,
            username: foundUser.username, 
            email: foundUser.email, 
            firstname: foundUser.firstName, 
            lastname: foundUser.lastName,
            bio: foundUser.bio,
            profileImage: foundUser.profileImage
        } 
    })
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to process request')
  }
}

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

async function validateCredentials(password, user) {
  console.log('in validate() -> user : ', user)

  if (!password) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  console.log(`passwordValid = ${isPasswordValid ? 'yes' : 'no'}`)

  return isPasswordValid
}