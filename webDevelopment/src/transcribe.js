class Transcribe {

    constructor() {
        this.WorshipSet = this.#getWorshipSongs();
        this.lyricMap = new Map(); // in the event of spontaneous worship
        this.lyricsInOrder = [];   // assuming 
        this.setAllSongs();
        this.currIndex = -1;
        this.currPhrase = "";
        this.currCard = null;
        this.finishedCard = false;
        this.stayOnCard = false;
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

                    this.setHashLines(cleanedLyrics);
                }
            }
        }

        //sanity check
        console.log(this.lyricMap)
    }

    // get all the lines individually from the lyrics
    setHashLines(lyrics) {
        console.log(lyrics)
        for (i = 0; i < lyrics.length; i++) {
            let parsed = lyrics[i].split("\n");
            let firstLine = parsed[0];
            // make a new card object for the title
            let newLyricCard = new cardObj(firstLine, true);
            this.lyricMap.set(firstLine, newLyricCard);
            this.lyricsInOrder.push(newLyricCard);

            // we only care about the lines with lyrics
            for (let j = 1; j < parsed.length; j++) {
                //push lyric cards only, since we want fast response time we set the lyric to rid of all punctuation
                newLyricCard = new cardObj(parsed[i], false);
                this.lyricMap.set(cleanString(firstLine), newLyricCard);
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
        if ((this.currPhrase.length) <= (phrase.length)) {
            // get until we have complete sentence
            this.currPhrase = phrase;
        } else {
            // we have a complete sentence
            this.currPhrase = phrase;

            if (this.finishedCard == false) {
                //assuming we haven't finished our card


            } else {
                // we have finished our card
                this.currIndex++;
                this.finishedCard = false;
                this.currCard = this.lyricsInOrder[this.currIndex];

                let simPercentage = 0

                // new card we look at first line
                simPercentage = similarity(this.currCard.firstLine, phrase);
                if (simPercentage > 0.5) {
                    this.stayOnCard = true;
                } else {
                    // we find the closest match 
                    let closestMatch = this.closestMatch(phrase);
                    let lyrics = this.lyricMap.get(closestMatch);
                    this.currCard = lyrics;

                    // in this case want to stay on card
                    this.stayOnCard = true;
                }

            }


            // get the current card

            // verify that the first line is correct
            if (simPercentage > 0.5) {
                // we have a match


                let closestMatch = this.closestMatch(phrase);

                if (closestMatch == -1) {
                    // we return the same phrase
                } else {
                    // we return the closest match
                    let lyrics = this.lyricMap.get(closestMatch);
                    this.currPhrase = lyrics;
                }

                return this.currPhrase;


            }

        }

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