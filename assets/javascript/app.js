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

      var name = "";
      var message = "";
      var time = "";

      $("#submit").on("click", function(event) {
          event.preventDefault();

          // Grabbed values from text boxes
          name = $("#name-input").val().trim();
          message = $("#message-input").val().trim();

          // Code for handling the push
          database.ref().push({
              name: name,
              message: message,
              time: firebase.database.ServerValue.TIMESTAMP
          });
      });

      // Firebase watcher .on("child_added"
  database.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.loging the last user's data
    console.log(sv.name);
    console.log(sv.message);
    console.log(sv.time);


    // Change the HTML to reflect
    $("#messages").text(sv.name);
    
    
    

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
