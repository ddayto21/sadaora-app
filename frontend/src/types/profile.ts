// /types/profile.ts

/**
 * Represents an interest tag associated with a user's profile.
 */
export interface Interest {
  id: string;
  label: string;
  profileId: string;
}

/**
 * Represents a user profile displayed on the feed or account page.
 */
export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  headline: string;
  photoUrl?: string;
  interests: Interest[];
}
