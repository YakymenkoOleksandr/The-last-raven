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
        asteroids: 'asteroids',
        timer: 'timer,'
        
    },
    events: {
        bombDestroyed: 'bombDestroyed',
        infoUpdated: 'indoUpdated',
        ufoDestroyed: 'ufoDestroyed',
        updateShootCount: 'updateShootCount',
        youWin: 'youWin',
        gameOver: 'gameOver',
        restartGame: 'restartGame',
        resetUfo: 'resetUfo',
        timer: 'timer',
    },
    timeouts: {
        playerLock: 2000,
        playerShoot: 1000,
    },
    sounds: {
        shot: 'shot',
        miss: 'miss',
        explosion: 'explosion',
        gameOver: 'gameOver',
        youWin: 'youWin',
        background: 'background',
    },
};

export default appConstants;
