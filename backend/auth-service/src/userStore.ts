import bcrypt from "bcrypt"

type Role = "student" | "faculty"

interface User {
  email: string;
  passwordHash: string;
  role: Role;
}

const users = new Map<string, User>()

// Helper to add preloaded users
async function preloadUser(email: string, password: string, role: Role) {
  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, role });
}

// --- PRELOADED ACCOUNTS ---
(async () => {
  await preloadUser("dr.santos@school.edu", "password123", "faculty");
  await preloadUser("prof.delacruz@school.edu", "password123", "faculty");
  await preloadUser("ms.reyes@school.edu", "password123", "faculty");
  await preloadUser("mr.lopez@school.edu", "password123", "faculty");

  await preloadUser("alice@student.edu", "test1234", "student");
  await preloadUser("bob@student.edu", "test1234", "student");
  await preloadUser("charlie@student.edu", "test1234", "student");
})();

// defaults to student unless specified
export async function createUser(email: string, password: string, role: Role = "student") {
  const passwordHash = await bcrypt.hash(password, 10)
  const newUser: User = {
    email,
    passwordHash,
    role
  }
  users.set(email, newUser)

  console.log("Signup complete: ", email, password);
  return newUser;
}

export function getUser(email: string) {
  return users.get(email) || null
}

export async function validatePassword(email: string, password: string) {
  const user = users.get(email)
  if (!user) return false

  return await bcrypt.compare(password, user.passwordHash)
}

export function isFaculty(email: string) {
  const user = users.get(email)
  return user?.role === "faculty"
}
