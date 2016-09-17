#Speech-to-Text with Node & Watson (WIP)

Simple Node.js integration with the [Watson IBM Bluemix API for Speech to Text](https://www.ibm.com/watson/developercloud/doc/speech-to-text/).

###Dependencies:
- [Foreman](https://ddollar.github.io/foreman/)

- Node/NPM

- Bluemix API Username/Password keys

######Install dependencies:

	npm install
	 
######Place your Bluemix Username/Password keys into a .env file in the root.

	SERVICE_NAME_PASSWORD=yourBluemixPasswordKey
	SERVICE_NAME_USERNAME=yourBluemixUsernameKey
	 
######Place any .WAV (MS) 16-bit Signed LE PCM speech file(s) into /resources directory.
		
######To run:

	foreman run recognize.js

###Note: This will create a real-time file write stream to /results the directory as a similarly named .txt file. Meaning the process will take roughly the same length as the .WAV file, possibly longer.
