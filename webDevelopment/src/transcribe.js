
class Transcribe {

    constructor() {

        this.WorshipSet = this.#getWorshipSongs();
        this.lyricMap = new Map(); // in the event of spontaneous worship
        this.lyricsInOrder = [];   // assuming 
        this.setAllSongs();
        this.currIndex = 0;
        this.currPhrase = "";
        this.currCard = null;
        this.passedFirstLine = false;
        this.stayOnCard = false;
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
                this.lyricMap.set(newTitleCard.firstLine, newTitleCard);
                this.lyricsInOrder.push(newTitleCard);
            } else {
                // we only care about the lines with lyrics
                //push lyric cards only, since we want fast response time we set the lyric to rid of all punctuation
                let newLyricCard = new CardObj(lyrics[i], false);
                this.lyricMap.set(this.cleanString(newLyricCard.firstLine), newLyricCard);
                this.lyricsInOrder.push(newLyricCard);

            }
        }
    }

    cleanString(input) {
        var punctuationless = input.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        var finalString = punctuationless.replace(/\s{2,}/g, " ");
        return finalString;
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

        if (max < 0.5) {
            // not a good match
            return -1;
        }

        return closestMatch;
    }


    getPhrase(phrase) {

        console.log("Nth Card " + this.currIndex)
        //probably starting from beginning of the worship set
        if (this.currIndex == 0 && phrase.length > 0) {
            this.currCard = this.lyricsInOrder[this.currIndex + 1];
            this.currIndex = this.currIndex + 1;
            return this.currCard.lyrics;
        }

        // check if the phrase is a good match
        //assuming we start with fresh card

        console.log("Passed first line " + this.passedFirstLine)

        if (!this.passedFirstLine) {
            // get current card
            this.currCard = this.lyricsInOrder[this.currIndex];

            // check if non title card
            this.passedFirstLine = true;
            console.log("first line");
            //get the current's card first line
            let currCardFirstLine = this.currCard.firstLine;
            this.currPhrase = this.currCard.lyrics;

            //check if the phrase is the first line
            let diff = this.checkSimilarLength(currCardFirstLine, phrase);

            console.log("Difference " + diff)
            if (diff) {
                //if appropriate length check how similar they are
                let result = similarity(currCardFirstLine, phrase);
                console.log("Similiarity " + result)

                //check if passes first line pass
                if (result > 0.5) {
                    this.passedFirstLine = true;
                    console.log("[Event] First Line Passed:")
                }

            }

        } else {
            console.log("[Event] Check Last Line:")

            // get the current card's last line
            let lastLine = this.currCard.lastLine;

            //check if passes first line pass
            this.checkHasSubStringLength(lastLine, phrase);

        }
        return this.currPhrase
    }

    checkHasSubStringLength(lastLine, userInput) {
        console.log("Last line " + lastLine);
        for (let i = 0; i < userInput.length; i++) {
            let subString = userInput.substring(i, userInput.length);
            let result = similarity(subString, lastLine);
            if (result > 0.8) {
                console.log("[Event] : Last Line Passed:")
                this.currIndex = this.currIndex + 1;
                this.passedFirstLine = false;
                break;
            }
        }
    }

    checkSimilarLength(a, b) {
        return Math.abs(a.length - b.length) < 7;
    }
}



// helper functions for similarity between two strings 

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