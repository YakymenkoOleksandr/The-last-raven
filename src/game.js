import * as PIXI from "pixi.js";
import { root } from "postcss";
import { loadAssets } from "./common/assets";
import appConstants from "./common/constants";
import { bulletTick, destroyBullet, initBullets } from "./sprites/bullets";
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
} from "./sprites/enemy.js";
import { bombTick, destroyBomb, initBombs } from "./sprites/bombs.js";
import { checkCollision, destroySprite } from "./common/utils.js";
import { explosionTick, initExplosions } from "./sprites/explosions.js";

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

const gameState = {
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
};

let rootContainer;

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
  rootContainer.interactive = true;
  rootContainer.hitArea = app.screen;

  const backgroundTexture = PIXI.Texture.from(
    "../public/assets/sprites/ui/space.jpg"
  );
  const background = new PIXI.Sprite(backgroundTexture);

  background.width = WIDTH;
  background.height = HEIGHT;

  rootContainer.addChild(background);

  const bullets = initBullets(app, rootContainer);
  rootContainer.addChild(bullets);

  const player = addPlayer(app, rootContainer);
  rootContainer.addChild(player);

  const enemies = initEnemies(app, rootContainer);
  addEnemy();
  rootContainer.addChild(enemies);

  const bombs = initBombs(app, rootContainer);
  rootContainer.addChild(bombs);

  initExplosions(app, rootContainer);

  return app;
};

const checkAllCollisions = () => {
  // Функція для перевірки колізій обєктів
  const enemies = rootContainer.getChildByName(appConstants.containers.enemies); // Отримуємо контейнери
  const bullets = rootContainer.getChildByName(appConstants.containers.bullets);
  const bombs = rootContainer.getChildByName(appConstants.containers.bombs);
  const player = rootContainer.getChildByName(appConstants.containers.player);

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
      sprite.destroyMe()
    });
  }
  if (bombs && bullets) {
      // Перевіряємо чи зіткнулися обєкти пострілу противника та пострілу гравця
      const toRemove = [];
    bombs.children.forEach((bomb) => {
      bullets.children.forEach((b) => {
          if (checkCollision(bomb, b)) {
              toRemove.push(b)
              toRemove.push(bomb)
        //  destroyBullet(b); // Видаляємо кулю
        //  destroyBomb(bomb); // Видаляємо ворога
        }
      });
    });
      toRemove.forEach((sprite) => {
      sprite.destroyMe()
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
};

const initInteraction = () => {
  console.log("initInteraction");
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
    enemyTick();
    bombTick();
    explosionTick();
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
