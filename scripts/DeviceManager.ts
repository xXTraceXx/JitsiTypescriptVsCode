import JitsiMeetJS from './lib-jitsi-meet.min.js';

async function checkPermissionsAsync(attachPreviewVideo: boolean = false) {
    try {
        // show GUM
        // TODO: eigentlich an eigener api vorbei?! 
        let videoAndAudioTracks = await JitsiMeetJS.createLocalTracks({ devices: ['video', 'audio'] });

        for (let index = 0; index < videoAndAudioTracks.length; index++) {
            if (attachPreviewVideo && videoAndAudioTracks[index].type === 'video')
            {
                videoAndAudioTracks[index].attach($('#previewVideo')[0]);
                continue;
            }
            else
            {
                videoAndAudioTracks[index].track.stop();
                videoAndAudioTracks[index].dispose();
            }
        }
    }
    catch (e) {
        if (e instanceof DOMException || e.message === 'Permission denied') {
            alert('Please permit camera and audio in your browser settings and fresh the page!');
        }
    }
    finally{
        await _renderDeviceList();
    }
}

async function _renderDeviceList() {
    console.log('enter _renderDeviceList');
    let devices = await _enumJitsiDevicesAsyncWrapper();

    if (!devices)
        return;

    _appendDeviceOptionElements(devices, 'video');
    _appendDeviceOptionElements(devices, 'audio');
}

function _enumJitsiDevicesAsyncWrapper() {
    console.log('enter _enumJitsiDevicesAsyncWrapper');
    return new Promise((resolve, reject) => {
        try {
            JitsiMeetJS.mediaDevices.enumerateDevices((devices) => resolve(devices));
        } catch (error) {
            console.log(error);
            reject();
        }
    });
}

function _appendDeviceOptionElements(allDevices, type) {
    console.log('enter _appendDeviceOption');
    console.log(allDevices);

    const microInputSelect = $('#audioSource');
    const videoInputSelect = $('#videoSource');

    //microInputSelect[0].innerHTML = '';
    //videoInputSelect[0].innerHTML = '';

    let deviceKind = type === 'video' ? 'videoinput' : 'audioinput';
    let inputSelect = type === 'video' ? videoInputSelect : microInputSelect;

    let filteredDevices = allDevices.filter(dev => dev.kind == deviceKind && dev.deviceId != "default" && dev.deviceId != "communications");

    let newOptionElement = document.createElement('option');

    if (!filteredDevices || filteredDevices.length == 0 || filteredDevices[0].deviceId == '') {
        newOptionElement.value = '';
        newOptionElement.text = `No ${type} found or permitted`;
        inputSelect.append(newOptionElement);

        return;
    }

    for (let index = 0; index < filteredDevices.length; ++index) {
        let option = document.createElement('option');
        option.value = filteredDevices[index].deviceId;
        option.text = filteredDevices[index].label;
        inputSelect.append(option);
    }
}

export { checkPermissionsAsync };