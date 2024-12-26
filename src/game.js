import * as PIXI from 'pixi.js'
import { root } from 'postcss'
import { loadAssets } from './common/assets'
import appConstants from './common/constants'
import { bulletTick, initBullets } from './sprites/bullets'
import { addPlayer, getPlayer, playerShoots, playerTick } from './sprites/player'
import {initEnemies, addEnemy, enemyTick, } from './sprites/enemy.js'
import { bombTick, initBombs } from './sprites/bombs.js'

const WIDTH = appConstants.size.WIDTH
const HEIGHT = appConstants.size.HEIGHT

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
    app.view.id = 'gameCanvas';
    document.body.appendChild(app.view)
    gameState.app = app
    const rootContainer = app.stage
    rootContainer.interactive = true
    rootContainer.hitArea = app.screen

    const backgroundTexture = PIXI.Texture.from('../public/assets/sprites/ui/space.jpg');
    const background = new PIXI.Sprite(backgroundTexture);

    background.width = WIDTH;
    background.height = HEIGHT;

    rootContainer.addChild(background);

    const bullets = initBullets(app, rootContainer)
    rootContainer.addChild(bullets)

    const player = addPlayer(app, rootContainer)
    rootContainer.addChild(player)

    const enemies = initEnemies(app, rootContainer)
    addEnemy()
    rootContainer.addChild(enemies)

    const bombs = initBombs(app, rootContainer)
    rootContainer.addChild(bombs)

    return app
}

const initInteraction = () => {
    console.log('initInteraction')
    gameState.mousePosition = getPlayer().position.x

    gameState.app.stage.addEventListener("pointermove", (e) => {
        gameState.mousePosition = e.global.x
    })

    document.addEventListener("keydown", (e) => {
        if(e.code === 'Space'){
            playerShoots()
        }
    })

    gameState.app.ticker.add((delta) => { // Даний код оновлює те, що відбвається на екрані
        playerTick(gameState)
        bulletTick()
        enemyTick()
        bombTick()
    })
}

export const initGame = () => {
   loadAssets((progress) => {
     if(progress === 'all'){
        createScene()
        initInteraction()
     }
   })

}