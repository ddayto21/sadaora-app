async function createUser() {
  try {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "secure",
      },
    });
    console.log("User created:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

