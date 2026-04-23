import { db } from "#config/database.js";
import logger from "#config/logger.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "#services/auth.service.js";

export const getAllUsers = async () => {
  try {
     return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
      updated_at: users.updated_at
    }).from(users)
  } catch (error) {
    logger.error('error getting the users', error);
    throw error;
  }
}

export const getUserById = async (id) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    logger.error("error getting user by id", error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const payload = { ...updates };

    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...payload,
        updated_at: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return updatedUser;
  } catch (error) {
    logger.error("error updating user", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      throw new Error("User not found");
    }

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    return deletedUser;
  } catch (error) {
    logger.error("error deleting user", error);
    throw error;
  }
};