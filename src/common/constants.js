import { Container } from "pixi.js";
import { lockPlayer } from "../sprites/player";

const appConstants = {
  size: {
    WIDTH: window.innerWidth ? window.innerWidth :  1280,
        HEIGHT: window.innerHeight ? window.innerHeight : 720,
    
    },
    containers: {
        player: 'player',
        bullets: 'bullets',
        enemies: 'enemies',
        bombs: 'bombs',
        explosions: 'explosions',
        infoPanel: 'infoPanel',
        
    },
    events: {
        bombDestroyed: 'bombDestroyed',
        infoUpdated: 'indoUpdated',
        ufoDestroyed: 'ufoDestroyed',
        manKilled: 'manKilled',
        youWin: 'youWin',
        gameOver: 'gameOver',
        restartGame: 'restartGame',
        resetPeople: 'resetPeople',
        
    },
    timeouts: {
        playerLock: 2000,
        playerShoot: 1000,
    },
};

export default appConstants;
