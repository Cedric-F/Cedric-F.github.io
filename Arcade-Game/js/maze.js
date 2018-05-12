const modal = {
  container: document.querySelector('.modal'),
  start: document.querySelector('.start'),
  end: document.querySelector('.end'),
  closeBtn: document.querySelector('.off'),
  replay: document.querySelector('.restart'),
  open: function() {this.container.style.display = 'flex';},
  close: function() {this.container.style.display = 'none';}
}

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

class Player {
  constructor() {
    this.x = 684;
    this.y = 9;
    this.w = 27;
    this.h = 31;
    this.sprite = './resources/player.png';
  }

  update() {
    maze.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

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

    if (!(nX >= 0 && nX <= maze.width - 27 && nY >= 0 && nY <= maze.height - 31)) collision = true; // Prevents from going off canvas
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

    if (this.checkCollision(nX, nY)) return; // if collision is true, don't move

    this.x = nX;
    this.y = nY;
    this.update();
    if (this.x == 729 && this.y == 639 && maze.stage == 2) {
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
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 31;
    this.sprite = './resources/enemy.png';
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
      while (this.dir == dir) { // Change the direction when it's too redundant
        this.dir = paths.filter(e => e != dir)[~~(Math.random() * 3)];
      }
    }
  }

  render() {
    maze.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  checkCollision() {

      if (this.x < player.x + player.w &&
        this.x + this.w > player.x &&
        this.y < player.y + player.h &&
        this.h + this.y > player.y) {
        setTimeout(() => {
          player.x = 684;
          player.y = 9;
        }, 200)
}
    let imgData = (() => {
      /*
      this.dir ?
      maze.ctx.getImageData(this.x + this.w + nX, this.y, 15, 15) :
      maze.ctx.getImageData(this.x - nX, this.y, 15, 15)
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

    for (let i = 0; i < 15 * 15; i++) {
      if (!data[i] && !data[i+1] && !data[i+2]) { // if a pixel is black, there is a collision
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
    this.x = ~~(Math.random() * 30) * 45 + 9;
    this.y = ~~(Math.random() * 15) * 45 + 6;
    this.h = 32;
    this.w = 32;
    this.sprite = './resources/sprites.png';
    switch(this.name) {
      default:
        this.visible = false;
      case 'Gems':
        this.type = ~~(Math.random() * 4) + 4;
        break;
      case 'map':
        this.visible = true;
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
    //sprite, sx, sy, sw, sh, x, y, w, h
    if (this.visible) maze.ctx.drawImage(Resources.get(this.sprite), this.type * 32, 0, 32, 32, this.x, this.y, 32, 32);
  }

  update() {
    if (this.x < player.x + player.w &&
        this.x + this.w > player.x &&
        this.y < player.y + player.h &&
        this.h + this.y > player.y) {
      if (this.visible) {
        if (this.name == 'map') {
          objects.forEach(o => o.name != 'Gems' ? o.visible = true : 0);
        }
        if (this.name != 'chest') {
          this.visible = false;
          this.picked = true;
        } else {
          if (objects[1].picked) {
            this.type = 1;
            setTimeout(() => {
              maze.img.src = './resources/maze2.png';
              maze.stage = 2;
              objects.forEach(o => o.name == 'Gems' ? o.visible = true : 0);
            }, 1000);
          }
        }
      }
    }
  }
}

const player = new Player();
const maze = new Maze();
const allEnemies = [new Monster(22.5, 10), new Monster(507.5, 100), new Monster(12.5, 640), new Monster(507.5, 370), new Monster(1317.5, 640), new Monster(1092.5, 235), new Monster(687.5, 415)];
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