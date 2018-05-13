/****************
 * DOM Elements *
 ****************/

/*
 * Store all the modal related elements in an object
 */

const modal = {
  container: document.querySelector('.modal'),
  start: document.querySelector('.start'),
  end: document.querySelector('.end'),
  closeBtn: document.querySelector('.off'),
  open: function() {this.container.style.display = 'flex';},
  close: function() {this.container.style.display = 'none';}
}

/*******************
 * Canvas settings *
 *******************/

class Maze {
  constructor() {
    this.cvs = document.querySelector("#maze");
    this.ctx = this.cvs.getContext("2d");
    this.width = 1355;
    this.height = 680;
    this.img = new Image();
    this.img.src = './resources/maze.png';
    this.stage = 1;
  }
  draw() {
    maze.ctx.drawImage(this.img, 0, 0);
  }
}

/************
 * Entities *
 ************/

/*
 * h: height
 * w: width
 * nX: new X
 * nY: new Y
 */

class Player {
  constructor() {
    this.x = 684;
    this.y = 9;
    this.spawn = {
      x: 684,
      y: 9
    };
    this.w = 27;
    this.h = 31;
    this.sprite = './resources/player.png';
    this.inventory = {
      dom: document.querySelectorAll('.count'),
      diamonds: 0,
      rubies: 0,
      sapphires: 0,
      topaz: 0
    };
  }

  update() {
    maze.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /*
   * the checkCollision method will find the direction of the player and check if they're allowed to move in the target area
   * It stores this area in a data object to loop over its pixels. If there are black pixels in the area, it means there is a wall.
   * If so, collision becomes true and prevents the player from moving in this direction.
   */

  checkCollision(nX, nY) {
    let imgData = (() => {
        if (nX > this.x) {
          return maze.ctx.getImageData(nX + 2.5, nY, 15, 15);
        } else if (nX < this.x) {
          return maze.ctx.getImageData(nX, nY, 15, 15);
        } else if (nY > this.y) {
          return maze.ctx.getImageData(nX, nY + 10, 15, 15);
        } else if (nY < this.y) {
          return maze.ctx.getImageData(nX, nY, 15, 15);
        }
      })(),
        data = imgData.data.filter((e, i) => !(i % 4)),
        collision = false;

    // Prevents from going off canvas
    if (!(nX >= 0 && nX <= maze.width - 27 && nY >= 0 && nY <= maze.height - 31)) collision = true;

    for (let i = 0; i < 15 * 15; i++) {
      if (data[i] === 0) {
        collision = true;
        break;
      }
    }
    return collision;
  }

  move(dir) {
    let nX, nY;
    switch (dir) {
      case 'left':
        nX = this.x - 22.5;
        nY = this.y;
        break;
      case 'up':
        nX = this.x;
        nY = this.y - 22.5;
        break;
      case 'right':
        nX = this.x + 22.5;
        nY = this.y;
        break;
      case 'down':
        nX = this.x;
        nY = this.y + 22.5;
        break;
      default: return;
    }

    /*
     * If there is a collision, don't move.
     * Otherwise, update the player's coordinates and update its position in the canvas.
     */

    if (this.checkCollision(nX, nY)) return;
    this.x = nX;
    this.y = nY;
    this.update();

    /*
     * When the player reach a given position and the maze stage is 2 (only occurs when the main quest is done),
     * send it off canvas and display the congratulations modal
     */

    if (this.x == 864 && this.y == 639 && maze.stage == 2) {
      setTimeout(() => {
        this.x = -100;
        this.y = -100;
        modal.start.style.display = 'none';
        modal.end.style.display = 'block';
        modal.open();
      }, 1000);
    }
  }
}

class Monster {
  constructor(x, y) {
    this.spawn = {
      x: x,
      y: y
    };
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 31;
    this.sprite = './resources/enemy.png';
    /*
     * Deals with the entities direction.
     * A new direction is randomly chosen in the paths array.
     * If it's a new direction, add it in the logs (for a future update to prevent redundancy)
     */
    this.paths = ['up', 'down', 'left', 'right'];
    this.dir = this.paths[~~(Math.random() * 4)];
    this.logs = [];
  }

  update(dt) {
    let speed = dt * 75,
        dir = this.dir,
        paths = this.paths;

    /*
     * Small fix to prevent the object from going outside the canvas when the browser is not focusing on the application tab
     */
    if (this.x + speed >= maze.width - 5 || this.x - speed <= 0 || this.y + speed >= maze.heigth || this.y - speed <= 0) return "Off canvas";

    if (!this.checkCollision()) {
      if (this.logs[this.logs.length - 1] !== this.dir) this.logs.push(this.dir);
      switch (this.dir) {
        case 'up':
          this.y -= speed;
          break;
        case 'down':
          this.y += speed;
          break;
        case 'left':
          this.x -= speed;
          break;
        case 'right':
          this.x += speed;
          break;
      }
    } else {
      while (this.dir == dir) { // Change the direction
        this.dir = paths[~~(Math.random() * 4)];
      }
    }
  }

