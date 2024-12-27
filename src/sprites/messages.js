import { restartGame } from "../common/eventHub";
import appConstants from "../common/constants";
import { Container, Graphics, Text, TextStyle } from "pixi.js";

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
const gameOverMessages = new Container();
gameOverMessages.interactive = true;

const graphics = new Graphics();
graphics.lineStyle(1, 0xff00ff, 1);
graphics.beginFill(0x650a5a, 0.25);
graphics.drawRoundedRect(0, 0, 250, 100, 16);
graphics.endFill();
gameOverMessages.addChild(graphics)

const text = new Text('Game Over', style)
text.anchor.set(0.5)
text.x = 250 / 2
text.y = 100 / 2
gameOverMessages.addChild(text)
gameOverMessages.on('pointertap', () => {
    restartGame(appConstants.events.gameOver)
})

export const getGameOver = () => {
    gameOverMessages.position.x = appConstants.size.WIDTH / 2 - gameOverMessages.width / 2
    gameOverMessages.position.y = appConstants.size.HEIGHT / 2 - gameOverMessages.height / 2
    return gameOverMessages
}

// Вікно сповіщення про виграш

const youWinMessages = new Container();
youWinMessages.interactive = true;

const graphics2 = new Graphics();
graphics2.lineStyle(1, 0xff00ff, 1);
graphics2.beginFill(0x650a5a, 0.25);
graphics2.drawRoundedRect(0, 0, 250, 100, 16);
graphics2.endFill();
youWinMessages.addChild(graphics2)

const text2 = new Text('You Win!', style)
text2.anchor.set(0.5)
text2.x = 250 / 2
text2.y = 100 / 2
youWinMessages.addChild(text2)
youWinMessages.on('pointertap', () => {
    restartGame(appConstants.events.youWin)
})

export const getYouWin = () => {
    youWinMessages.position.x = appConstants.size.WIDTH / 2 - youWinMessages.width / 2
    youWinMessages.position.y = appConstants.size.HEIGHT / 2 - youWinMessages.height / 2
    return youWinMessages
}