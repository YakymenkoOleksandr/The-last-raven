import {Sprite} from 'pixi.js'
import { getTexture } from '../common/assets'
import appConstants from '../common/constants'
import { allTextureKeys } from '../common/textures'
import { addBullet } from './bullets'
import { shootCount } from '../sprites/infoPanel.js'
import {updateShootCount} from '../common/eventHub'
import { getGameOver } from './messages.js'

let player
let app
let lockTimeout

export const addPlayer = (currApp, root) => {
    if(player){
        return player
    }
    app = currApp
    player = new Sprite(getTexture(allTextureKeys.spaceShip))
    player.name = appConstants.containers.player
    player.anchor.set(0.5)
    player.scale.set(0.15)
    player.position.x = appConstants.size.WIDTH / 2
    player.position.y = appConstants.size.HEIGHT - 200
    return player
}

export const getPlayer = () => player

export const lockPlayer = () => {
    if (lockTimeout) {
        return 
    }
    player.locked = true
    lockTimeout = setTimeout(() => {
        lockTimeout = null
        player.locked = false
    }, appConstants.timeouts.playerLock)


}

export const playerShoots = () => {
    // Перевірка, чи гравець заблокований (lockTimeout існує)
    if (lockTimeout || shootCount <= 0) {
        return; // Якщо гравець заблокований, не виконувати постріл
    }

    
    
    // Якщо гравець не заблокований, додаємо кулю
    addBullet({ x: player.position.x, y: player.position.y });
    
    // Оновлення лічильника пострілів
    updateShootCount();

}

export const playerTick = (state) => {
    if (lockTimeout) {
        player.alpha = 0.5;
    } else {
        player.alpha = 1;
    }

    const playerPosition = player.position.x;
    

    // Оновлення позиції гравця за допомогою миші
    player.position.x = state.mousePosition;

    // Перевірка, щоб гравець не виходив за межі екрану (ліва та права межі)
    if (player.position.x < 20) {
        player.position.x = 20; // Ліва межа
    } else if (player.position.x > appConstants.size.WIDTH - 20) {
        player.position.x = appConstants.size.WIDTH - 20; // Права межа
    }

    
};