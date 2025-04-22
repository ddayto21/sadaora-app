/** Handle password hasing and logic for database queries */

import bcrypt from "bcrypt";
import databaseClient from "../db-client";

export async function createUser(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return databaseClient.user.create({ data: { email, password: hashed } });
}
