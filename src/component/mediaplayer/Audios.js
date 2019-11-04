class Audios {

    constructor(audioObj) {
        this.audioElmnt = document.createElement("audio");
        this.titleElem = null;
        this.totalTimeElmnt = null;
        this.currentTimeElmnt = null;
        this.totalTime = 0;
        this.currentTimeIntv = null;
        this.progressBarElmnt = null;
        this.audios = audioObj;
        this.currentAudio = 1;
        this.audioFile = null;
        this.play = false;
    }

    iniPlayer = () => {
        this.titleElem = document.getElementById("audioTitle");
        this.totalTimeElmnt = document.getElementById("totalTime");
        this.currentTimeElmnt = document.getElementById("currentTime");
        this.progressBarElmnt = document.getElementById("progressBar");
        this.setAudio();
        this.loadEvents();
    }

    loadEvents = ()  => {
        this.audioElmnt.addEventListener("playing", () => {
            this.currentTime(true);
        });
        this.audioElmnt.addEventListener("ended", () => {
            this.currentTime(false);
            let sizeObj = Object.keys(this.audios).length;
            if (this.currentAudio < sizeObj) {
                this.changeAudio("next");
            } else {
                this.changeControls();
                this.play = false;
                setTimeout(() => {
                    this.resetPlayer();
                }, 1000);
            }
        });
        this.audioElmnt.addEventListener("pause", () => {
            this.currentTime(false);
        });
    }

    setAudio = () => {
        let audio = this.audios["audio" + this.currentAudio];
        this.titleElem.innerHTML = audio.title + " - " + audio.artist;
        this.audioFile = require('../../assets/audio/' + audio.src);
        this.loadAudio();
    }

    changeAudio = (action) => {
        this.totalTime = "00:00";
        this.totalTimeElmnt.innerHTML = "00:00";
        if (action === "next") {
            this.currentAudio++;
        } else if (action === "prev") {
            this.currentAudio--;
        }
        this.setAudio();
        document.getElementById("nextBtn").classList.remove("disabled");
        document.getElementById("prevBtn").classList.remove("disabled");
        let sizeObj = Object.keys(this.audios).length;
        if (sizeObj === this.currentAudio && this.currentAudio > 1) {
            document.getElementById("nextBtn").classList.add("disabled");
        } else if (this.currentAudio === 1) {
            document.getElementById("prevBtn").classList.add("disabled");
        }
    }

    loadAudio = () => {
        this.audioElmnt.src = this.audioFile;
        setTimeout(() => {
            this.dataAudio();
            if (this.play) {
                this.audioElmnt.play();
            }
        }, 500);
    }

    pauseAudio = (action) => {
        if (action) {
            this.audioElmnt.pause();
            this.play = false;
        } else {
            this.audioElmnt.play();
            this.play = true;
        }
        this.changeControls();
    }

    changeControls = () => {
        document.getElementById("playBtn").classList.toggle("hidden");
        document.getElementById("pauseBtn").classList.toggle("hidden");
    }

    dataAudio = () => {
        this.totalTime = this.audioElmnt.duration;
        this.totalTimeElmnt.innerHTML = this.parseTime(this.totalTime);
    }

    parseTime = (sec) => {
        let minutes = Math.floor(sec / 60);
        minutes = ("0" + minutes).slice(-2);
        let seconds = Math.round(sec - minutes * 60);
        seconds = ("0" + seconds).slice(-2);
        return minutes + ":" + seconds;
    }

    currentTime = (action) => {
        if (action) {
            this.currentTimeIntv = setInterval(() => {
                let current = this.audioElmnt.currentTime;
                this.currentTimeElmnt.innerHTML = this.parseTime(current);
                let percentActual = (current * 100) / this.totalTime;
                let percentProgressBar = (271 * percentActual) / 100;
                this.progressBarElmnt.style.strokeDasharray = percentProgressBar + "% 271%";
            }, 100);
        } else {
            clearInterval(this.currentTimeIntv);
        }
    }

    resetPlayer = () => {
        this.progressBarElmnt.style.strokeDasharray = "0% 271%";
        this.currentTimeElmnt.innerHTML = "00:00";
    }
}

export default Audios;