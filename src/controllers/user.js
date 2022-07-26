// import User from '../domain/user.js';
// import jwt from 'jsonwebtoken';
// import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';
// import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js';

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body);
  const visibleConsole = console.log('Works');
  return visibleConsole;
};

export const getAll = async (req, res) => {
  return 'Works';
};
