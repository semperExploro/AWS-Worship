

if ("webkitSpeechRecognition" in window) {

  let speechRecognition = new webkitSpeechRecognition();
  let final_transcript = "";
  let totalLyric = "";
  let previousText = "";
  let session = null

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = document.querySelector("#select_dialect").value;

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

  speechRecognition.onresult = (event) => {

    let interim_transcript = "";
    console.log("Speech has Started")

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
      console.log("Interm: " + interim_transcript)
      let lyric = session.getPhrase(interim_transcript)

      totalLyric = "";
      for (let i = 0; i < lyric.length; i++) {
        totalLyric = totalLyric + lyric[i]
      }
      console.log("Total: " + totalLyric)

      previousText = final_transcript
    }

    document.querySelector("#final").innerHTML = final_transcript;
    document.querySelector("#interim").innerHTML = interim_transcript;
    document.querySelector("#currpresentation_text").innerHTML = totalLyric;

  };

  document.querySelector("#start").onclick = () => {
    speechRecognition.start();
  };
  document.querySelector("#stop").onclick = () => {
    speechRecognition.stop();
  };
  document.querySelector("#slideSer").onclick = () => {

    speechRecognition.start();
  };

} else {
  console.log("Speech Recognition Not Available");
}