  render() {
    maze.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  checkCollision() {

    /*
     * TO DO:
     * - Fix the vertical collision.
     */

    if (this.x < player.x + player.w &&
      this.x + this.w > player.x &&
      this.y < player.y + player.h &&
      this.h + this.y > player.y) {
      setTimeout(() => {
        player.x = player.spawn.x;
        player.y = player.spawn.y;
      }, 200)
    }

    let imgData = (() => {
      /*
       * Depending on the direction, get the related target area data
       * Some math is needed to prevent the sprite pixels from being taken in count
       */
      switch (this.dir) {
        case 'up':
          return maze.ctx.getImageData(this.x, this.y - 6, 15, 15);
        case 'down':
          return maze.ctx.getImageData(this.x, this.y + this.h - 10, 15, 15);
        case 'left':
          return maze.ctx.getImageData(this.x - 5, this.y, 15, 31);
        case 'right':
          return maze.ctx.getImageData(this.x + this.w - 5, this.y, 15, 31);
      }
    })(),
        data = imgData.data.filter((e, i) => !(i % 4)),
        collision = false;

    for (let i = 0; i < 15 * 15; i += 4) {
      if (!data[i] && !data[i + 1] && !data[i + 2]) { // if a pixel is black, there is a collision
        collision = true;
        break;
      }
    }
    return collision;
  }
}

class Collectible {
  constructor(name = 'Gems') {
    this.name = name;

    /*
     * The grid can be seen as a 30 x 15 grid with 45 x 45 (pixels) cells.
     * Knowing this, we can randomly generate a square coordinate by multiplying a cell ID by its width and height.
     * To adjust the element position within the cell, we need to add some pixels.
     *
     * Their sprites are grouped in a single tilesheet.
     * The objects are given a type number depending on their name.
     * This number represents their ID in the tilesheet. (0 would be the first image).
     * Since they are all 32 x 32 (pixels), we can multiply the sx (type) value by 32 to find them.
     */

    this.x = ~~(Math.random() * 30) * 45 + 9;
    this.y = ~~(Math.random() * 15) * 45 + 6;
    this.h = 32;
    this.w = 32;
    this.sprite = './resources/sprites.png';
    switch(this.name) {
      default:
        this.visible = false;
      case 'Gems':
        this.type = ~~(Math.random() * 4) + 4; // Randomize the gems type (3 to 7) to add more stones in the game
        break;
      case 'map':
        this.visible = true; // At first, only the map is visible.
        this.type = 2;
        break;
      case 'Key':
        this.type = 3;
        break;
      case 'chest':
        this.type = 0;
        break;
    }
    this.picked = false;
  }

  render() {
    // (sprite, sx, sy, sw, sh, x, y, w, h)
    if (this.visible) maze.ctx.drawImage(Resources.get(this.sprite), this.type * 32, 0, 32, 32, this.x, this.y, 32, 32);
  }

  update() {
    let count;
    if (this.x < player.x + player.w &&
        this.x + this.w > player.x &&
        this.y < player.y + player.h &&
        this.h + this.y > player.y) {
      /*
       * On collision with a player, check the visibility of the object.
       * If it is visible, act depending on its type:
       */
      if (this.visible) {
        switch(this.type) {
          /*
           * 0 refers to the closed chest.
           * If the key (objects[1]) is picked, then the chest is open (type 1).
           * Then the maze go to stage 2 and change.
           * All the gems become visible
           */
          case 0:
            if (objects[1].picked) {
              this.type = 1;
              setTimeout(() => {
                maze.img.src = './resources/maze2.png';
                maze.stage = 2;
                objects.forEach(o => o.name == 'Gems' ? o.visible = true : 0);
              }, 750);
              document.querySelector('.items li .chest').style.opacity = 1;
            }
            break;

          /*
           * 2 refers to the map.
           * When picked, display the chest and its key only.
           */
          case 2:
            objects.forEach(o => o.name != 'Gems' ? o.visible = true : 0);
            this.picked = true;
            this.visible = false;
            document.querySelector('.items li .map').style.opacity = 1;
            break;

          /* Key */
          case 3:
            this.picked = true;
            this.visible = false;
            document.querySelector('.items li .key').style.opacity = 1;
            break;

          /*
           * 4 to 7 refer to the gems.
           * When picked, their count is increased by 1 and added to the dom (aesthetic).
           */
          case 4:
            count = player.inventory.dom[0];
            player.inventory.diamonds++;
            this.visible = false;
            count.textContent++;
            document.querySelectorAll('#gem-d span').forEach(e => e.style.opacity = 1);
            break;
          case 5:
            count = player.inventory.dom[1];
            this.visible = false;
            player.inventory.rubies++;
            count.textContent++;
            document.querySelectorAll('#gem-r span').forEach(e => e.style.opacity = 1);
            break;
          case 6:
            count = player.inventory.dom[2];
            this.visible = false;
            player.inventory.sapphires++;
            count.textContent++;
            document.querySelectorAll('#gem-s span').forEach(e => e.style.opacity = 1);
            break;
          case 7:
            count = player.inventory.dom[3];
            this.visible = false;
            player.inventory.topaz++;
            count.textContent++;
            document.querySelectorAll('#gem-t span').forEach(e => e.style.opacity = 1);
            break;
        }
      }
    }
  }
}

/***************************
 * Instantiate the objects *
 ***************************/

const player = new Player();
const maze = new Maze();
const allEnemies = [
  new Monster(22.5, 10), new Monster(507.5, 100),
  new Monster(12.5, 640), new Monster(507.5, 370),
  new Monster(1317.5, 640),
  new Monster(1092.5, 235),
  new Monster(687.5, 415)
];

const objects = [
  new Collectible('map'),
  new Collectible('Key'),
  new Collectible('chest'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
  new Collectible('Gems'),
];

/*******************
 * Event Listeners *
 *******************/

document.addEventListener('keydown', (e) => {
  let dirs = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.move(dirs[e.keyCode]);
});

modal.closeBtn.addEventListener('mousedown', () => modal.close());
document.addEventListener('keydown', (e) => e.keyCode == 27 ? modal.close() : 0);