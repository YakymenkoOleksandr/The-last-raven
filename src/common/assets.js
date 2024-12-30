import { Assets } from "pixi.js";
import appTextures, { allTextureKeys } from "./textures";

// Додати текстури в Assets з використанням нового API
Object.entries(appTextures).forEach(([key, value]) => {
  Assets.add({
    alias: key,  // ключ для доступу до текстури
    src: value,  // шлях до текстури
  });
});

const textures = new Map();

export const loadAssets = (onProgress) => {
  const keys = Object.entries(allTextureKeys).map(([key, value]) => value);
  
  // Завантаження текстур
  Assets.load([...keys], onProgress).then((data) => {
    Object.entries(data).forEach(([key, value]) => {
      textures.set(key, value);
    });
    onProgress("all");
  });
};

export const getTexture = (id) => {
  if (textures.has(id)) {
    return textures.get(id);
  }
  return null;
};