import * as PIXI from "pixi.js";
import { loadAssets } from "../common/assets";
import appConstants from "../common/constants";
import { addPlayer, getPlayer, playerTick } from "../sprites/player";

const WIDTH = appConstants.size.WIDTH;
const HEIGHT = appConstants.size.HEIGHT;

const gameState = {
  stopped: false,
  moveLeftActive: false,
  moveRightActive: false,
}

const createScene = () => {
  const app = new PIXI.Application({
        background: '#000000',
        antialias: true,
        width: WIDTH,
        height: HEIGHT,
  })
  document.body.appendChild(app.view)
  gameState.app = app;
  const rootContainer = app.stage
  rootContainer.interactive = true
  rootContainer.hitArea = app.screen

  const player = addPlayer(app, rootContainer)
  rootContainer.addChild(player)

  return app;
};

const initInteraction = () => {
  gameState.mousePosition = getPlayer().position.x
  
  gameState.app.stage.addEventListener("pointermove", (e) => {
    gameState.mousePosition = e.global.x
  })

  gameState.app.ticker.add((delta) => {
    playerTick(gameState);
  })
};

export const initGame = () => {
    loadAssets((progress) => {
      
    if (progress === "all") {
      createScene();
      initInteraction();
    }
  });
};
