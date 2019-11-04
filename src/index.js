import React from 'react';
import ReactDOM from 'react-dom';
import Mediaplayer from './component/mediaplayer/Mediaplayer';

const audioObj = {
    audio1: {title: "Zero", artist: "The Smashing Pumpkins", src: "Zero.mp3"},
    audio2: {title: "Ready to Go", artist: "Supagroup", src: "Ready to Go - Supagroup.mp3"},
    audio3: {title: "Born to be wild", artist: "Steppenwolf", src: "Steppenwolf - Born To Be Wild.mp3"}
}

ReactDOM.render(<Mediaplayer audios={audioObj} size="270px" />, document.getElementById('root'));
