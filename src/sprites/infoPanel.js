import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { EventHub, gameOver, youWin } from "../common/eventHub";
import { muteEffects, pause, play, unMuteEffects } from "../common/sound";
import appTextures, { allTextureKeys } from "../common/textures";
import { getGameOver } from "./messages";

let info;
let app;

let ufoText;

let ufoCount = 4;


let musicOff;
let musicOffStatus = true;

let effectsOff;
let effectsOffStatus = true;

export let shootCount = 10;
let shootText;

let time = 60; 
let timerText 


// Функція для оновлення лічильника ворогів
export const setUfoCount = (count) => {
  ufoCount = count;
  ufoText.text = `${ufoCount}`;
};

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

export const initInfo = (currApp, root) => {
  const musicOffTexture = getTexture(allTextureKeys.musicOff);
  const musicOnTexture = getTexture(allTextureKeys.musicOn);
  const effectsOffTexture = getTexture(allTextureKeys.effectsOff);
  const effectsOnTexture = getTexture(allTextureKeys.effectsOn);

  info = new Container();
  info.name = appConstants.containers.infoPanel;

  app = currApp;

  const infoPanel = new Container();

  infoPanel.position.x = 20;
  infoPanel.position.y = 20;

  const graphics = new Graphics();
  graphics.lineStyle(1, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(0, 0, 150, 100, 16);
  graphics.endFill();
  infoPanel.addChild(graphics);

  const ufo = new Sprite(getTexture(allTextureKeys.enemyShip));
  ufo.anchor.set(0, 0.5);
  ufo.scale.set(0.05);
  ufo.name = "ufo";
  ufo.x = 30;
  ufo.y = 50;

  infoPanel.addChild(ufo);

  ufoText = new Text("4", style);
  ufoText.anchor.set(0.5);
  ufoText.x = 100;
  ufoText.y = 50;
  ufoText.name = "ufotext";
  infoPanel.addChild(ufoText);

  ///

  info.addChild(infoPanel);
  info.alpha = 0.6;

  const musicButton = new Container();
  musicButton.x = appConstants.size.WIDTH - 100;
  musicButton.y = 100;
  musicButton.name = "musicButton";

  const graphicsMusicOff = new Graphics();
  graphicsMusicOff.lineStyle(2, 0xff00ff, 1);
  graphicsMusicOff.beginFill(0x650a5a, 0.25);
  graphicsMusicOff.drawCircle(15, 15, 30);
  graphicsMusicOff.endFill();
  musicButton.addChild(graphicsMusicOff);

  musicOff = new Sprite(musicOffStatus ? musicOffTexture : musicOnTexture);
  if (musicOffStatus) {
    pause(appConstants.sounds.background);
  } else {
    play(appConstants.sounds.background);
  }

  musicOff.x = -9;
  musicOff.y = -9;
  musicOff.name = "musicOff";
  musicButton.addChild(musicOff);
  musicButton.interactive = true;
  musicButton.on("pointertap", () => {
    musicOffStatus = !musicOffStatus;
    musicOff.texture = musicOffStatus ? musicOffTexture : musicOnTexture;
    if (musicOffStatus) {
      pause(appConstants.sounds.background);
    } else {
      play(appConstants.sounds.background);
    }
  });
  info.addChild(musicButton);

  //effects
  const effectsButton = new Container();
  effectsButton.x = appConstants.size.WIDTH - 100;
  effectsButton.y = 200;
  effectsButton.name = "musicButton";

  const graphicsEffectsOff = new Graphics();
  graphicsEffectsOff.lineStyle(2, 0xff00ff, 1);
  graphicsEffectsOff.beginFill(0x650a5a, 0.25);
  graphicsEffectsOff.drawCircle(15, 15, 30);
  graphicsEffectsOff.endFill();
  effectsButton.addChild(graphicsEffectsOff);

  effectsOff = new Sprite(
    effectsOffStatus ? effectsOffTexture : effectsOnTexture
  );
  if (effectsOffStatus) {
    muteEffects();
  } else {
    unMuteEffects();
  }

  effectsOff.x = -9;
  effectsOff.y = -9;
  effectsOff.name = "effectsOff";
  effectsButton.addChild(effectsOff);
  effectsButton.interactive = true;
  effectsButton.on("pointertap", () => {
    effectsOffStatus = !effectsOffStatus;
    effectsOff.texture = effectsOffStatus
      ? effectsOffTexture
      : effectsOnTexture;
    if (effectsOffStatus) {
      muteEffects();
    } else {
      unMuteEffects();
    }
  });

  info.addChild(effectsButton);

  root.addChild(info);
  return info;
};

export const initShootCounter = () => {
  const shootPanel = new Container();
  shootPanel.position.x = 20; // Розташування на екрані
  shootPanel.position.y = 530; // Встановлення вертикальної позиції

  const graphics = new Graphics();
  graphics.lineStyle(1, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(0, 0, 150, 100, 16);
  graphics.endFill();
  shootPanel.addChild(graphics);

  const bullet = new Sprite(getTexture(allTextureKeys.bulletInfo));
  bullet.anchor.set(0, 0.5);
  bullet.scale.set(0.09);
  bullet.name = "bullet";
  bullet.x = 30;
  bullet.y = 45;

  shootPanel.addChild(bullet);

  shootText = new Text(`${shootCount}`, style); // Використовуємо той самий стиль, як і для UFO
  shootText.anchor.set(0.5);
  shootText.x = 100;
  shootText.y = 50;
  shootPanel.addChild(shootText);

  info.addChild(shootPanel); // Додаємо панель лічильника до основного контейнера

  return shootPanel;
};
/*
export const setUfoCount = (count) => {
  ufoCount = count;
  ufoText.text = `${ufoCount}`;
};*/

export const updateTimerDisplay = (gameState) => {
  let lastTime = 0; // зберігаємо час останнього оновлення

  gameState.app.ticker.add((delta) => {
    lastTime += delta; // додаємо час, що пройшов з останнього кадру

    // Перевірка, чи пройшла хоча б одна секунда (залежно від FPS)
    if (lastTime >= 60) { // 60 кадрів на секунду (можливо, буде потрібно налаштувати залежно від FPS)
      if (time > 0) {
        time -= 1;
        timerText.text = `${time}`;
      }
      lastTime = 0; // скидаємо лічильник
    }
  });
};

export const initTimer = () => {
  const timer = new Container();
  timer.position.x = 20; // Розташування на екрані
  timer.position.y = 420; // Встановлення вертикальної позиції

  const graphics = new Graphics();
  graphics.lineStyle(1, 0xff00ff, 1);
  graphics.beginFill(0x650a5a, 0.25);
  graphics.drawRoundedRect(0, 0, 150, 100, 16);
  graphics.endFill();
  timer.addChild(graphics);

  const clock = new Sprite(getTexture(allTextureKeys.hourglass));
  clock.anchor.set(0, 0.5);
  clock.scale.set(0.09);
  clock.name = "bullet";
  clock.x = 30;
  clock.y = 45;

  timer.addChild(clock);

  timerText = new Text(`${time}`, style); // Використовуємо той самий стиль, як і для UFO
  timerText.anchor.set(0.5);
  timerText.x = 100;
  timerText.y = 50;
  timer.addChild(timerText);


  info.addChild(timer); // Додаємо панель лічильника до основного контейнера

  return timer;
}

EventHub.on(appConstants.events.updateShootCount, (event) => {
  shootCount -= 1;
  shootText.text = `${shootCount}`;
});

EventHub.on(appConstants.events.ufoDestroyed, (event) => {
  ufoCount -= 1;
  ufoText.text = `${ufoCount}`;
  if (ufoCount === 0) {
    youWin();
  }
});

EventHub.on(appConstants.events.resetUfo, (event) => {
  ufoCount = 4;
  ufoText.text = `${ufoCount}`;
});

