import { JitsiMeetJS } from './lib-jitsi-meet.min';
import { joinServer } from './JitsiConnector';
import { createLocalTrack } from './TrackManager';


$(async () => {

  await joinServer('https://meet.beamstream.eu/http-bind');

  $('#startVideo').on('click', async () => {
    let newVideo = await createLocalTrack('video');

    console.log(newVideo);
    
    newVideo.attach($('#expertVideo')[0]);
  });

  $('#stopVideo').on('click', () => {
    let video = document.getElementById('expertVideo');
    // @ts-ignore
    video.pause();
    // @ts-ignore
    video.srcObject = null;
    // @ts-ignore
    video.load();
  });
})



