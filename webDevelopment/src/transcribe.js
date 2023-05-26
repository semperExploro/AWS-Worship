
class Transcribe {

    constructor() {

        this.WorshipSet = this.#getWorshipSongs();
        this.lyricMap = new Map(); // in the event of spontaneous worship
        this.lyricsInOrder = [];   // assuming 
        this.setAllSongs();
        this.currIndex = 0;
        this.currPhrase = this.lyricsInOrder[0].totalLyric;
        this.currCard = this.lyricsInOrder[0];
        this.passedFirstLine = false;
    }


    #getWorshipSongs() {
        return getWorshipSet().getSongs();
    }

    // set the words for the all songs
    setAllSongs() {
        for (let f = 0; f < this.WorshipSet.length; f++) {
            for (let i = 0; i < DATABASE.length; i++) { // DATABASE is the global db

                if (this.WorshipSet[f] == DATABASE[i].id) {
                    let songLyrics = DATABASE[i].lyrics;
                    let cleanedLyrics = splitLyrics(songLyrics);

                    this.setHashLines(cleanedLyrics);
                }
            }
        }

        //sanity check
        console.log(this.lyricMap)
        console.log(this.lyricsInOrder)
    }

    // get all the lines individually from the lyrics for one song
    setHashLines(lyrics) {
        for (i = 0; i < lyrics.length; i++) {
            if (i == 0) {
                // make a new card object for the title
                let newTitleCard = new CardObj(lyrics[i], true);
                this.lyricMap.set(newTitleCard.firstLine, i);
            } else {
                // we only care about the lines with lyrics
                //push lyric cards only, since we want fast response time we set the lyric to rid of all punctuation
                let newLyricCard = new CardObj(lyrics[i], false);
                this.lyricMap.set(cleanString(newLyricCard.firstLine), i);
                this.lyricsInOrder.push(newLyricCard);

            }
        }
    }






    getPhrase(phrase) {

        // check if we are on the same card
        if (this.currIndex == this.lyricsInOrder.length) {
            return -1;
        }

        console.log("Nth Card " + this.currIndex)

        // check if we are on title card
        if (this.currCard.getIsTitleCard()) {
            this.currCard = this.lyricsInOrder[this.currIndex + 1];
            this.currIndex = this.currIndex + 1;
            return this.currCard.lyrics;
        }

        if (phrase == "") {
            return this.currCard.currPhrase;
        }

        // check if the phrase is a good match
        //assuming we start with fresh card

        console.log("Passed first line " + this.passedFirstLine)

        if (!this.passedFirstLine) {
            // get current card
            this.currCard = this.lyricsInOrder[this.currIndex];

            // check if non title card
            console.log("first line");
            //get the current's card first line
            let currCardFirstLine = this.currCard.firstLine;

            //check if the phrase is the first line
            let passedFirstLine = this.checkFirstLineSimilar(currCardFirstLine, phrase);
            if (passedFirstLine) {
                //do nothing - no need for sponatenous worship
            } else {
                //consider spontaneous worship
                this.fetchForSponataneousWorship(currCardFirstLine, phrase);
            }
            this.currPhrase = this.currCard.lyrics;
        } else {
            console.log("[Event] Check Last Line:")

            // get the current card's last line
            let lastLine = this.currCard.lastLine;

            //check if passes first line pass
            let ans = this.checkLastLineSubStringLength(lastLine, phrase);
            if (ans == -2) {
                return -2;
            }

        }
        return this.currPhrase
    }



    fetchForSponataneousWorship(lyric, phrase) {

        //we first check the first half of the lyric
        let firstHalfLyric = lyric.substring(0, lyric.length / 2);
        let result = this.checkFirstLineSimilar(firstHalfLyric, phrase);

        //check the matching
        if (!result) {

            //if determine the phrase is probably sponatenous worship
            for (const [key, value] of this.lyricMap.entries()) {

                // we start matching from the beginning of the phrase
                for (let i = phrase.length - 2; i < key.length; i++) {
                    let subString = key.substring(0, i);
                    let result = similarity(subString, phrase);
                    if (result < 0.5) {
                        console.log("[Event] : Spontaneous Worship Passed: " + result)
                        this.passedFirstLine = true;
                        this.currIndex = value;
                        this.currCard = this.lyricsInOrder[this.currIndex];
                        return true;
                    }
                }

            }

        } else {
            //same lyric (no sponataneous  worship)
        }
        return false;
    }

    checkLastLineSubStringLength(lastLine, userInput) {
        console.log("Last line " + lastLine);

        /*since we get a continous*/
        for (let i = 0; i < userInput.length; i++) {
            let subString = userInput.substring(i, userInput.length);
            let result = similarity(subString, lastLine);

            if (result > 0.8) {
                console.log("[Event] : Last Line Passed:")
                this.currIndex = this.currIndex + 1;
                this.passedFirstLine = false;

                return -2;
            }
        }
    }

    checkFirstLineSimilar(firstLine, userInput) {
        for (let i = userInput.length - 2; i < firstLine.length; i++) {
            let subString = firstLine.substring(0, i);
            let result = similarity(subString, userInput);
            if (result > 0.5) {
                console.log("[Event] : First Line Passed:" + result)
                this.passedFirstLine = true;
                return true;
            }
        }
        return false;
    }
}

function cleanString(input) {
    var punctuationless = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    var finalString = punctuationless.replace(/\s{2,}/g, " ");
    return finalString;
}


// helper functions for similarity between two strings 

function similarity(s1, s2) {

    //clean two str
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    s1 = cleanString(s1);
    s2 = cleanString(s2);

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