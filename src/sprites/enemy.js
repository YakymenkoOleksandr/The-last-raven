import { allTextureKeys } from "../common/textures";
import { getTexture } from "../common/assets";
import { Container, AnimatedSprite } from "pixi.js";
import appConstants from "../common/constants";
import { addBomb } from "./bombs";

let enemies;
let app;
let rootContainer;

let isMoving = false; // Початковий стан
let lastStateChange = Date.now(); // Час останньої зміни стану
const MOVE_DURATION = 2000; // Тривалість руху (мс)
const STOP_DURATION = 1000; // Тривалість зупинки (мс)
let moveDirection = 1; // Напрямок руху (1 - вправо, -1 - вліво)
const MOVE_SPEED = 2; // Швидкість руху

export const initEnemies = (currApp, root) => {
  enemies = new Container();
  enemies.name = appConstants.containers.enemies;
  app = currApp;
  rootContainer = root;
  return enemies;
};

export const addEnemy = () => {
  const textures = [
    getTexture(allTextureKeys.wariorSpaseShip),
    getTexture(allTextureKeys.wariorSpaseShip),
  ];
  const enemy = new AnimatedSprite(textures);
  enemy.anchor.set(0.5, 1);
  enemy.x = randomIntFromInterval(20, appConstants.size.WIDTH - 20);
  enemy.y = 200;
  enemy.animationSpeed = 0.1;
  enemies.addChild(enemy);
  enemy.scale.set(0.15);
  enemy.lastShotTime = Date.now();
  return enemy;
};

export const destroyEnemy = (enemy) => {
  enemies.removeChild(enemy);
  enemies.destroy({ children: true });
  setTimeout(() => {
    addEnemy();
  }, 1000);
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const enemyTick = () => {
  if (!enemies) return; // Якщо вороги ще не додані, виходимо з функції

    const now = Date.now();
    
    

  // Логіка перемикання стану (стояти/рухатися)
  if (isMoving) {
    if (now - lastStateChange >= MOVE_DURATION) {
      isMoving = false; // Зупиняємо рух
      lastStateChange = now; // Оновлюємо час зміни стану
    }
  } else {
    if (now - lastStateChange >= STOP_DURATION) {
      isMoving = true; // Починаємо рух
      moveDirection = Math.random() > 0.5 ? 1 : -1; // Випадковий напрямок руху
      lastStateChange = now; // Оновлюємо час зміни стану
    }
  }

  // Якщо вороги рухаються, змінюємо їх координати
  if (isMoving) {
    // Перевіряємо позицію кожного ворога
    enemies.children.forEach((enemy) => {
        enemy.x += MOVE_SPEED * moveDirection;
        
        const now = Date.now();
        if (now - enemy.lastShotTime >= 2000) { // Стріляємо кожні 2 секунди
            addBomb(enemy.position); // Передаємо позицію ворога як аргумент
            enemy.lastShotTime = now;
        }


      // Перевірка меж екрану для кожного ворога
      if (enemy.x <= 20) {
        enemy.x = 20; // Залишаємо ворога в межах екрану зліва
        moveDirection = 1; // Міняємо напрямок на вправо
        
      }
      if (enemy.x >= appConstants.size.WIDTH - 20) {
        enemy.x = appConstants.size.WIDTH - 20; // Залишаємо ворога в межах екрану справа
        moveDirection = -1; // Міняємо напрямок на вліво
        
      }
    });
  }
};
