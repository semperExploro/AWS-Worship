class CardObj {

    /*
    Class Representation of a lyric Card
    * @param {String} lyrics - the lyrics of the card
    * @param {Boolean} isTitleCard - is this a title card
    */
    constructor(lyrics, isTitleCard) {
        this.lyrics = lyrics;

        let totalArr = lyrics.split("\n");


        this.firstLine = this.setFirstLine(totalArr);
        this.lastLine = this.setLastLine(totalArr);
        this.isTitleCard = isTitleCard;
        
    }

    /*
    * set the first line of the card
    * @param {String} lyrics - the lyrics of the card
    */
    setFirstLine(lyrics) {
        return lyrics[0];
    }

    /*
    * set the last line of the card
    * @param {String} lyrics - the lyrics of the card
    */
    setLastLine(lyrics) {
        if (lyrics.length == 1) {
            // first line is the last line
            return this.firstLine;
        } else {
            // second to last line is the last line
            let totalLength = lyrics.length;
            return lyrics[totalLength - 1];
        }
    }




}

