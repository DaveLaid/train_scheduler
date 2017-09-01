// Script for Train Scheduler



// moment().format('MMMM Do YYYY, hh:mm:ss a');   // July 31st 2017, 09:51:25 pm
// moment().format('LT');   // 9:52 PM


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA4gLBv-P4dZauJhdmbFXlwkEMJ-2pOfH4",
    authDomain: "homework07-392ba.firebaseapp.com",
    databaseURL: "https://homework07-392ba.firebaseio.com",
    projectId: "homework07-392ba",
    storageBucket: "homework07-392ba.appspot.com",
    messagingSenderId: "524570137486"
  };
  firebase.initializeApp(config);

    // Variables
    // ================================================================================

    // Get a reference to the database service
    var database = firebase.database();

    var trainNameVar = ""; // display this
    var destinationVar = ""; // display this
    var frequencyVar; // display this AND use this to calculate minutesAway variable.
    var firstTrainVar = ""; // use this user input to calculate nextTrainVar
    


$("#submitBtn").on("click", function() {
      // Don't refresh the page!
      event.preventDefault();

      
      //capture user input into global variables.
      trainNameVar = $("#trainName").val().trim();
      destinationVar = $("#destination").val().trim();
      firstTrainVar = $("#trainTime").val().trim();
      frequencyVar = $("#frequency").val().trim();

      //Put new variable data into one object to make it easy to display the object properties/values in one row:
      var trainObject = {
      	trainNameData: trainNameVar,
	    destinationData: destinationVar,
	    firstTrainData: firstTrainVar,
	    frequencyData: frequencyVar
      }

      database.ref().push({
	      trainObject
      });

      // Clears all of the text-boxes
	  $("#trainName").val("");
	  $("#destination").val("");
	  $("#trainTime").val("");
	  $("#frequency").val("");

    });


    // Firebase watcher + initial loader .on("value")
    database.ref().on("child_added", function(childSnapshot) {

	var tName = childSnapshot.val().trainObject.trainNameData;
	var tDestination = childSnapshot.val().trainObject.destinationData;
	var tFirstTrain = childSnapshot.val().trainObject.firstTrainData;
	var tFrequency = childSnapshot.val().trainObject.frequencyData;
	
	
    // console.log(childSnapshot.val().trainObject);

	var firstTimeConverted = moment(tFirstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log("Remainder: " + tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var veryNextTrain = moment(nextTrain).format("hh:mm");



      // Change the HTML to reflect

	var tableRow = $("<tr>").html("<td>" + childSnapshot.val().trainObject.trainNameData
	+ "<td>" + childSnapshot.val().trainObject.destinationData
	+ "<td>" + childSnapshot.val().trainObject.frequencyData
	+ "<td>" + veryNextTrain 
	+ "<td>" + tMinutesTillTrain);

	$("#tbody").append(tableRow);



      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

