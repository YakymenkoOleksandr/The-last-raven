import { Sprite } from "pixi.js";
import { getTexture } from "../common/assets";
import appConstants from "../common/constants";
import { allTextureKeys } from "../common/textures";

let player 
let app 
let lockTimout 

export const addPlayer = (currApp) => {
    if (player) {
        return player
    }
    app = currApp
    player = new Sprite(getTexture(allTextureKeys.spaceShip))
    player.name = appConstants.containers.player
    player.anchor.set(0.5)
    player.position.x = appConstants.size.WIDTH / 2;
    player.position.y = appConstants.size.HEIGHT - 200;
    return player
}

export const getPlayer = () => player

export const lockPlayer = () => {
    if (lockTimout) {
        return
    }
    player.locked = true;
    lockTimout = setTimeout(() => {
        lockTimout = null
        player.locked = false
    }, appConstants.timeouts.playerLock)
}

export const playerShoot = () => {
    if (!lockTimout) {
        // addBullet({x: player.position.x, y: player.position.y})
    }
}
 
export const playerTick = (state) => {
    if (lockPlayer) {
        player.alpha = 0.5
    } else {
        player.alpha = 1
    }

    const playerPosition = player.position.x
    player.position.x = state.mousePosition

    if (player.position.x < playerPosition) {
        player.rotation = -0.3;
    } else if (player.position.x > playerPosition) {
        player.rotation = 0.3;
    } else {
        player.rotation = 0;
    }
}