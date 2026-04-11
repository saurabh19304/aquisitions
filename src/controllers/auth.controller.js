import { formatValidationError } from "#utils/format.js";
import { signInSchema, signupSchema } from "#validations/auth.validation.js";
import logger from "#config/logger.js";
import { authenticateUser, createUser } from "#services/auth.service.js";
import { cookies } from "#utils/cookies.js";
// import pkg from 'jsonwebtoken';
// const { sign } = pkg;
import { jwttoken } from "#utils/jwt.js";

export const signup = async(req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);

    if(!validationResult.success){
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error)
      });
    }

    const { name, email, role, password } = validationResult.data;

    //auth service
    const user = await createUser({ name, email, role, password });

    const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});

    cookies.set(res, 'token', token); 

    logger.info(`user registered successfully ${email}`);

    res.status(201).json({
        message: 'user registered',
        user: {
          id:user.id,
          name: user.name,
          role: user.role,
          email: user.email
        }
    })

  } catch (error) {
    logger.error('signup error', error);

    if(error.message === 'User with this email already exist'){
      return res.status(409).json({email: 'Email already exist'})
    }

    next(error);
  }
}

export const signin = async(req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if(!validationResult.success){
      return res.status(400).json({
        error: 'validation failed',
        details: formatValidationError(validationResult.error)
      });
    }

    const { email, password } = validationResult.data;
    const user = await authenticateUser(email, password);

    const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});
    cookies.set(res, 'token', token);

    logger.info(`user signed in successfully ${email}`);

    res.status(200).json({
      message: 'user logged in',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (error) {
    logger.error('signin error', error);

    if(error.message === 'User not found' || error.message === 'Invalid credentials'){
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    next(error);
  }
}

export const signout = async(req, res, next) => {
  try {
    cookies.clear(res, 'token');
    logger.info('user signed out successfully');

    res.status(200).json({
      message: 'user logged out'
    });
  } catch (error) {
    logger.error('signout error', error);
    next(error);
  }
}