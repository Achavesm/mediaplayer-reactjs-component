import React from 'react';
import Audios from './Audios.js';
import '../../style/Mediaplayer.css';

class Mediaplayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posIniX: null,
            posIniY: null,
            widthElmnt: null,
            heightElmnt: null,
            widthScreen: null,
            heightScreen: null,
            audio: new Audios(this.props.audios)
        };
    }
    
    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const elem = document.getElementById("boxMediaPlayer");
        elem.addEventListener("mousedown", this.actionDrag);
        window.onresize = this.updateSizeWindow;
        this.state.audio.iniPlayer();
        this.calculateHeightBox(elem, () => {
            this.calculateFontSize(elem);
        });
    }

    calculateFontSize = (boxElmnt) => {
        let widthBox = boxElmnt.clientWidth;
        let size = widthBox * 6.4 / 100;
        document.getElementsByTagName("html")[0].style.fontSize = size + "px";
    }

    calculateHeightBox = (boxElmnt, callback) => {
        let size = "250px";
        if (this.props.size) {
            let checkSize = this.props.size;
            if (checkSize.match(/[0-9]+px|[0-9]+%/g)) {
                size = checkSize;
            } else {
                console.error("Invalid format in 'props.size'. Use '%' or 'px'");
            }
        }
        boxElmnt.style.width = size;
        boxElmnt.style.height = boxElmnt.clientWidth + "px";
        callback(true);
    }

    updateSizeWindow = () => {
        let boxElmnt = document.getElementById("boxMediaPlayer");
        this.calculateHeightBox(boxElmnt, () => {
            this.calculateFontSize(boxElmnt);
            this.setState({
                widthScreen: document.getElementById("boxMediaWrapper").clientWidth,
                heightScreen: document.getElementById("boxMediaWrapper").clientHeight,
            });
            const elem = document.getElementById("boxMediaPlayer");
            elem.style.top = "0px";
            elem.style.left = "0px";
        });
    }

    actionDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        const mediaElmnt = document.getElementById("boxMediaPlayer");
        this.setState({
            posIniX: e.clientX,
            posIniY: e.clientY,
            widthElmnt: mediaElmnt.clientWidth,
            heightElmnt: mediaElmnt.clientHeight,
            widthScreen: document.body.clientWidth,
            heightScreen: document.body.clientHeight
        });
        document.onmouseup = this.removeActionDrag;
        document.onmousemove = this.dragElement;
    }

    dragElement = (e) => {
        e = e || window.event;
        e.preventDefault();
        const mediaElmnt = document.getElementById("boxMediaPlayer");
        let finalPosX = 0;
        let finalPosY = 0;
        if ((mediaElmnt.offsetLeft > 0 || this.state.posIniX < e.clientX) &&
            ((mediaElmnt.offsetLeft + this.state.widthElmnt) < this.state.widthScreen || this.state.posIniX > e.clientX)) {
            let newPosX = this.state.posIniX - e.clientX;
            this.setState({ posIniX: e.clientX });
            finalPosX = (mediaElmnt.offsetLeft - newPosX);
        } else if (mediaElmnt.offsetLeft + this.state.widthElmnt >= this.state.widthScreen) {
            finalPosX = (this.state.widthScreen - this.state.widthElmnt);
        }
        if ((mediaElmnt.offsetTop > 0 || this.state.posIniY < e.clientY) && 
            ((mediaElmnt.offsetTop + this.state.heightElmnt) < this.state.heightScreen || this.state.posIniY > e.clientY)) {
            let newPosY = this.state.posIniY - e.clientY;
            this.setState({ posIniY: e.clientY });
            finalPosY = (mediaElmnt.offsetTop - newPosY);
        } else if (mediaElmnt.offsetTop + this.state.heightElmnt >= this.state.heightScreen) {
            finalPosY = (this.state.heightScreen - this.state.heightElmnt);
        }
        mediaElmnt.style.top = finalPosY + "px";
        mediaElmnt.style.left = finalPosX + "px";
    }

    removeActionDrag = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        this.setState({
            posIniX: null,
            posIniY: null
        });
    }

    render() {
        return (
            <div id="boxMediaWrapper" className="boxMediaWrapper">
                <div id ="boxMediaPlayer" className="Box-media-player flexBox contentCenter">
                    <svg>
                        <circle className="Back-bar" cx="50%" cy="50%" r="43%" />
                        <circle id="progressBar" className="Progress-bar" cx="50%" cy="50%" r="43%" />
                    </svg>
                    <div id="info-buttons" className="info-buttons flexBox contentCenter">
                        <div id="currentTime" className="time">00:00</div>
                        <div id="totalTime" className="totalTime">00:00</div>
                        <div id="audioTitle" className="audioTitle"></div>
                    </div>
                    <div className="controls flexBox contentCenterH">
                        <div className="playerBtns flexBox contentCenter">
                            <img id="prevBtn" className="disabled" alt="Previous" title="Previous" onClick={() => this.state.audio.changeAudio("prev")} src={require('../../assets/img/prev.png')}></img>
                            <img id="playBtn" className="playBtn" alt="Play" title="Play" onClick={() => this.state.audio.pauseAudio(false)} src={require('../../assets/img/play.png')}></img>
                            <img id="pauseBtn" className="pauseBtn hidden" alt="Pause" title="Pause" onClick={() => this.state.audio.pauseAudio(true)} src={require('../../assets/img/pause.png')}></img>
                            <img id="nextBtn" alt="Next" title="Next" onClick={() => this.state.audio.changeAudio("next")} src={require('../../assets/img/next.png')}></img>
                        </div>
                    </div>
                </div>
                {/* <audio id="audioTag"></audio> */}
            </div>
        );
    }
}

export default Mediaplayer;