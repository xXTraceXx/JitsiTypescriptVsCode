import { JitsiConference } from './JitsiConnector';
import JitsiMeetJS from './lib-jitsi-meet.min.js';

type JitsiTrack = {
    addEventListener: Function;
    removeEventListener: Function;
    containers: [];
    deviceId: String;
    resolution: Number;
    stream: MediaStream;
    track: MediaStreamTrack;
    type: 'audio' | 'presenter' | 'video';
    videoType: 'camera' | 'desktop';
    disposed: boolean;
    getVideoType: Function;
    attach: Function;
}

async function createLocalTrack(trackType: 'audio' | 'video' | 'desktop'): Promise<JitsiTrack> {
    try {

        let newTrack = await JitsiMeetJS.createLocalTracks({ devices: [trackType] });

        return newTrack[0];
    } catch (error) {
        console.error(error);

        throw error;
    }
}

async function setTracksLive(newTracks: any) {
    console.log('enter setTracksLive');
    console.log(newTracks);

    try {

        for (let index = 0; index < newTracks.length; index++) {
            await JitsiConference.addTrack(newTracks[index]);
        }
    } catch (error) {
        console.log(error);

        throw error;
    }
}

async function setTracksOffline() {
    let allTracks = JitsiConference.getLocalTracks();

    for (let index = 0; index < allTracks.length; index++) {
        await JitsiConference.removeTrack(allTracks[index]);
    }
}

async function muteVideoTrack() {
    let videoTrack = JitsiConference.getLocalVideoTrack();

    if (!videoTrack) {
        console.warn('no videoTracks to mute found');
        return;
    }

    await videoTrack.mute();
}

async function unMuteVideoTrack() {
    let videoTrack = JitsiConference.getLocalVideoTrack();

    await videoTrack.unmute();
}

async function unMuteAudioTrack() {
    let audioTrack = JitsiConference.getLocalAudioTrack();

    if (!audioTrack) {
        console.warn('no audioTracks to unmute found');
        return;
    }

    await audioTrack.unmute();
}

async function muteAudioTrack() {
    let audioTrack = JitsiConference.getLocalAudioTrack();

    if (!audioTrack) {
        console.warn('no audioTracks to unmute found');
        return;
    }

    await audioTrack.mute();
}

function addRemoteTracksEventListener(eventhandler: Function) {
    console.log('added remote track event handler');
    console.log(JitsiConference);
    JitsiConference.on(JitsiMeetJS.events.conference.TRACK_ADDED, eventhandler);
}

export {
    createLocalTrack,
    setTracksLive,
    addRemoteTracksEventListener,
    muteAudioTrack,
    unMuteAudioTrack,
    muteVideoTrack,
    unMuteVideoTrack
};