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
          return maze.ctx.getImageData(nX, nY + 8.5, 15, 15);
        } else if (nY < this.y) {
          return maze.ctx.getImageData(nX, nY, 15, 15);
        }
      })(),
        data = imgData.data,
        collision = false;
    console.log(data);

    if (!(nX >= 0 && nX <= maze.width - 25 && nY >= 0 && nY <= maze.height - 31)) collision = true; // Prevents from going off canvas
    for (let i = 0; i < 4 * 25 * 31; i += 4) {
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
    }
    if (this.checkCollision(nX, nY)) return; // if collision is true, don't move
    this.x = nX;
    this.y = nY;
    this.update();
  }

}


const player = new Player();
const maze = new Maze();



document.addEventListener('keydown', function(e) {
  let dirs = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.move(dirs[e.keyCode]);
});
