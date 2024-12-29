import { allTextureKeys } from "../common/textures";
import { getTexture } from "../common/assets";
import { Container, AnimatedSprite } from "pixi.js";
import appConstants from "../common/constants";
import { addBomb } from "./bombs";
import { addExposion } from "./explosions";
import {
  destroySprite,
  randomIntFromInterval,
  checkCollision,
} from "../common/utils";
import { addEnemy } from "./enemy";
import { gameState } from "../game.js";
import { createMassegeGetReadyBoss } from "../sprites/messages.js";

let asteroids;
let app;
let rootContainer;

export const initAsteroids = (currApp, root) => {
  asteroids = new Container();
  asteroids.name = appConstants.containers.asteroids;
  app = currApp;
  rootContainer = root;
  return asteroids;
};

export const clearAsteroids = () => {
  const toRemuve = []; 
  asteroids.children.forEach((a) => {
    toRemuve.push(a);
  }); 
  toRemuve.forEach((a) => {
    asteroids.removeChild(a);
    a.destroy({ children: true });
  }); 
};

export const destroyEnemy = (asteroid) => {
  addExposion({ x: asteroid.position.x, y: asteroid.position.y });
  destroySprite(asteroid);
};

export const checkAsteroidCollision = (newAsteroid) => {
  if (asteroids && asteroids.children) {
    for (let asteroid of asteroids.children) {
      if (asteroid !== newAsteroid && checkCollision(newAsteroid, asteroid)) {
        return true; // Якщо є колізія, повертаємо true
      }
    }
  }
  return false; // Якщо колізій немає
};

export const addAsteroid = () => {
  // Можливі текстури для астероїдів
  const textures = [
    getTexture(allTextureKeys.asteroid),
    getTexture(allTextureKeys.asteroid1),
    getTexture(allTextureKeys.asteroid2),
    getTexture(allTextureKeys.asteroid3),
    getTexture(allTextureKeys.asteroid4),
  ];
  // Випадковий вибір текстури
  const randomTexture = textures[Math.floor(Math.random() * textures.length)];

  let asteroid;
  let positionIsValid = false;
  const minDistanceFromEdge = 50;

  // Генерація астероїда, поки не знайдемо вільну позицію
  while (!positionIsValid) {
    // Створення астероїда
    asteroid = new AnimatedSprite([randomTexture]);
    asteroid.anchor.set(0.5, 0.5);
    asteroid.x = randomIntFromInterval(
      minDistanceFromEdge,
      appConstants.size.WIDTH - 20
    );
    asteroid.y = randomIntFromInterval(
      minDistanceFromEdge,
      appConstants.size.HEIGHT - 280
    );
    asteroid.animationSpeed = 0.1;
    asteroid.scale.set(Math.random() * 0.2 + 0.1); // Різний розмір

    // Різна швидкість обертання в випадкових напрямках (як за годинниковою, так і проти годинникової стрілки)
    asteroid.rotationSpeed = Math.random() * 0.05 - 0.025; // Випадкове значення між -0.025 і 0.025

    asteroid.lastShotTime = Date.now();

    // Перевірка колізії з іншими астероїдами
    positionIsValid = !checkAsteroidCollision(asteroid);
  }

  asteroid.destroyMe = function () {
    destroyEnemy(this);
  };

  asteroids.addChild(asteroid);

  return asteroid;
};

export const asteroidTick = (state) => {
  if (asteroids && asteroids.children) {
    asteroids.children.forEach((asteroid) => {
      // Додаємо обертання астероїда
      asteroid.rotation += 0.01;
    });
  }

};


