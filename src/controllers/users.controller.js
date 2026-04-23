import logger from "#config/logger.js";
import {
  deleteUser as deleteUserService,
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
} from "#services/users.services.js";
import {
  updateUserSchema,
  userIdSchema,
} from "#validations/users.validation.js";
import { formatValidationError } from "#utils/format.js";
import { jwttoken } from "#utils/jwt.js";

const getActorFromRequest = (req) => {
  if (req.user?.id) {
    return req.user;
  }

  if (req.auth?.id) {
    return req.auth;
  }

  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return null;
  }

  try {
    return jwttoken.verify(token);
  } catch {
    return null;
  }
};

 export const fetchAllUsers = async (req, res, next) => {
  try {
    
    logger.info('getting all users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'seccessfulyl retrieved the users',
      users: allUsers,
      count: allUsers.length
    })

  } catch (error) {
    logger.error(error);
    next(error)
  }
 }

export const getUserById = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse(req.params);

    if (!idValidation.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(idValidation.error),
      });
    }

    logger.info(`getting user by id ${idValidation.data.id}`);

    const user = await getUserByIdService(idValidation.data.id);

    return res.status(200).json({
      message: "successfully retrieved user",
      user,
    });
  } catch (error) {
    logger.error("error in getUserById controller", error);

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse(req.params);

    if (!idValidation.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(idValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(bodyValidation.error),
      });
    }

    const actor = getActorFromRequest(req);

    if (!actor?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const targetId = idValidation.data.id;
    const updates = bodyValidation.data;
    const isAdmin = actor.role === "admin";
    const isSelf = Number(actor.id) === targetId;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        error: "forbidden",
        message: "You can only update your own profile",
      });
    }

    if ("role" in updates && !isAdmin) {
      return res.status(403).json({
        error: "forbidden",
        message: "Only admin can update user role",
      });
    }

    logger.info(`updating user ${targetId} by actor ${actor.id}`);

    const updatedUser = await updateUserService(targetId, updates);

    return res.status(200).json({
      message: "user updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("error in updateUser controller", error);

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    if (error.message === "User with this email already exist") {
      return res.status(409).json({ error: "Email already exist" });
    }

    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const idValidation = userIdSchema.safeParse(req.params);

    if (!idValidation.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(idValidation.error),
      });
    }

    const actor = getActorFromRequest(req);

    if (!actor?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const targetId = idValidation.data.id;
    const isAdmin = actor.role === "admin";
    const isSelf = Number(actor.id) === targetId;

    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        error: "forbidden",
        message: "You can only delete your own profile",
      });
    }

    logger.info(`deleting user ${targetId} by actor ${actor.id}`);

    const deletedUser = await deleteUserService(targetId);

    return res.status(200).json({
      message: "user deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    logger.error("error in deleteUser controller", error);

    if (error.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }

    next(error);
  }
};