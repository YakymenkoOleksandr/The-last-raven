import { Container } from "pixi.js";
import { lockPlayer } from "../sprites/player";

const appConstants = {
  size: {
    WIDTH: window.innerWidth ? window.innerWidth : 800,
        HEIGHT: window.innerHeight ? window.innerHeight : 600,
    
    },
    containers: {
        player: 'player',
    },
    timeouts: {
        playerLock: 2000,
        playerShoot: 1000,
    },
};

export default appConstants;
