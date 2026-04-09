import { formatValidationError } from "#utils/format.js";
import { signupSchema } from "#validations/auth.validation.js";
import logger from "#config/logger.js";
import { createUser } from "#services/auth.service.js";
import{ jwttoken } from 'jsonwebtoken'
import { cookies } from "#utils/cookies.js";

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