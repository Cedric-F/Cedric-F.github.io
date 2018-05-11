class Maze {
  constructor(cvs, ctx, width, height, img) {
    this.cvs = document.querySelector("#maze");
    this.ctx = this.cvs.getContext("2d");
    this.width = 1355;
    this.height = 680;
    this.img = new Image();
    this.img.src = "./resources/maze.png";
  }
  draw() {
    maze.ctx.drawImage(this.img, 0, 0);
  }
}

class Player {
  constructor(x, y, w, h, sprite) {
    this.x = 687.5;
    this.y = 10;
    this.w = 25;
    this.h = 31;
    this.sprite = 'resources/player.png';
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
    console.log(data);

    if (!(nX >= 0 && nX <= maze.width - 25 && nY >= 0 && nY <= maze.height - 31)) collision = true; // Prevents from going off canvas
    for (let i = 0; i < 15 * 15; i++) {
      if (data[i] === 0) {
        collision = true;
        break;
      }
    }
    return collision;
  }

  move(dir) {
    console.log(dir);
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
    console.log(this);
  }
}

class Monster {
  constructor(x, y, w, h, dir, sprite) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 31;
    this.sprite = 'resources/player.png';
    this.dir = ~~(Math.random() * 2);
  }

  update(dt) {
    let nX = dt * 30;
    /*if (this.checkCollision(nX)){
      if (this.dir == 1) {
        this.dir = 0;
      } else if (this.dir == 0) {
        this.dir = 1;
      }
    }*/
    if (this.dir) {
      if (!this.checkCollision(nX)) {
        this.x += nX;
      } else {
        this.dir = 0;
      }
    } else {
      if (!this.checkCollision(nX)) {
        this.x -= nX;
      } else {
        this.dir = 1;
      }
    }
    /*
     * Check the direction, then if a collision occurs in this direction.
     * If it does, change the direction.
     */
  }

  render() {
    maze.ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  checkCollision(nX) {
    let imgData = (() =>
      this.dir ?
      maze.ctx.getImageData(this.x + this.w + nX, this.y, 15, 15) :
      maze.ctx.getImageData(this.x - nX, this.y, 15, 15)
      /*if (this.dir == 1 && nX > this.x) {
        return maze.ctx.getImageData(nX + 2.5, this.y, 15, 15);
      } else if (this.dir == 0 && nX < this.x) {
        return maze.ctx.getImageData(nX, this.y, 15, 15);
      }*/
    )(),
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

const player = new Player();
const maze = new Maze();
const allEnemies = [new Monster(20, 10)];


document.addEventListener('keydown', function(e) {
  let dirs = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.move(dirs[e.keyCode]);
});
