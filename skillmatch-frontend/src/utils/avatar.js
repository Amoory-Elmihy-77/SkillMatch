export const getUserAvatarUrl = (user) => {
  if (!user) return null;

  if (user.photo) {
    if (user.photo.startsWith("http")) {
      return user.photo;
    }

    if (user.photo.startsWith("/img/")) {
      return `/api${user.photo}`;
    }

    return `/api/img/users/${user.photo}`;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.username || user.name || "User"
  )}&background=random`;
};
