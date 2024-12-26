import { Container, Sprite } from "pixi.js";
import appConstants from "../common/constants";
import { getTexture } from "../common/assets";
import { allTextureKeys } from "../common/textures";

let app; // 2. Створюємо змінну для збереження посилання на застосунок
let bombs; // 3. Створюємо контейнер для бомб
let rootContainer; // 4. Створюємо корневий контейнер
const bombSpeed = 1;

export const initBombs = (currApp, root) => {
  // 1. Ініціалізуємо створення якогось обєкту
  bombs = new Container(); // 5. Створюємо контейнер
  bombs.name = appConstants.containers.bombs; // 6. Задаємо ім"я контейнеру + в файлі константи додаємо ключ значення bombs: 'bombs'
  app = currApp; // 7. Зберігаємо посилання на наш застосунок
  root = rootContainer; // 8. Зберігаємо посилання на корневий контейнер
  return bombs; // 9. Повертаємо контейнер бомб
};

export const clearBombs = () => {
  // 9. Створюємо функію очистки контейнера для бомб
  const toRemuve = []; // 10. Створюємо масив для збирання бомб
  bombs.children.array.forEach((b) => {
    toRemuve.push(b);
  }); // 11. Додаємо бомби в масив
  toRemuve.forEach((b) => {
    bombs.removeChild(b);
    b.destroy({ children: true });
  }); // 12. Проходимось по масиву та видаляємо бомби
};

export const addBomb = (coord) => {
  // 13. Створюємо функцію додавання нової бомби 17. Передаємо текуще місцерозташування ворожого корабля
  const bomb = new Sprite(getTexture(allTextureKeys.bomb)); // 14. Підтягуємо текстуру
  bomb.anchor.set(0.5); // 15. Центруємо бомбу
  bomb.position.set(coord.x, coord.y + 10); // 16. Задаємо місцерозташування бомби
  bomb.rotation = Math.PI; // 18. Повертаємо картинку бомби
  bomb.scale.set(0.3); // 20. МАштабуємо бомбу до необхідних розмірів
  bombs.addChild(bomb); // 19. Додаємо в контейнер
};

export const bombTick = () => {
  // 21. Пишемо функцію оновлення бомб
  const toRemuve = []; // 22. Створюємо масив для збирання бомб
  bombs.children.forEach((b) => {
    b.position.y += bombSpeed * 2; // 25. Швидкість регулювання падіння бомб
    if (b.position.y > appConstants.size.HEIGHT) {
      // 26. Якщо бомба виходить за межі екрану то додаємо її в масив видалення
      toRemuve.push(b);
    }
  }); // 23. Додаємо бомби в масив
  toRemuve.forEach((b) => {
    bombs.removeChild(b);
    b.destroy({ children: true });
  }); // 24. Проходимось по масиву
};
