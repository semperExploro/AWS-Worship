import json as json
import song as Song
from difflib import SequenceMatcher


class WorshipSession:

    def __init__(self,listOfSongs = None):
        self.listOfSongs = []
        self.numSongs = 0
        self.addSong("Do_It_Again")
        self.addSong("Touch_Of_Heaven")

    def addSong(self,song):
        # TODO add error handling
        newSong = Song.Song(song)
        newSong.loadSet((song+".txt"))
        self.listOfSongs.append(newSong)
        self.numSongs += 1

    def removeSong(self,song):
        self.listOfSongs.remove(song)
        self.numSongs -= 1
    
    def search(self,input):
        for song in self.listOfSongs:
            for line in song.lyrics:
                if similar(input, line) > 0.5:
                    return song.lyrics[line]
        return None
    
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

    # TODO additional functionality for WorshipSession class