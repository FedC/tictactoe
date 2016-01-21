# tictacTOE

Express/NodeJS Tic Tac Toe game with Angular frontend.

![Image of tictacTOE](https://github.com/fman7/tictactoe/blob/master/Screen Shot 2016-01-14 at 6.49.01 PM.png)

## Running the app

The app will run on http://localhost:8080 using the `npm install && gulp` command if you prefer not to use gulp it can also run with simply `npm install && node tictactoe.js` in the root directory.

## Usage

User 1 goes to http://localhost:8080/
User 1 is in a “Waiting for opponent state”
User 2 goes to http://localhost:8080/ 
User 1 and User 2 update to an empty 3x3 grid game board with User 1 to move.
User 1 places an X
User 2 places an O

…

When three X’s or O’s in a row appear, both User 1 and User 2 are taken to an end game state with “You win”, “You lose”, or “Cat’s game (Tie)” respectively displayed.
User 3 goes to http://localhost:8080/ (or User 1 or User 2 refreshes the page)
User 3 is in a “Waiting for opponent state”

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits

@fman7

## License

MIT licensed

Copyright (C) 2016 Federico Commisso, http://federicocommisso.com