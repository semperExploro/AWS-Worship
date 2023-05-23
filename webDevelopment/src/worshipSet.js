class WorshipSet {
    /*
        Class definition of a worship set
    */

    /*
        Initialize a worship set with a list of song IDs
        @param listOfSongID: list of song IDs for starting the worship set
    */
    constructor() {
        this.listOfSongID = [];
    }

    /*
        Set the list of songs for the worship set
        @param list_of_songs: list of song IDs for the worship set
    */
    addSongsThroughList(list_of_songs) {
        for (let i = 0; i < list_of_songs.length; i++) {
            this.addSong(list_of_songs[i]);
        }
    }

    /*
        Add a song to the worship set
        @param songID: ID of the song to be added
    */
    addSong(songID) {
        this.listOfSongID.push(songID);
    }

    /*
        Prints existing songs
    */
    listAllSongs() {
        console.log(this.listOfSongID);
    }

}