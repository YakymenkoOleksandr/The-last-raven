import { Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";
import { addBullet } from "./bullets";
import { shootCount } from "../sprites/infoPanel.js";
import { updateShootCount } from "../common/eventHub";
import { getGameOver } from "./messages.js";
import { destroyedAsteroids } from "../game.js";

let player;
let app;
let lockTimeout;

let moveDirection = 0; // Напрямок руху: -1 (вліво), 1 (вправо), 0 (зупинка)
const playerSpeed = 5; // Швидкість руху гравця

let canShoot = true; // Чи може гравець стріляти
const shootCooldown = 1000; // Затримка між пострілами в мілісекундах

let shootCountChecked = false; // Прапорець для перевірки набоїв
let gameOverWindowShown = false; // Прапорець для перевірки, чи вже відображено вікно Game Over

export const addPlayer = (currApp, root) => {
  if (player) {
    return player;
  }
  app = currApp;
  player = new Sprite(getTexture(allTextureKeys.spaceShip));
  player.name = appConstants.containers.player;
  player.anchor.set(0.5);
  player.scale.set(0.15);
  player.position.x = appConstants.size.WIDTH / 2;
  player.position.y = appConstants.size.HEIGHT - 200;

  setupKeyboardControls();

  return player;
};

export const getPlayer = () => player;

export const lockPlayer = () => {
  if (lockTimeout) {
    return;
  }
  player.locked = true;
  lockTimeout = setTimeout(() => {
    lockTimeout = null;
    player.locked = false;
  }, appConstants.timeouts.playerLock);
};

export const playerShoots = () => {
  // Перевірка, чи гравець заблокований або не може стріляти
  if (lockTimeout || shootCount <= 0 || !canShoot) {
    return;
  }

  // Якщо гравець не заблокований, додаємо кулю
  addBullet({ x: player.position.x, y: player.position.y });

  // Оновлення лічильника пострілів
  updateShootCount();

  // Встановлюємо затримку перед наступним пострілом
  canShoot = false;
  setTimeout(() => {
    canShoot = true; // Гравець може знову стріляти через 1 секунду
  }, shootCooldown);
};

export const playerTick = (state) => {
  if (lockTimeout) {
    player.alpha = 0.5;
  } else {
    player.alpha = 1;
  }

  // Рух гравця на основі напрямку
  if (moveDirection !== 0) {
    player.position.x += moveDirection * playerSpeed;
  }

  // Обмеження руху гравця в межах екрану
  if (player.position.x < 20) {
    player.position.x = 20;
  } else if (player.position.x > appConstants.size.WIDTH - 20) {
    player.position.x = appConstants.size.WIDTH - 20;
  }

  // Перевірка кількості пострілів
  if (shootCount === 0 && !shootCountChecked && !gameOverWindowShown) {
    // Використовуємо setTimeout для відкладеної перевірки через 2 секунди
    setTimeout(() => {
      if (destroyedAsteroids < 10) {
        const gameOverWindow = getGameOver(); // Отримуємо вікно Game Over
        app.stage.addChild(gameOverWindow); // Додаємо його на сцену
        gameOverWindowShown = true; // Встановлюємо прапорець, щоб не показувати вікно знову
      }
      shootCountChecked = false; // Скидаємо прапорець після перевірки
    }, 2000);

    shootCountChecked = true; // Встановлюємо прапорець, щоб перевірка відбулася лише один раз
    return; // Додаємо return, щоб уникнути подальших перевірок в цьому циклі
  }
};

// Налаштування обробки клавіш
const setupKeyboardControls = () => {
  window.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      moveDirection = -1; // Рух вліво
    } else if (event.code === "ArrowRight") {
      moveDirection = 1; // Рух вправо
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
      moveDirection = 0; // Зупиняємо рух, якщо стрілка відпущена
    }
  });
};
