# Auto-Worship Slide Turner

## Description
The goal of this project is to automatically turn the slides for lyrics for a series of slides of music. This is done through speech recognition. 


NOTE: The finalized product does not utilize AWS Transcribe, despite what the repository name suggests. The initial web development has AWS Transcribe, but it was found to be too slow. Web Speech API was used instead. It may be beneficial to switch to Google Cloud Speech API in the future due to better performance. 

As of 5/27, further development of this project has been halted. The project will not continue unless there is an expressed interest due to the complexities involved with finishing this work as mentioned in the `Next Steps` section. Please contact me if you are interested in continuing this project by looking for my email on my website - can be found on profile page.

## Files List 
- `pyDevelopment/` - an early stage proof of concept for using voice recognition to turn slides on a local computer. Utilizes AWS Transcribe to conduct the operation. 

- `webDevloment/src/` - the finalized product. Utilizes the Web Speech API to conduct the operation.

- `worshipSongs/` - a collection of songs that are used to test the program for the python version, in `pyDevelopment/`.

## Running the Program(s)

### Web Version

The web version is the finalized product. It is located in `webDevelopment/src/`.

#### Local Deployment
- open the `index.html` file in a browser. Only works in browsers that support the Web Speech API. Eg. Chrome

#### Remote Deployment
**Deployment Link** - http://ssm-worship.s3-website-us-east-1.amazonaws.com/ [NOTE: link may no longer be available due to AWS storage pricing concerns]

Because this link is unsecure, one has to make an exception by doing the following. This is specifically for chrome. 
- First, paste this link and go - `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
- Then, add the **Deployment Link** above to the list of exceptions.
- Hit the `enable` flag button and restart chrome.

Next, visit the **Deployment Link** and access to your computer's microphone is granted. 

To test out the functionality of the webpage...

First Select a Song
- Click the `Media` button on the top right of the page. 
- Search for a song in the search bar on the left side of the page. 
- Select it, it should appear in the `Set List` section of the page. 
- On the left side of the page, click the `add to set` button. 

Next, begin the voice recognition process
- At the bottom of the page, click the `Auto Slide Turner` button.
- A pop up should appear asking for access to your microphone. Click `Allow`.
- Proceed to sing the song. The slides should turn automatically. You must sing in the order in which the slides are presented under the `lyrics` section. 

**NOTE**: You must pronounce the words clearly and loudly. The program is not perfect and may not recognize the words correctly. Sometimes this requires singing the last line of the verse again to trigger moving to the next slide. 

#### Methodology 
- First, the program check if the user singing the first line by doing a similarity comparision between the user's sung lyrics and the current verse's first line. 
- If the similarity is above a certain threshold, the program will then look for the last line of the verse.
- If the similarity is above a certain threshold for the last verse, it will then move to the next slide.

#### Next Steps
- Adaptability for spontaneous worship - where a singer does not abide by the order of the slides or set order. 
- Better voice recognition.
- Better integration with the original website (see below for link).
- Useability for an entire worship set. 
- Sing along capability (knowing the order of the verses), the current design is simply based on the chord sheet, which does not reflect the order of the actual song. 

#### Credits
This project for web development was originally intended for SSM (Stepping Stone Ministry) at Johns Hopkins University. The original create of the website is Allen Jiang - the original website can be found here - https://github.com/allenjiang17/allenjiang17.github.io 
Reference for recording and voice recongition - https://github.com/zolomohan/speech-recognition-in-javascript/blob/master/speechRecognition.js

#### Pricing Concerns 
- The Web Speech API is free to use. However, it is not as accurate Google Cloud's Speech API. See Google SpeechAPI for more details - https://cloud.google.com/speech-to-text/pricing. Do note that performance may not improve due to the nature of the program (eg. singing)

- The website is hosted on AWS S3. The cost is minimal, but it is not free. See AWS S3 for more details - https://aws.amazon.com/s3/pricing/. Current pricing is 2.17 MB - which warrants a negligible cost.

### Python Version

All of the python files are located in `pyDevelopment/`. This is the early stage proof of concept for using voice recognition to turn slides on a local computer. Utilizes AWS Transcribe to conduct the operation. Not meant for actual use, but rather a quick demo of potential capability. 

#### Requirements [`pip install`]
- Python 3+
- AWS Account and thus `AWS CLI`, `boto3`, `AWS_Transcribe Client - SDK` 
- `pyaudio`

#### Running the Program
- run `worshipMain.py` 
- The only songs available are the ones in `worshipSongs/`. Its designed to test the program's responsiveness, capability for spontaneous worship, and a baseline proof of concept for auto slide turning.

#### Limitations/Notes
 - The program is only capable of recognizing the first line of every verse. Thus, it may randomly change slides in the middle of a verse (it does not know when a verse stops).

#### Credits 
- `realTimeTranscribe.py` - a modified version of  https://github.com/RekhuGopal/PythonHacks/blob/main/AWSBoto3Hacks/Amazon-Transcribe-Streaming/Sample-Transcribe.py
