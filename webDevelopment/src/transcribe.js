class Transcribe {

    constructor() {
        this.WorshipSet = this.#getWorshipSongs();
        this.AllLyrics = [];
        this.setAllSongs();
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
    }

    // get all the lines individually from the lyrics
    getLines(lyrics){
        for(i = 0; i < lyrics.length; i++){
            let parsed = lyrics[i].split("\n");
            for(j = 0; j < parsed.length; j++){
                this.AllLyrics.push(parsed[j]);
            }
        }
    }






}