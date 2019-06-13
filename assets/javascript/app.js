//////////////////////////////  Start Global Elements  //////////////////////////////
// My web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAyFOsHWx5X57F6qslGTSi1dzJz8tKrres",
    authDomain: "rock-paper-scissors-c8ebe.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-c8ebe.firebaseio.com",
    projectId: "rock-paper-scissors-c8ebe",
    storageBucket: "rock-paper-scissors-c8ebe.appspot.com",
    messagingSenderId: "830919806790",
    appId: "1:830919806790:web:5866e7d2a9f1c9a2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variables for the database.
var db = firebase.database();
//create player references for the database
var playersData = db.ref("/players/");
//create chat refences for the database
var chatData = db.ref("/chat");
// connectionsRef references a specific location in our database.
var connectionsRef = db.ref("/connections");

var roundRef = db.ref("/round");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = db.ref(".info/connected");


//variables to initiate players of the game
var playerOne = null;
var playerTwo = null;
var visitor = null;
var name = "";
var message = "";

var playerOneName = "";
var playerTwoName = "";

var playerNum = "";





$("#visitLogIn").hide();
$("#RPS").hide();

//////////////////////////////  End Global Elements  //////////////////////////////

//////////////////////////////  Start Chat Function  //////////////////////////////

$("#submit").on("click", function(event) {
    event.preventDefault();

    // Puts out an alert if name is blank
    if ($("#sign-name-input").val()=="") {
        alert("Enter a Valid Name");
            return false;
    } else {
        // if name isn't blank, we assign the value to the name variable
        name = $("#sign-name-input").val().trim();
    }
    // Puts out an alert if message is blank
    if ($("#message-input").val()=="") {
        alert("Enter a Valid Message");
            return false;
    } else {
        // if message isn't blank, we assign the value to the message variable
        message = $("#message-input").val().trim();
    }
    var date = moment().format("MM/DD/YY hh:mm A");

    //locally log data for the specific chat message
    var chatMsg = {
        name: name,
        message: message,
        time: firebase.database.ServerValue.TIMESTAMP,
        date: date
    };
    // Code for handling the push
    chatData.push(chatMsg)
    //clears message input box 
    $("#message-input").val("");            
});

    // Firebase watcher .on("child_added"
chatData.on("child_added", function(snapshot) {
    var messageBody = document.querySelector('#messages');
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // full list of items to the message div
    $("#messages").append(
        "<div class='container' id='chatOutline'><div class='user-name time-left' id='chat'>" + sv.name +
        ":_ </div><p class='mb-0 text-left' id='chat'> " + sv.message +
        "</p><p class='time-right mb-0' id='chat'> " + sv.date +
        " </p></div>"
    );
    // referenced stackoverflow answer on how to keep your scroll bar at the bottom for the chat. user can go wherever in the feed, but once a new msg comes in ithe chat refreshes to the bottom https://stackoverflow.com/questions/40903462/how-to-keep-a-scrollbar-always-bottom
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


//////////////////////////////  End Chat Function  //////////////////////////////

//////////////////////////////  Start Login Function  //////////////////////////////


playersData.on("value", function(snapshot) {
    var sv = snapshot.val();
	// Check for existence of player 1 in the database
	if (snapshot.child("playerOne").exists()) {
		// Record player One data
        playerOne = sv.playerOne;

		// Update player One stats
        $("#player1name").text("Player One Name: "+playerOne.name);
        $("#player1wins").text("Wins:"+playerOne.wins);
        $("#player1losses").text("Losses:"+playerOne.losses);
        $("#player1ties").text("Ties:"+playerOne.ties);
        
        
	} else {
        playerOne = null;
		playerOneName = "";
    }
    if (snapshot.child("playerTwo").exists()) {

		// Record player Two data
		playerTwo = sv.playerTwo;
		// Update player One stats
        $("#player2name").text("Player Two Name: "+playerTwo.name);
        $("#player2wins").text("Wins:"+playerTwo.wins);
        $("#player2losses").text("Losses:"+playerTwo.losses);
        $("#player2ties").text("Ties:"+playerTwo.ties);
        
	} else {
        playerTwo = null;
		playerTwoName = "";
    }

    if (playerOne && playerTwo) {
        if (playerNum == "") {
            $("#visitLogIn").show();
            $("#logIn").hide();
            $("#RPS").hide();
        }
        console.log(" player one and two logged in")
    }

    if (!playerOne && !playerTwo) {
        console.log("there are no players")
    }
    //handles the database information for players when user disconnects
    //playerNum is a local variable that is used to confirm which player the user is
    if (playerNum == 1) {
        //so if playerNum is 1 and they disconnect, the PlayerOne database is cleared for the next person
        db.ref("/players/playerOne").onDisconnect().remove();
        
        // otherwise if they are player two, the playerTwo database is cleared instead
    } else if (playerNum == 2) {
        db.ref("/players/playerTwo").onDisconnect().remove();
        
    } else {
        //and if the user signing off was never assigned a number because they were a visitor, then we return nothing.
        return;
    }
});

playersData.on('child_removed', function() {
    roundRef.set(0);
    if (playerNum == "" || playerNum == 3) {
        $("#visitLogIn").hide();
        $("#logIn").show();
    }
});

//// log in function////////

$("#logInSubmit").on("click", function(event) {
    event.preventDefault();
    //checks to make sure the name field isn't blank
    if ($("#sign-name-input").val()=="") {
        alert("Enter a Valid Name");
            return false;
    // if user entered data in the name field...
    } else {
        var signName = $("#sign-name-input").val().trim(); 
        //hide the login part with the name written in. 
        $("#name-input").text(signName);
        
        if (!playerOne) {
            playerNum = 1;
            console.log("playerNum = 1");
            $("#RPS").show();
            playerOne = {
                name: signName,
                wins: 0,
                losses: 0,
                ties: 0,
                choice: '' 
            }

            db.ref().child("/players/playerOne").set(playerOne);
            console.log("Player One Stats on DB");

        } else if (!playerTwo) {
            playerNum = 2;
            $("#RPS").show();
            playerTwo = {
                name: signName,
                wins: 0,
                losses: 0,
                ties: 0,
                choice: '' 
            }

            db.ref().child("/players/playerTwo").set(playerTwo);
            console.log("Player Two Stats on DB");

        } else {
            //not quite sure how to handle this yet
            visitor = true;
            db.ref().child("/players/visitor").set(visitor);
            console.log("assigned visitor");
            
        }
        

    }
$("#logIn").hide();
});

//For visitors
$("#visitorSubmit").on("click", function(event) {
    event.preventDefault();
    var name = $("#visit-name-input").val().trim();
    $("#name-input").text(name);
    $("#sign-name-input").val(name);
    $("#visitLogIn").hide();
    playerNum = 3;
});

// When the client's connection state changes...
connectedRef.on("value", function(snapshot) {

    // If they are connected..
    if (snapshot.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    } 
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot) {

// Display the viewer count in the html.
// The number of online users is the number of children in the connections list.
$("#watchers").text(snapshot.numChildren());
});

//////////////////////////////  End Login Function  //////////////////////////////

//////////////////////////////  Start Game Function  //////////////////////////////
$("#rock").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#rock").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#rock").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    $("#RPS").hide();
    checkWinner()
});
$("#paper").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#paper").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#paper").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    $("#RPS").hide();
    checkWinner()
});
$("#scissors").on("click", function(event){
    event.preventDefault();
    if (playerNum == 1) {
        playerOne.choice = $("#scissors").text();
        console.log(playerOne.choice);
        db.ref().child("/players/playerOne/choice").set(playerOne.choice);
    } else if (playerNum == 2) {
        playerTwo.choice = $("#scissors").text();
        console.log(playerTwo.choice);
        db.ref().child("/players/playerTwo/choice").set(playerTwo.choice);
    }
    $("#RPS").hide();
    checkWinner()
});

