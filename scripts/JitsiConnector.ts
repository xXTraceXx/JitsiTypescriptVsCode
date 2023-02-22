import JitsiMeetJS from './lib-jitsi-meet.min.js';

type JitsiMeetJS = {
    init: Function;
    JitsiConnection: JitsiConnection;
    connect: Function;
    disconnect: Function;
};

type JitsiConnection = {
    connect: Function;
    disConnect: Function;
    initJitsiConference: Function;
    addEventListener: Function;
    removeEventListener: Function;
};

let JitsiConnection: any;
let JitsiConference: any;

function initializeJitsi(): boolean {
    try {
        JitsiMeetJS.init();

        JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

        return true;
    } catch (errorMsg) {
        console.error(errorMsg);
        return false;
    }
}

async function joinServer(serverURL: string): Promise<void> {
    let options = {
        hosts: {
            domain: 'meet.jitsi',
            muc: 'muc.meet.jitsi'
        },
        bosh: serverURL
    };

    return new Promise((resolve, reject) => {
        try {
            JitsiConnection = new JitsiMeetJS.JitsiConnection(null, null, options);

            JitsiConnection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, () => {
                console.info('jitsi connection established successfully');
                resolve();
            });

            JitsiConnection.connect();
        } catch (errorMsg) {
            console.error(errorMsg);
            reject();
        }
    })
}

async function joinJitsiRoom(): Promise<void> {
    try {
        if (!JitsiConference)
            throw Error("Conference has not been initialized, please call initJitsiRoom before!");

        await JitsiConference.join();
    }
    catch (errorMsg) {
        console.error(errorMsg);
    }
}

async function leaveJitsiRoom(): Promise<void> {
    if (!JitsiConference)
        throw new Error("JitsiConference is not initialised!");

    try {
        await JitsiConference.leave();
        console.info('left room successfully...');
    } catch (e) {
        console.error('leaving jitsi room failed...');
        console.error(e);
    }
}

// TODO: Evtl in eine JitsiRoomAdmin auslagern?
function kickGuest(participantID: string) {
    if (!JitsiConference)
        throw new Error("JitsiConference is not initialised!");

    try {
        JitsiConference.kickParticipant(participantID, 'You have been kicked');
    } catch (e) {
        console.error('kicking guest failed...');
        console.error(e);
    }

    console.info('kicking guest was successfull');
}

// TODO: Evtl in eine JitsiRoomAdmin auslagern?
async function lockRoom(secret: string) {
    console.log('enter lockRoom');
    console.log(secret);
    if (!JitsiConference)
        throw new Error("JitsiConference is not initialised!");

    try {
        await JitsiConference.lock(secret);
        console.info('locking room was successfull');
    } catch (e) {
        console.error('locking room failed...');
        console.error(e);
    }
}

function getAllParticipant(): any[] {
    return JitsiConference.getParticipants();
}

function getParticipantIdsByProperty(key: string, value: string): string[] {
    return getAllParticipant().filter(o => o._properties[key] === value).map(o => o._id);
}

function setOwnParticipantRole(role: 'guest' | 'expert'): void {
    JitsiConference.setLocalParticipantProperty('role', role);
}

// TODO: Evtl in eine JitsiRoomAdmin auslagern?
async function unlockRoom() {
    if (!JitsiConference)
        throw new Error("JitsiConference is not initialised!");

    try {
        await JitsiConference.unlock();
    } catch (e) {
        console.error('unlocking room failed...');
        console.error(e);
    }

    console.info('unlocking room was successfull');
}

function initJitsiRoom(roomID: string, secret?: string | null): boolean {
    try {
        JitsiConference = JitsiConnection.initJitsiConference(roomID, { openBridgeChannel: true, p2p: { enabled: false } });

        return true;
    } catch (errorMsg) {
        console.error(errorMsg);

        return false;
    }
}

initializeJitsi() ? console.info('jitsi initialized successfully') : console.error('jitsi initialization failed');

export {
    joinServer,
    initJitsiRoom,
    joinJitsiRoom,
    JitsiConference,
    leaveJitsiRoom,
    kickGuest,
    setOwnParticipantRole,
    getParticipantIdsByProperty,
    lockRoom,
    unlockRoom
};