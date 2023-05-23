class Transcribe {

    constructor(WorshipSet) {
        this.WorshipSet = WorshipSet;
        this.noSong = 0
        this.CurrentSongID = WorshipSet.listOfSongID[this.noSong];
        this.audioSong = []
        this.allSongLines = []
    }

    //increment to the next song
    #nextSong() {
        this.CurrentSongID = this.WorshipSet[this.noSong];
        this.noSong += 1;
    }

    // add word to all the words spoken
    addWord(word) {
        currListOfWords.push(word);
    }

    

    // set the words for the all songs
    setCurrentSong() {
        for (let i = 0; i < DATABASE.length; i++) { // DATABASE is the global db
            let searchIndex = SONG_DATABASE
                .findIndex(song => song.id == DATABASE[i].id); // match songs by id
            
            //found song
            if (searchIndex != -1) {
                songLyrics = DATABASE[i].lyrics;
                const arr = songLyrics.split(":");
                for (let j = 0; j < arr.length; j++) {
                    this.allSongLines.push(arr[j]);
                }
            }
        }
    }




}