///////////working space below with potential errors///////////////////

function checkWinner() {
    var playerOneChoice = playerOne.choice;
    var playerTwoChoice = playerTwo.choice;
    
    if ((playerOneChoice =='') || (playerTwoChoice == ''))  {
        console.log("still waiting on a player choice");
        roundRef.set(1);
    } 
    else {
        console.log("players made choices")
        var p1Tie = playerOne.ties;
        var p2Tie = playerTwo.ties;
        var p1Win = playerOne.wins;
        var p2Win = playerTwo.wins;
        var p1Loss = playerOne.losses;
        var p2Loss = playerTwo.losses;
        if (playerOneChoice === playerTwoChoice) {
            console.log("players tied")
            p1Tie++; 
            p2Tie++;
            db.ref().child("/players/playerOne/ties").set( p1Tie);
            db.ref().child("/players/playerTwo/ties").set( p2Tie);
            $("#choices").text("Player One and Player Two tied!");
        } else if ((playerOneChoice == "Rock" && playerTwoChoice == "Scissors")||(playerOneChoice == "Paper" && playerTwoChoice == "Rock")||(playerOneChoice == "Scissors" && playerTwoChoice == "Paper")){
            p1Win++; 
            p2Loss++;
            db.ref().child("/players/playerOne/wins").set( p1Win);
            db.ref().child("/players/playerTwo/losses").set( p2Loss);
            $("#choices").text("Player One wins!"); 
        } else if ((playerOneChoice == "Rock" && playerTwoChoice == "Paper")||(playerOneChoice == "Paper" && playerTwoChoice == "Scissors")||(playerOneChoice == "Scissors" && playerTwoChoice == "Rock")){
            p1Loss++; 
            p2Win++;
            db.ref().child("/players/playerOne/losses").set( p1Loss);
            db.ref().child("/players/playerTwo/wins").set( p2Win);
            $("#choices").text("Player Two wins!"); 
        }
        roundRef.set(2); 
    }
    
};

roundRef.on("value", function(snapshot) {
    
    var sv = snapshot.val();
    var round = sv

    if (round == 0) {
        console.log("players haven't made a choice");
        $("#choices").text("Players are making their selections");
    } else if (round == 1) {
        $("#choices").text("A player has made a selection");
    } else if (round == 2) {
        db.ref().child("/players/playerOne/choice").set('');
        db.ref().child("/players/playerTwo/choice").set('');
        setTimeout(reset, 3000);
    }
    
});

function reset() {
    db.ref().child("/players/playerOne/choice").set('');
    db.ref().child("/players/playerTwo/choice").set('');
    $("#choices").text("Players are making their selections");
    roundRef.set(0);
    $("#RPS").show();
    if (playerNum == ""||playerNum == 3) {
        $("#RPS").hide();
    }

};
//////////////////////////////  End Game Function  //////////////////////////////

/////////////////////////////// check user inactivity ////////////////////////////////

////////kicks the user if they remain idle for too long. This prevents the possibility of someone who is a player, but never closes the tab so that someone else could play. ref: https://stackoverflow.com/questions/667555/how-to-detect-idle-time-in-javascript-elegantly
var idleTime = 0;
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime > 1) { // 20 minutes
        window.location.reload();
    }
}

//       Create a game that suits this user story:

//   * Only two users can play at the same time.

//   * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

//   * The game will track each player's wins and losses.

//   * Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

//   * Styling and theme are completely up to you. Get Creative!

//   * Deploy your assignment to Github Pages.

