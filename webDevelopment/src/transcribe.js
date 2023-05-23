class Transcribe {

    constructor() {
        this.WorshipSet = this.#getWorshipSongs();
        this.lyricMap = new Map();
        this.lyricsInOrder = [];
        this.setAllSongs();
        this.currPhrase = "";
    }


    #getWorshipSongs() {
        return getWorshipSet().getSongs();
    }

    // add word to all the words spoken
    addWord(word) {
        currListOfWords.push(word);
    }

    // set the words for the all songs
    setAllSongs() {
        for (let f = 0; f < this.WorshipSet.length; f++) {
            for (let i = 0; i < DATABASE.length; i++) { // DATABASE is the global db

                if (this.WorshipSet[f] == DATABASE[i].id) {
                    let songLyrics = DATABASE[i].lyrics;
                    let cleanedLyrics = splitLyrics(songLyrics);
                    this.getLines(cleanedLyrics);
                }
            }
        }

        //sanity check
        console.log(this.AllLyrics)
        console.log(this.lyricMap)
    }

    // get all the lines individually from the lyrics
    getLines(lyrics) {
        console.log(lyrics)
        for (i = 0; i < lyrics.length; i++) {
            let parsed = lyrics[i].split("\n");
            let firstLIne = parsed[0];
            for (j = 0; j < parsed.length; j++) {
                this.lyricsInOrder.push(parsed[j]);
            }
            this.lyricMap.set(firstLIne, parsed);
        }
    }

    closestMatch(phrase) {
        let max = 0;
        let closestMatch = "";
        for (let [key, value] of this.lyricMap) {
            let result = similarity(key, phrase)
            if (result > max) {
                max = result;
                closestMatch = key;
            }
        }
        return closestMatch;
    }

    getPhrase(phrase){
        if((this.currPhrase.length) <= (phrase.length)){
            // get until we have complete sentence
            this.currPhrase = phrase;
        } else {
            // we have a complete sentence
            this.currPhrase = phrase;
            // get the closest match
            let closestMatch = this.closestMatch(phrase);
            // get the lyrics
            let lyrics = this.lyricMap.get(closestMatch);
            // return the lyrics
            return lyrics;
        }

    }

}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}


function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }