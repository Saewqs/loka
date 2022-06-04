"use strict";
let keyInputs = 0;
let gameDone = false;

// Create an event-listener for keys, and call keyPressed()
document.addEventListener("keydown", keyPressed);

// This is a startup function that initiates from the body - don't change!!
function startUp(){
    // HOLD YER HORSES! Heres the patch 26 with selection of more games!
    let gameSelector = document.getElementById("selGame")
    if (gameSelector.length === 0){
        for (let index = 0; index < allGames.length; index++) {
            let theOption = document.createElement("option");
            theOption.text = allGames[index].name;
            gameSelector.add(theOption);
            //console.log("The gameselector Index: " + index);
        }
    }
    // Selector is filled. Read the one to play
    //gameField is used as a global member - do not remove,
    gameField = allGames[gameSelector.selectedIndex];
    //gameField = gameSelector.value; // Got the string in the selector
    console.log("från selectorn: " +gameSelector.selectedIndex + " med typen: " + typeof gameSelector.selectedIndex);
    console.log("and then the selected gameField: " + gameField.name);

    const playgroundElement = document.getElementById("playGround");
    
    ///====== Now, because this is function become the standard game map loader:
    ///====== the playfield has to be erased if we are going to change the map.
    let noPlayFieldElements = playgroundElement.childElementCount;
    //console.log("No of <divs>: " + noPlayFieldElements);
    
    if (noPlayFieldElements > 0){   // tests if there is a playfield allready: erase it.
        for (let index = 0; index < noPlayFieldElements; index++) {
            console.log("Removing child: "+index);
            document.getElementById(String(index)).remove();
        }
        //console.log("Erased, now: "+ playgroundElement.childElementCount);
    }
    //========= Now we are ready to (re-)draw the map
    drawMap(playgroundElement, gameField);
    document.getElementById("win").innerHTML = "Use arrow keys to play";
    
    // Prepping that the game is not finished/won yet
    gameDone = false;
    // Resetting the number of game movements (the variable is named wrong!!)
    keyInputs = 0;
}

function drawMap(gameMapParent, mapData)  // to use in later update of the game - select between different game tables.
{
    let marker = " ";
    let floorMarker = "N";  // This is used to minimize the repeating: marker = "N";
    let idTag = 0;          // Use CSS id to be able to find an game element faster.
    console.log("Draws the map");

    for (let i=0; i<mapData.height; i++){
        for (let j=0; j<mapData.width; j++){
            
            marker = mapData.mapGrid[i][j]; // Fetch gamedata - zero because we only use one string
            let newDivBox = document.createElement("div");
            newDivBox.classList.add("box");   // All are boxes
    
            if (marker == " "){
                newDivBox.classList.add(floorMarker); // this is a floor tile
    
            } else if (marker == "B") {
                newDivBox.classList.add(floorMarker); // this is a moving element (B) over floor
                newDivBox.classList.add(marker);    //marker is "B"
    
            } else if (marker == "GB")  // GB is special: if a box is placed over a Goal marker
            {
                marker = "G";
                newDivBox.classList.add(marker);
                marker = "B";
                newDivBox.classList.add(marker);
    
            } else if (marker == "P") 
            {
                newDivBox.classList.add(floorMarker);
                newDivBox.classList.add(marker);    //marker is "P"
                playerPos = idTag;  // idTag for this gamer element will be saved here
    
            } else{
                // This is the other tiles, that are not "special", just copy.
                newDivBox.classList.add(marker);
            }
            newDivBox.setAttribute("id", idTag++);
            gameMapParent.appendChild(newDivBox);
        } 
    }
}

function movePlayer(dudePos,nextPos)    // tex Player start pos and up: (220,-19)
{
    let playgroundElement = document.getElementById(dudePos+nextPos); // Get one element ahead
    //console.log("Är det en Box framför? : " + playgroundElement.classList.contains("B"));
    
    if (playgroundElement.classList.contains("B"))
    {
        playgroundElement = document.getElementById(dudePos+(2*nextPos)); // Get two element ahead
        //console.log("Är det Box? : " + playgroundElement.classList.contains("B"));
        if (!(playgroundElement.classList.contains("W") || playgroundElement.classList.contains("B")))
        {
            //ok, Box but no Wall - continue to move
            playgroundElement.classList.add("B");
            playgroundElement = document.getElementById(dudePos+nextPos);
            playgroundElement.classList.remove("B");
            playgroundElement.classList.add("P");
            playgroundElement = document.getElementById(dudePos);
            playgroundElement.classList.remove("P");
            playerPos += nextPos;
            if (!gameDone) keyInputs++;
        }
    }else{
   
        playgroundElement = document.getElementById(dudePos); // Get dudes div
        playgroundElement.classList.remove("P");
        playgroundElement = document.getElementById(dudePos+nextPos); // Set dude new P
        playgroundElement.classList.add("P");
        playerPos += nextPos;
        if (!gameDone) keyInputs++;
    }
}

function keyPressed(event)
{
    event.preventDefault();
    let DudePos = playerPos; // findDudeId();  // Looks for <div id> for player
    var playgroundElement = document.getElementById(0);
    //let gameField = tileMap01;  // Later game patch: get the game field from player select
    switch (event.key)
    {
        case "ArrowUp":
            //console.log("Entered ArrowUp");
            playgroundElement = document.getElementById(DudePos-gameField.width); //look for one step up
            
            // Move if not hit wall or Barrel+wall:
            if ( !playgroundElement.classList.contains("W") || playgroundElement.classList.contains("B"))
            {
                movePlayer(DudePos,-gameField.width);
            }
            break;
            
        case "ArrowDown":
            //console.log("Entered ArrowDown");
            playgroundElement = document.getElementById(DudePos+gameField.width); //look for one step down
            
            // Move if not hit wall or Barrel+wall:
            if ( !playgroundElement.classList.contains("W") || playgroundElement.classList.contains("B"))
            {
                movePlayer(DudePos,gameField.width);
            }
            break;
            
        case "ArrowLeft":
            //console.log("Entered ArrowLeft");
            playgroundElement = document.getElementById(DudePos-1); //look for one step left
            
            // Move if not hit wall or Barrel+wall:
            if ( !playgroundElement.classList.contains("W") || playgroundElement.classList.contains("B"))
            {
                movePlayer(DudePos,-1);
            }
            break;
            
        case "ArrowRight":
            //console.log("Entered ArrowRight");
            playgroundElement = document.getElementById(DudePos+1); //look for one step right
            
            // Move if not hit wall or Barrel+wall:
            if ( !playgroundElement.classList.contains("W") || playgroundElement.classList.contains("B"))
            {
                movePlayer(DudePos,1);
            }
            break;
    }

    // CHECK FOR WINNER WINNER CHICKEN DINNER
    if (!gameDone){
        let winCount = 0;

        for (let id=0; id<(gameField.height*gameField.width); id++){
            playgroundElement = document.getElementById(String(id)); //fetch the new element
            if (playgroundElement.classList.contains("B") && playgroundElement.classList.contains("G")) winCount++;
        }
        if (gameField.blocks == winCount)
        {
            gameDone = true;
            console.log("SOMEONE WON THE GAME");
            document.getElementById("win").innerHTML = "SOMEONE WON THE GAME! In " + keyInputs + " moves.";
        } else {
            // La till antal steg som spelaren gjort.
            document.getElementById("win").innerHTML = "Moves: " + keyInputs;
        }
    }
}