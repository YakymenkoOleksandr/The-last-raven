export { rootContainer } from "../game";
import { destroySprite } from "../common/utils";
import { Graphics, Container } from "pixi.js";
import { appConstants } from "../common/constants.js"
import { gameState } from "../game";


let HP;
let app;
let rootContainer;

export const initHP = (currApp, root) => {
  HP = new Container();
  HP.name = appConstants.containers.HP;
  app = currApp;
  rootContainer = root;
  return HP;
};

export const clearHP = () => {
  const toRemove = [];
  HP.children.forEach((hp) => {
    toRemove.push(hp);
  });
  toRemove.forEach((hp) => {
    HP.removeChild(hp);
    hp.destroy({ children: true });
  });
};

export const destroyHP = (HP) => {
    destroySprite(HP);
};

export const addHP = (enemy) => {
    // Створення контейнера для шкали здоров'я
  const healthBarContainer = new Container();
  const healthBarBackground = new Graphics();
  healthBarBackground.beginFill(0x000000); // Чорний фон для шкали здоров'я
  healthBarBackground.drawRect(0, 0, 100, 10); // Розміри фону
  healthBarBackground.endFill();

  // Створення самої шкали здоров'я
  const healthBar = new Graphics();
  healthBar.beginFill(0x00ff00); // Зелене для здоров'я
  healthBar.drawRect(0, 0, 100, 10); // Початковий розмір шкали здоров'я
  healthBar.endFill();

  // Додавання елементів до контейнера шкали здоров'я
  healthBarContainer.addChild(healthBarBackground);
  healthBarContainer.addChild(healthBar);

  // Позиціонування шкали здоров'я відносно ворога
  healthBarContainer.position.set(enemy.x - 50, enemy.y - 50); // Розміщення шкали здоров'я над ворогом

  // Додавання контейнера з шкалою здоров'я до контейнера HP
  HP.addChild(healthBarContainer);

  // Збереження посилання на шкалу здоров'я для подальшого оновлення
    healthBarContainer.healthBar = healthBar;
    healthBarContainer.enemy = enemy;

  // Повертаємо контейнер для шкали здоров'я
  return healthBarContainer;
};

export const updateHealthBars = () => {
  if (!HP || HP.children.length === 0) return; // Якщо HP не створено або немає дітей, виходимо

  HP.children.forEach((healthBarContainer) => {
    const enemy = healthBarContainer.enemy; // Отримуємо ворога
    if (enemy) {
      const healthPercentage = gameState.ufoCount / 4; // Обчислюємо відсоток здоров'я
      healthBarContainer.healthBar.width = 100 * healthPercentage; // Оновлюємо ширину шкали
      healthBarContainer.position.set(enemy.x - 50, enemy.y - 150); // Оновлюємо позицію
    }
  });
};

export const enemyTick = () => {};
