import databaseClient from "../../src/db-client";

export async function getProfileFeed() {
    console.log(`Fetching profile feed...`);
  const profiles = await databaseClient.profile.findMany({
    include: {
      interests: true,
    },
  });
  console.log(`Profiles: ${JSON.stringify(profiles, null, 2)}`);
  return profiles;
}

getProfileFeed()
  .then(() => {
    console.log("Profile feed retrieved successfully.");
  })
  .catch((error) => {
    console.error("Error retrieving profile feed:", error);
  });
