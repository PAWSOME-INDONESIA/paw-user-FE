export const normalizeUserData = (user) => {
  const userProfile = {
    bio: user.bio,
    birthDate: user.birthDate,
    email: user.email,
    id: user.id,
    imageUrl: user.imageUrl,
    phoneNumber: user.phoneNumber,
    username: user.username
  }

  return userProfile
}
