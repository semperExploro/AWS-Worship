import song as song
import worshipSession as worshipSession

prevSentence = ""
worshipSesh = worshipSession.WorshipSession()

def main(lyrics):
    print("bob")
    import realTimeTranscribe as transcribe
    transcribe.main()

def sing(lyrics):
    global worshipSesh
    #print(lyrics.transcript)
    global prevSentence
    #print(len(prevSentence), len(alt.transcript))
    if len(prevSentence) <= len(lyrics.transcript):
        #print("true")
        prevSentence = lyrics.transcript
    else: 
        print(lyrics.transcript)
        returnedValue = worshipSesh.search(lyrics.transcript)

        if returnedValue != None:
            a = 5
            printLyric(returnedValue)
        else: 
            a = 5
            #print("No song found")

def printLyric(line):
    print("LYRICS---------------------")
    for element in line:
        print(element)
    print("---------------------------")

if __name__ == "__main__":
    main(None)