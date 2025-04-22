// prisma/seed.ts
import databaseClient from "../src/db-client";
import { faker } from "@faker-js/faker";

/**
 * To populate database with mock data, run command:
 * > ts-node prisma/seed.ts
 *
 */


async function main() {
  const numUsers = 10;

  for (let i = 0; i < numUsers; i++) {
    const email = faker.internet.email().toLowerCase();
    const password = faker.internet.password();

    // Create user
    const user = await databaseClient.user.create({
      data: {
        email,
        password,
      },
    });

    // Create profile

    await databaseClient.profile.create({
      data: {
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        headline: faker.person.jobTitle(),
        photoUrl: faker.image.avatar(),
        interests: {
          create: Array.from({ length: 3 }).map(() => ({
            label: faker.word.noun(),
          })),
        },
        user: {
          connect: { id: user.id },
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    return databaseClient.$disconnect();
  });

