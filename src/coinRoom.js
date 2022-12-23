const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
      "7x4": true,
      "1x11": true,
      "12x10": true,
      "4x7": true,
      "5x7": true,
      "6x7": true,
      "8x6": true,
      "9x6": true,
      "10x6": true,
      "7x9": true,
      "8x9": true,
      "9x9": true,
    },
  };

  // Options for Player Colors... these are in the same order as our sprite sheet
  const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];
  
  //Misc Helpers
  function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // update the style of mic button
  function updateButtonStyle(){
    const button = document.querySelector("#player-mic");
    if (button.classList.contains('ON')){
      button.classList.remove('ON');
      button.classList.add('OFF');
      button.style.backgroundImage = 'url(../images/coinRoom/micOFF.png)';
    } else {
      button.classList.remove('OFF');
      button.classList.add('ON');
      button.style.backgroundImage = 'url(../images/coinRoom/micON.png)';
    }
  }


  function getKeyString(x, y) {
    return `${x}x${y}`;
  }
  
  function createName() {
    const prefix = randomFromArray([
      "COOL",
      "SUPER",
      "HIP",
      "SMUG",
      "COOL",
      "SILKY",
      "GOOD",
      "SAFE",
      "DEAR",
      "DAMP",
      "WARM",
      "RICH",
      "LONG",
      "DARK",
      "SOFT",
      "BUFF",
      "DOPE",
    ]);
    const animal = randomFromArray([
      "BEAR",
      "DOG",
      "CAT",
      "FOX",
      "LAMB",
      "LION",
      "BOAR",
      "GOAT",
      "VOLE",
      "SEAL",
      "PUMA",
      "MULE",
      "BULL",
      "BIRD",
      "BUG",
    ]);
    return `${prefix} ${animal}`;
  }
  
  function isSolid(x,y) {
  
    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
      blockedNextSpace ||
      x >= mapData.maxX ||
      x < mapData.minX ||
      y >= mapData.maxY ||
      y < mapData.minY
    )
  }
  
  function getRandomSafeSpot() {
    //We don't look things up by key here, so just return an x/y
    return randomFromArray([
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 6 },
      { x: 2, y: 8 },
      { x: 2, y: 9 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 10 },
      { x: 5, y: 11 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 13, y: 8 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 8 },
      { x: 11, y: 4 },
    ]);
  }
  
  
  (function () {
  
    let playerId;
    let playerRef;
    let players = {};
    let coins = {};
    let bombs = {};
    let playerElements = {};
    let coinElements = {};
    let bombElements = {};

  
    const gameContainer = document.querySelector(".game-container");
    const playerNameInput = document.querySelector("#player-name");
    const playerColorButton = document.querySelector("#player-color");
    const playerMessageInput = document.querySelector("#player-text");
    const playerMessageButton = document.querySelector("#player-send");
  
  
    function placeCoin() {
      const { x, y } = getRandomSafeSpot();
      const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`);
      coinRef.set({
        x,
        y,
      })
  
      setTimeout(() => {
        placeCoin();
      }, 2000);
    }

    function placeBomb(){
      const x = players[playerId].x;
      const y = players[playerId].y;
      const bombRef = firebase.database().ref(`bombs/${getKeyString(x, y)}`);

      if (players[playerId].coins > 0){
        bombRef.set({
          x,
          y,
        });
  
        playerRef.update({
          coins: players[playerId].coins - 1,
        });
      }
    }
  
    function attemptGrabCoin(x, y) {
      const key = getKeyString(x, y);
      if (coins[key]) {
        // Remove this key from data, then uptick Player's coin count
        playerRef.update({
            coins: players[playerId].coins + 1,
          })
        firebase.database().ref(`coins/${key}`).remove();
      }
    }
  
    function attemptGrabBomb(x, y){
      const key = getKeyString(x, y);
      if (bombs[key]) {
        // Remove this key from data, then downtick Player's coin count

        if ( players[playerId].coins > 0){
          playerRef.update({
            coins: players[playerId].coins - 1,
          })
        } else {
          playerRef.remove();
        }

        firebase.database().ref(`bombs/${key}`).remove();
      }
    }
  
    function handleArrowPress(xChange = 0, yChange = 0) {
      if (!players[playerId])  return;

      const newX = players[playerId].x + xChange;
      const newY = players[playerId].y + yChange;
      if (!isSolid(newX, newY)) {
        //move to the next space
        players[playerId].x = newX;
        players[playerId].y = newY;
        if (xChange === 1) {
          players[playerId].direction = "right";
        }
        if (xChange === -1) {
          players[playerId].direction = "left";
        }
        playerRef.set(players[playerId]);
        attemptGrabCoin(newX, newY);
        attemptGrabBomb(newX, newY);
      }
    }

    function sendMessage(){
      if (!players[playerId])  return;

      const thisPlayer = players[playerId];
      let el = playerElements[playerId];
      if (thisPlayer.messagePrev !==  thisPlayer.messageCurr){
          el.querySelector('.popup-message').classList.remove("Hidden");
          el.querySelector('.popup-text').innerHTML = thisPlayer.messageCurr;
      }

      setTimeout( () => {
          el.querySelector('.popup-message').classList.add("Hidden");
      }, 700*thisPlayer.messageCurr.length);


      playerMessageInput.value = "";
      
      playerRef.update({
          messagePrev: thisPlayer.messageCurr
      });
    }
  
    function initGame() {
  
      new KeyPressListener( "ArrowUp", () => handleArrowPress(0, -1) );
      new KeyPressListener( "ArrowDown", () => handleArrowPress(0, 1) );
      new KeyPressListener( "ArrowLeft", () => handleArrowPress(-1, 0) );
      new KeyPressListener( "ArrowRight", () => handleArrowPress(1, 0) );
      new KeyPressListener( "Enter", sendMessage );
      new KeyPressListener( "Space", placeBomb );

      
      const allPlayersRef = firebase.database().ref(`players`);
      const allCoinsRef = firebase.database().ref(`coins`);
      const allBombsRef = firebase.database().ref('bombs');

      allPlayersRef.on("value", (snapshot) => {
        //Fires whenever a change occurs
        players = snapshot.val() || {};
        Object.keys(players).forEach((key) => {

          const characterState = players[key];
          let el = playerElements[key];
          // Now update the DOM
          el.querySelector(".Character_name").innerText = characterState.name;
          el.querySelector(".Character_coins").innerText = characterState.coins;
          el.setAttribute("data-color", characterState.color);
          el.setAttribute("data-direction", characterState.direction);
          const left = 16 * characterState.x + "px";
          const top = 16 * characterState.y - 4 + "px";
          el.style.transform = `translate3d(${left}, ${top}, 0)`;

          if (characterState.messagePrev !==  characterState.messageCurr){
            el.querySelector('.popup-message').classList.remove("Hidden");
            el.querySelector('.popup-text').innerHTML = characterState.messageCurr;
            setTimeout( () => {
                el.querySelector('.popup-message').classList.add("Hidden");
            }, 3000);
        }


        })
      })
      
      allPlayersRef.on("child_added", (snapshot) => {
        //Fires whenever a new node is added the tree
        const addedPlayer = snapshot.val();
        const characterElement = document.createElement("div");
        characterElement.classList.add("Character", "grid-cell");
        if (addedPlayer.id === playerId) {
          characterElement.classList.add("you");
        }
        characterElement.innerHTML = (`
        <div class="Character_shadow grid-cell"></div>

        <div class="Character_sprite grid-cell"></div>

        <div class="Character_name-container">
            <span class="Character_name"></span>
            <span class="Character_coins">0</span>
        </div>

        <div class="Character_you-arrow"></div>
          
        <div class="popup-message Hidden">
            <div class="popup-text"></div>
            <div class="popup-triangle"></div>
        </div>
        `);
        playerElements[addedPlayer.id] = characterElement;
  
        //Fill in some initial state
        characterElement.querySelector(".Character_name").innerText = addedPlayer.name;
        characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins;
        characterElement.setAttribute("data-color", addedPlayer.color);
        characterElement.setAttribute("data-direction", addedPlayer.direction);
        const left = 16 * addedPlayer.x + "px";
        const top = 16 * addedPlayer.y - 4 + "px";
        characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
        gameContainer.appendChild(characterElement);
      })
  
  
      //Remove character DOM element after they leave
      allPlayersRef.on("child_removed", (snapshot) => {
        const removedKey = snapshot.val().id;
        gameContainer.removeChild(playerElements[removedKey]);
        delete playerElements[removedKey];

        if (Object.keys(players).length === 1){
          if (firebase.database().ref(`coins`)){
            firebase.database().ref(`coins`).remove();
          }
          if (firebase.database().ref('bombs')){
            firebase.database().ref('bombs').remove();
          }
        }
      })
  
  
      //New - not in the video!
      //This block will remove coins from local state when Firebase `coins` value updates
      allCoinsRef.on("value", (snapshot) => {
        coins = snapshot.val() || {};
      });
      //
  
      allCoinsRef.on("child_added", (snapshot) => {
        const coin = snapshot.val();
        const key = getKeyString(coin.x, coin.y);
        coins[key] = true;
  
        // Create the DOM Element
        const coinElement = document.createElement("div");
        coinElement.classList.add("Coin", "grid-cell");
        coinElement.innerHTML = `
          <div class="Coin_shadow grid-cell"></div>
          <div class="Coin_sprite grid-cell"></div>
        `;
  
        // Position the Element
        const left = 16 * coin.x + "px";
        const top = 16 * coin.y - 4 + "px";
        coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  
        // Keep a reference for removal later and add to DOM
        coinElements[key] = coinElement;
        gameContainer.appendChild(coinElement);
      })

      allCoinsRef.on("child_removed", (snapshot) => {
        const {x,y} = snapshot.val();
        const keyToRemove = getKeyString(x,y);
        gameContainer.removeChild( coinElements[keyToRemove] );
        delete coinElements[keyToRemove];
      })


      allBombsRef.on("value", (snapshot) => {
        bombs = snapshot.val() || {};
      });
      //
  
      allBombsRef.on("child_added", (snapshot) => {
        const bomb = snapshot.val();
        const key = getKeyString(bomb.x, bomb.y);
        bombs[key] = true;
  
        // Create the DOM Element
        const bombElement = document.createElement("div");
        bombElement.classList.add("Bomb", "grid-cell");
        bombElement.innerHTML = `
          <div class="Bomb_sprite grid-cell"></div>
        `;
  
        // Position the Element
        const left = 16 * bomb.x + "px";
        const top = 16 * bomb.y - 4 + "px";
        bombElement.style.transform = `translate3d(${left}, ${top}, 0)`;
  
        // Keep a reference for removal later and add to DOM
        bombElements[key] = bombElement;
        gameContainer.appendChild(bombElement);
      })

      allBombsRef.on("child_removed", (snapshot) => {
        const {x,y} = snapshot.val();
        const keyToRemove = getKeyString(x,y);
        gameContainer.removeChild( bombElements[keyToRemove] );
        delete bombElements[keyToRemove];
      })
  
  
      //Updates player name with text input
      playerNameInput.addEventListener("change", (e) => {
        const newName = e.target.value || createName();
        playerNameInput.value = newName;
        playerRef.update({
          name: newName
        });
      });
  
      //Update player color on button click
      playerColorButton.addEventListener("click", () => {
        if (!players[playerId])  return;

        const mySkinIndex = playerColors.indexOf(players[playerId].color);
        const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
        playerRef.update({
          color: nextColor
        });
      });

      //Updates player message on button click
      playerMessageInput.addEventListener("change", (e) => {
        const newMessage = e.target.value || "";       
        playerRef.update({
          messageCurr: newMessage
        });
      });

      //Show player message on button click
      playerMessageButton.addEventListener("click", sendMessage);
  
      //Place my first coin
      placeCoin();
  
    }
  
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //You're logged in!
        playerId = user.uid;
        playerRef = firebase.database().ref(`players/${playerId}`);
  
        const name = createName();
        playerNameInput.value = name;
  
        const {x, y} = getRandomSafeSpot();
  
  
        playerRef.set({
          id: playerId,
          name,
          direction: "right",
          color: randomFromArray(playerColors),
          x,
          y,
          coins: 0,
          messagePrev: "",
          messageCurr: "",
        })
  
        //Remove me from Firebase when I diconnect
        playerRef.onDisconnect().remove();
  

        if (Object.keys(players).length === 1){
          if (firebase.database().ref(`coins`)){
            firebase.database().ref(`coins`).remove();
          }
          if (firebase.database().ref('bombs')){
            firebase.database().ref('bombs').remove();
          }
        }
        
        //Begin the game now that we are signed in
        initGame();
      } else {
        //You're logged out.
      }
    })
  
    firebase.auth().signInAnonymously().catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  
  
  })();
  