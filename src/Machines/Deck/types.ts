import {PlayingTrackState, PreparingTrackState} from './components/Track/Track.hooks';

export interface DeckControls {
    tempo: number;
    onTempoChange: (value: number) => void;
    pitchBend: number;
    onPitchBendChange: (value: number) => void;
    onFileChange: (file: File) => void;
    deckId: string;
}

export type PlayingControls = {
    play: () => void;
    pause: () => void;
    stop: () => void;
    eject: () => void;
    setTempo: (value: number) => void;
    toggleLoop: () => void;
    setLoopStart: (value: number) => void;
    setLoopLength: (value: number) => void;
    prepareForTrack: (loopStart: number, loopLength: number, tempo: number) => void;
};
export type PlayingInfo = {
    timeMark: number;
    length: number;
    isLoop: boolean;
    loopStart: number;
    loopLength: number;
};

export interface TrackInfo {
    filename: string;
    artist?: string;
    title?: string;
    picture?: Uint8Array<ArrayBufferLike>;
    pictureFormat?: string;
}

export type TrackState = PreparingTrackState | PlayingTrackState;
