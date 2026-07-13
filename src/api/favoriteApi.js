import { storage } from "../utils/storage";
import { favoritesTable } from "./mockData";

export function getUserFavorites(email, userDbId) {
  const storedFavs = storage.get(`favorites_${email}`);
  if (storedFavs) {
    return Promise.resolve(storedFavs);
  }
  const dbFavs = favoritesTable
    .filter((f) => f.user_id === userDbId)
    .map((f) => f.skill_item_id);
  storage.set(`favorites_${email}`, dbFavs);
  return Promise.resolve(dbFavs);
}

export function saveUserFavorites(email, favorites) {
  storage.set(`favorites_${email}`, favorites);
  return Promise.resolve(favorites);
}
