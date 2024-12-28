import { utils } from "pixi.js";
import appConstants from "./constants";

export const EventHub = new utils.EventEmitter();

export const gameOver = (data) => {
  console.log("Game Over event triggered", data);
  EventHub.emit(appConstants.events.gameOver, data);
};
export const bombDestroyed = (data) => {
  EventHub.emit(appConstants.events.bombDestroyed, data);
};
export const infoUpdated = (data) => {
  EventHub.emit(appConstants.events.infoUpdated, data);
};
export const ufoDestroyed = (data) => {
  EventHub.emit(appConstants.events.ufoDestroyed, data);
};
export const updateShootCount = (data) => {
  EventHub.emit(appConstants.events.updateShootCount, data);
};
export const youWin = (data) => {
  console.log("You Win event triggered", data);
  EventHub.emit(appConstants.events.youWin, data);
};
export const restartGame = (data) => {
  EventHub.emit(appConstants.events.restartGame, data);
};
export const resetUfo = (data) => {
  EventHub.emit(appConstants.events.resetUfo, { count: 4 });
}

export const timer = (data) => {
  EventHub.emit(appConstants.events.timer, data)
}
