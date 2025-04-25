// prisma/seed.ts
import databaseClient from "../src/db-client";
import { faker } from "@faker-js/faker";

/**
 * Populates the database with mock data:
 * - Creates 10 users
 * - Each user has 2 profiles
 * - Each profile has 3 interests
 * 
 * Run with:
 * > ts-node prisma/seed.ts
 */

async function main() {
  const numUsers = 10;

  for (let i = 0; i < numUsers; i++) {
    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password();

    // Generate 2 profiles per user
    const profiles = Array.from({ length: 2 }).map(() => ({
      username: faker.internet.username().toLowerCase() + faker.number.int({ min: 1, max: 9999 }),
      name: faker.person.fullName(),
      bio: faker.lorem.paragraph(),
      headline: faker.person.jobTitle(),
      photoUrl: faker.image.avatar(),
      interests: {
        create: Array.from({ length: 3 }).map(() => ({
          label: faker.word.noun(),
        })),
      },
    }));

    const user = await databaseClient.user.create({
      data: {
        email,
        password,
        profiles: {
          create: profiles,
        },
      },
    });

    console.log(`Created user: ${user.email} with 2 profiles`);
  }
}

main()
  .then(() => {
    console.log("✅ Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
  })
  .finally(async () => {
    await databaseClient.$disconnect();
  });