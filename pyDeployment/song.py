HEADER = "worshipSongs/"
EXTENSION = ".txt"


class Song:
    def __init__(self, title):
        self.title = title
        self.lyrics = {}

    def loadSet(self, fileName):

        set = []
        f = open(HEADER+fileName, "r")
        rawLyrics = f.readlines()
        for line in rawLyrics:
            set.append(line)
            if(line == '\n'):
                self.lyrics[set[0]] = set
                set = []
