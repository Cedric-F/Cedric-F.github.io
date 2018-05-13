# Arcade Game (Revamped)

An Udacity Front-End Nanodegree project.

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installation

**[Live page](https://cedric-f.github.io/Arcade-Game/)**

**Cloning the repository**
```
git clone https://github.com/Cedric-F/Cedric-F.github.io.git
```

Browse to the `Arcade-Game` directory.
If needed, move it somewhere else.
Run in a local server.

## Using the application

After closing the modal, the user is free to use the arrow keys to move the character into the maze.
The rules are simple:
- Avoid enemies
- Find a way to the Map, to display the Key and the Chest.
- The key is needed to open the chest.
- Once the chest is open, the maze changes and collectibles appear.
  It is not mandatory to get them in order to finish the game.
  The user only need to reach the exit of the maze.

## Known issues

- The collision doesn't work properly when the enemy hits the player vertically from below. It will change its trajectory instead.
- On some browsers, the player might become blurry. This is due to the fact that the maze cells are 45 x 45 (walls included) and the player character moves by 22.5 pixels thus ends up on half pixel every odd move.

## TO DO

- Fix the vertical collision
- Use the enemies logs to prevent directions redundacy (so they always have a different direction)
- Allow the enemies to continuously check collision for both directions, so they can change their axis in the middle of their trajectory
- Add SFX
- Add a Score, Lives and Timer system
- Use the characters sprites sheets to animate their moves

## Credits

- Sprites exracted from RPG Maker MV and https://opengameart.org/