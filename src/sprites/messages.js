import { restartGame } from "../common/eventHub";
import appConstants from "../common/constants";
import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { rootContainer } from "../game";

const style = new TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fontStyle: "normal",
  fontWeight: "bold",
  fill: ["#ffffff", "#00ff99"], // <- gradient
  stroke: "#4a1850",
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: "#000000",
  dropShadowBlur: 4,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: "round",
});

// Вікно сповіщення про програш
const gameOverMessage = new Container();
gameOverMessage.interactive = true;

const graphics = new Graphics();
graphics.lineStyle(1, 0xff00ff, 1);
graphics.beginFill(0x650a5a, 0.25);
graphics.drawRoundedRect(0, 0, 250, 100, 16);
graphics.endFill();

gameOverMessage.addChild(graphics);

const text = new Text("YOU LOSE ", style);
text.anchor.set(0.5);
text.x = 250 / 2;
text.y = 100 / 2;
gameOverMessage.addChild(text);
gameOverMessage.on("pointertap", () => {
  restartGame(appConstants.events.gameOver);
});

export const getGameOver = () => {
  gameOverMessage.position.x =
    appConstants.size.WIDTH / 2 - gameOverMessage.width / 2;
  gameOverMessage.position.y =
    appConstants.size.HEIGHT / 2 - gameOverMessage.height / 2;
  return gameOverMessage;
};

// Вікно сповіщення про виграш

const youWinMessages = new Container();
youWinMessages.interactive = true;

const graphics2 = new Graphics();
graphics2.lineStyle(1, 0xff00ff, 1);
graphics2.beginFill(0x650a5a, 0.25);
graphics2.drawRoundedRect(0, 0, 250, 100, 16);
graphics2.endFill();
youWinMessages.addChild(graphics2);

const text2 = new Text("YOU WIN!", style);
text2.anchor.set(0.5);
text2.x = 250 / 2;
text2.y = 100 / 2;
youWinMessages.addChild(text2);
youWinMessages.on("pointertap", () => {
  restartGame(appConstants.events.youWin);
});

export const getYouWin = () => {
  youWinMessages.position.x =
    appConstants.size.WIDTH / 2 - youWinMessages.width / 2;
  youWinMessages.position.y =
    appConstants.size.HEIGHT / 2 - youWinMessages.height / 2;
  return youWinMessages;
};


// Вікно сповіщення про наближення боса

const getReadyBoss = new Container();
getReadyBoss.interactive = true;

const graphics3 = new Graphics();
graphics3.lineStyle(1, 0xff00ff, 1);
graphics3.beginFill(0x650a5a, 0.25);
graphics3.drawRoundedRect(0, 0, 300, 100, 16);
graphics3.endFill();
getReadyBoss.addChild(graphics3);

const text3 = new Text("Get ready boss!", style);
text3.anchor.set(0.5);
text3.x = 300 / 2;
text3.y = 100 / 2;
getReadyBoss.addChild(text3);
getReadyBoss.on("pointertap", () => {rootContainer.removeChild(getReadyBoss)});

export const createMassegeGetReadyBoss = () => {
  rootContainer.addChild(getReadyBoss);

  getReadyBoss.position.x =
    appConstants.size.WIDTH / 2 - getReadyBoss.width / 2;
  getReadyBoss.position.y =
    appConstants.size.HEIGHT / 2 - getReadyBoss.height / 2;
  
  setTimeout(() => {
    rootContainer.removeChild(getReadyBoss)
  }, 2000);

  return getReadyBoss;
};

