import * as PIXI from "pixi.js";
import { root } from "postcss";
import { loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import {
  bulletTick,
  clearBullets,
  destroyBullet,
  initBullets,
  
} from "./sprites/bullets";
import {
  addPlayer,
  getPlayer,
  lockPlayer,
  playerShoots,
  playerTick,
} from "./sprites/player";
import {
  initEnemies,
  addEnemy,
  enemyTick,
  destroyEnemy,
  clearEnemies,
  
} from "./sprites/enemy.js";
import {
  bombTick,
  clearBombs,
  destroyBomb,
  initBombs,
} from "./sprites/bombs.js";
import { checkCollision, destroySprite } from "./common/utils.js";
import { explosionTick, initExplosions } from "./sprites/explosions.js";
import { initInfo, initTimer } from "./sprites/infoPanel.js";
import {
  EventHub,
  gameOver,
  resetUfo,
  resetShootCountAndTime,
  youWin,
  boss,
} from "./common/eventHub.js";
import { play } from "./common/sound";
import {
  getYouWin,
  getGameOver,
  createMassegeGetReadyBoss,
} from "./sprites/messages.js";
import { initShootCounter, updateTimerDisplay } from "./sprites/infoPanel";
import {
  asteroidTick,
  initAsteroids,
  clearAsteroids,
  addAsteroid,
} from "./sprites/asteroids.js";
import {initHP, updateHealthBars, destroyHP, clearHP} from "./sprites/HP.js"

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

export const gameState = { // Обєкт з данними, який передається в різні частини програми
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
  enemyAdded: false,
  shootCountChecked: false, // Прапорець для перевірки набоїв
  gameOverWindowShown: false, // Прапорець для перевірки, чи вже відображено вікно Game Over
  destroyedAsteroids: 0,
  shotsOutOfScreen: 0,
  shootCount: 10,
  ufoCount: 4,
  numberOfAsteroids: 10,
};

export let rootContainer;

const createScene = () => {
  const app = new PIXI.Application({
    background: "#000000",
    antialias: true,
    width: WIDTH,
    height: HEIGHT,
  });
  app.view.id = "gameCanvas";
  document.body.appendChild(app.view);
  gameState.app = app;
  rootContainer = app.stage;
  rootContainer.eventMode = 'dynamic';
  rootContainer.hitArea = app.screen;

  const backgroundTexture = PIXI.Texture.from("/assets/sprites/ui/space.png");
  const background = new PIXI.Sprite(backgroundTexture);

  background.width = WIDTH;
  background.height = HEIGHT;

  rootContainer.addChild(background);

  initInfo(app, rootContainer);
  initShootCounter(app, rootContainer);
  initTimer(app, rootContainer);
  updateTimerDisplay(gameState);

  const bullets = initBullets(app, rootContainer);
  rootContainer.addChild(bullets);

  const player = addPlayer(app, rootContainer);
  rootContainer.addChild(player);

  const bombs = initBombs(app, rootContainer);
  rootContainer.addChild(bombs);

  const asteroids = initAsteroids(app, rootContainer);
  rootContainer.addChild(asteroids);
  createAsteroids();

  const enemies = initEnemies(app, rootContainer);
  rootContainer.addChild(enemies);

  const HP = initHP(app, rootContainer);
  rootContainer.addChild(HP)

  initExplosions(app, rootContainer);

  return app;
};

export const createAsteroids = () => {
  for (let i = 0; i < gameState.numberOfAsteroids; i++) {
    addAsteroid();
  }
};

const checkAllCollisions = () => {
  // Функція для перевірки колізій обєктів
  const enemies = rootContainer.getChildByName(appConstants.containers.enemies); // Отримуємо контейнери
  const bullets = rootContainer.getChildByName(appConstants.containers.bullets);
  const bombs = rootContainer.getChildByName(appConstants.containers.bombs);
  const player = rootContainer.getChildByName(appConstants.containers.player);
  const asteroids = rootContainer.getChildByName(
    appConstants.containers.asteroids
  );
  
  if (enemies && bullets) {
    // Перевіряємо чи зіткнулися обєкти противника та кулі
    const toRemove = [];
    bullets.children.forEach((b) => {
      enemies.children.forEach((e) => {
        if (e && b) {
          if (checkCollision(e, b)) {
            toRemove.push(b);
            toRemove.push(e);
            //    destroyBullet(b); // Видаляємо кулю
            //    destroyEnemy(e); // Видаляємо ворога
          }
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }
  if (bombs && bullets) {
    // Перевіряємо чи зіткнулися обєкти пострілу противника та пострілу гравця
    const toRemove = [];
    bombs.children.forEach((bomb) => {
      bullets.children.forEach((b) => {
        if (checkCollision(bomb, b)) {
          toRemove.push(b);
          toRemove.push(bomb);
          //  destroyBullet(b); // Видаляємо кулю
          //  destroyBomb(bomb); // Видаляємо ворога
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }
  if (player && bombs) {
    // Перевіряємо чи зіткнулися обєкти пострілу противника та гравця
    const toRemuve = [];
    bombs.children.forEach((b) => {
      if (checkCollision(b, player)) {
        toRemuve.push(b); // Видаляємо кулю
        lockPlayer();
        // Тут потрібно буде додати лічилькик потраплянь по прибульцю
      }
    });
    toRemuve.forEach((b) => {
      destroyBomb(b);
    });
  }
  if (bullets && asteroids) {
    const toRemove = [];
    bullets.children.forEach((b) => {
      asteroids.children.forEach((asteroid) => {
        if (asteroid && b) {
          if (checkCollision(asteroid, b)) {
            toRemove.push(b);
            toRemove.push(asteroid);
            gameState.destroyedAsteroids += 1;
          }
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }
  if (bullets && asteroids) {
    const toRemove = [];
    bullets.children.forEach((b) => {
      asteroids.children.forEach((asteroid) => {
        if (asteroid && b) {
          if (checkCollision(asteroid, b)) {
            toRemove.push(b);
            toRemove.push(asteroid);
          }
        }
      });
    });
    toRemove.forEach((sprite) => {
      sprite.destroyMe();
    });
  }

  // Якщо всі астероїди знищені, додаємо ворога лише один раз
  if (asteroids.children.length === 0 && !gameState.enemyAdded) {
    createMassegeGetReadyBoss();
    setTimeout(() => {
      resetShootCountAndTime();
      addEnemy();
    }, 2000);
    gameState.enemyAdded = true; // Позначаємо, що ворога додано
    gameState.destroyedAsteroids = 0; // Скидаємо лічильник
  }
};

const initInteraction = () => {
  gameState.mousePosition = getPlayer().position.x;

  gameState.app.stage.addEventListener("pointermove", (e) => {
    gameState.mousePosition = e.global.x;
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      playerShoots();
    }
  });

  gameState.app.ticker.add((delta) => {
    // Даний код оновлює те, що відбвається на екрані
    playerTick(gameState);
    bulletTick();
    asteroidTick();
    enemyTick();
    bombTick();
    explosionTick();
    updateHealthBars();
    checkAllCollisions();
  });
};

export const initGame = () => {
  loadAssets((progress) => {
    if (progress === "all") {
      createScene();
      initInteraction();
    }
  });
};

const restartGame = () => {
  // Очищати обєкти при рестарті необзідно для уникнення помилок
  clearBombs();
  clearBullets();
  clearAsteroids();
  clearHP();
  clearEnemies(); 
  resetShootCountAndTime();
  createAsteroids();
  resetUfo();
  gameState.enemyAdded = false;
  gameState.destroyedAsteroids = 0;
  gameState.gameOverWindowShown = false;
  gameState.shootCountChecked = false;
  gameState.shootCount = 10;
  gameState.shotsOutOfScreen = 0;
  gameState.ufoCount = 4;

};

EventHub.on(appConstants.events.youWin, () => {
  gameState.app.ticker.stop();
  rootContainer.addChild(getYouWin());
  setTimeout(() => play(appConstants.sounds.youWin), 1000);
});

EventHub.on(appConstants.events.gameOver, () => {
  gameState.app.ticker.stop();
  rootContainer.addChild(getGameOver());
  setTimeout(() => play(appConstants.sounds.gameOver), 1000);
});

EventHub.on(appConstants.events.restartGame, (event) => {
  restartGame();
  if (event === appConstants.events.gameOver) {
    rootContainer.removeChild(getGameOver());
  }
  if (event === appConstants.events.youWin) {
    rootContainer.removeChild(getYouWin());
  }
  gameState.app.ticker.start();
});
