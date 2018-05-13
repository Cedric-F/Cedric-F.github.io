let engine = ((global) => {
  let win = global.window,
      lastTime;

  const main = () => {
    let now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    /*
     * Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /*
     * Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /*
     * Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  };

  /*
   * This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  const init = () => {
    lastTime = Date.now();
    main();
  };

  /*
   * This function is called by main (game loop) and itself calls all
   * of the functions which may need to update entity's data.
   */
  const update = (dt) => updateEntities(dt);

  /*
   * This is called by the update function and loops through all of the
   * objects and calls their update() methods.
   */
  const updateEntities = (dt) => {
    objects.forEach(object => object.update(dt));
    allEnemies.forEach(enemy => enemy.update(dt));
    player.update();
  };

  /*
   * This function initially draws the "game level", it will then call
   * the renderEntities function.
   */
  const render = () => {
    maze.ctx.clearRect(0,0, maze.width, maze.height)
    maze.draw();
    renderEntities();
  };

  /*
   * This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the entities' render methods.
   */
  const renderEntities = () => {
    /*
     * Loop over the collectibles and enemies arrays to draw them on the canvas
     */
    objects.forEach(object => object.render());
    allEnemies.forEach(enemy => enemy.render());
    player.update();
  };

  /*
   * Pre-cache all the required image to properly draw the canvas.
   */
  Resources.load([
    './resources/maze.png',
    './resources/maze2.png',
    './resources/player.png',
    './resources/enemy.png',
    './resources/sprites.png'
  ]);

  Resources.onReady(init);

})(this);