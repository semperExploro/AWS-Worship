

if ("webkitSpeechRecognition" in window) {

  let speechRecognition = new webkitSpeechRecognition();   // the speech recognition object
  let final_transcript = "";                               // the final transcript (a finished phrase or sentence)
  let totalLyric = "";                                     // the total lyric card
  let session = null

  //configurations
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

  //event handlers
  speechRecognition.onstart = () => {
    session = new Transcribe();
    document.querySelector("#status").style.display = "block";
  };

  speechRecognition.onerror = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Error");
  };


  speechRecognition.addEventListener('audioend', () => {
    console.log("Speech has terminated")
  });

  speechRecognition.onend = () => {
    document.querySelector("#status").style.display = "none";
    console.log("Speech Recognition Ended");
  };

  // speech handling
  speechRecognition.onresult = (event) => {
    console.log("starting speech");
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {

      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }

      //fetch lyric
      console.log("Interm: " + interim_transcript)
      let lyric = session.getPhrase(interim_transcript)

      //check if we hit list card
      if (lyric == -1) {
        speechRecognition.onend();
      } else if (lyric == -2) {
        pause();
      } else {
        //print the total lyrics
        totalLyric = "";
        for (let i = 0; i < lyric.length; i++) {
          totalLyric = totalLyric + lyric[i]
        }
        console.log("Total: " + totalLyric)
      }


    }

    //print the lyrics
    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
    document.querySelector("#currpresentation_text").innerHTML = totalLyric;

  };

  //button handlers
  document.querySelector("#start").onclick = () => {
    speechRecognition.start();
  };
  document.querySelector("#stop").onclick = () => {
    speechRecognition.stop();
  };
  document.querySelector("#slideSer").onclick = () => {
    console.log("we speech");

    speechRecognition.start();
  };

} else {
  console.log("Speech Recognition Not Available");
}

