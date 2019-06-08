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

      // Create a variable to reference the database.
      var database = firebase.database();


    $("#submit").on("click", function(event) {
          event.preventDefault();

          var name = "";
          var message = "";


        // Puts out an alert if name is blank
        if ($("#name-input").val()=="") {
            alert("Enter a Valid Name");
                return false;
        } else {
            // if name isn't blank, we assign the value to the name variable
            name = $("#name-input").val().trim();
        }
        // Puts out an alert if message is blank
        if ($("#message-input").val()=="") {
            alert("Enter a Valid Message");
                return false;
        } else {
            // if message isn't blank, we assign the value to the message variable
            message = $("#message-input").val().trim();
        }
        var date = moment().format("DD/MM/YY hh:mm A");

        var newUser = {
            name: name,
            message: message,
            time: firebase.database.ServerValue.TIMESTAMP,
            date: date
        };
          
          // Code for handling the push
          database.ref("/chat").push(newUser)
              
    });

      // Firebase watcher .on("child_added"
  database.ref("/chat").on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    var newUser = sv.newUser;

    // Console.loging the last user's data
    // console.log(sv.name);
    // console.log(sv.message);
    // console.log(sv.time);
    // console.log(sv.date);
    // console.log(new Date(snapshot.val()))
    console.log(newUser);


    // full list of items to the message div
    $("#messages").append(
        "<div class='container'><span class='user-name'> " + sv.name +
        ": </span><span class='user-message'> " + sv.message +
        " <span class='time-right'> " + sv.date +
        " </span></div>"
    );
    

    
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });




      // connectionsRef references a specific location in our database.
      var connectionsRef = database.ref("/connections");

      // '.info/connected' is a special location provided by Firebase that is updated every time
      // the client's connection state changes.
      // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
      var connectedRef = database.ref(".info/connected");

      // When the client's connection state changes...
      connectedRef.on("value", function(snap) {

          // If they are connected..
          if (snap.val()) {

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


// user is connected

// user enters name   
//       assign to player one  
//         if player one exists, assign player two
//             if play one and two exist, become spectator 

// user picks rock/paper/scissors
//       record answer to database
//       check is other user has answers
//         if not yet
//             update html to say waiting on other user
//         if other user has answered
//             run a function that checks winner
//                 if user 1 choice === user 2 choice
//                     user 1 tie++;
//                     user 2 tie++;  
//                 else if user 1 chose rock and user 2 chose paper
//                     user 1 loss++
//                     user 2 win++
//                 else if user 1 chose rock and user 2 chose scissors
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose scissors and user 2 chose paper
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose scissors and user 2 chose rock
//                     user  1 loss++
//                     user 2 win++
//                 else if user 1 chose paper and user 2 chose rock
//                     user  1 win++
//                     user 2 loss++
//                 else if user 1 chose paper and user 2 chose scissors
//                     user  1 loss++
//                     user 2 win++
//         update html to reflect winner/loser win/loss 

//         update database to reflect winner/loser win/loss 

//         reset html winner/loser and user 1 & 2 choices

//         reset database winner/loser and user 1 & 2 choices

//         if user disconnects 




//       Create a game that suits this user story:

//   * Only two users can play at the same time.

//   * Both players pick either `rock`, `paper` or `scissors`. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.

//   * The game will track each player's wins and losses.

//   * Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

//   * Styling and theme are completely up to you. Get Creative!

//   * Deploy your assignment to Github Pages.

