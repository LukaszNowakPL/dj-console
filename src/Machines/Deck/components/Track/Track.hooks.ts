import {useEffect, useRef, useState} from 'react';
import {parseBlob} from 'music-metadata';
import {useQuery} from '@tanstack/react-query';
import {PlayingControls, PlayingInfo, TrackInfo, TrackState} from '../../types';
import Big from 'big.js';

export type PreparingTrackState =
    'empty' | 'reloading' | 'reading' | 'decoding' | 'reading-metadata' | 'connecting-with-worklet' | 'error' | 'ready';
export type PlayingTrackState = 'not-ready' | 'ready' | 'playing' | 'paused' | 'stopped';

interface UseTrackProps {
    audioCtx: AudioContext;
    lineInput: React.MutableRefObject<GainNode | undefined>;
    file?: File;
    initialTempo: number;
}

export const useTrack = ({audioCtx, lineInput, file, initialTempo}: UseTrackProps) => {
    if (!file) {
        return {state: 'empty' as TrackState};
    }

    const [playingState, setPlayingState] = useState<PlayingTrackState>('not-ready');

    // For reading the file
    const {data: rawData, isError: isFileError} = useFile(file);

    // For decoding the file
    const {decodingState, decodedData} = useDecodedData(audioCtx, rawData);

    // For reading metadata
    const {metadataState, artist, title, picture, pictureFormat} = useMetadata(file);

    // For connecting with player worklet
    const {
        workletState,
        play: workletPlay,
        pause: workletPause,
        stop: workletStop,
        eject,
        position,
        setTempo,
        isLoop,
        toggleLoop,
        loopStart,
        setLoopStart,
        loopLength,
        setLoopLength,
        prepareForTrack,
    } = usePlayerWorklet({audioCtx, lineInput, data: decodedData, initialTempo});

    const preparationState = getPreparationState(isFileError, decodingState, metadataState, workletState, rawData);

    useEffect(() => {
        if (preparationState === 'ready') {
            setPlayingState('ready');
        }
    }, [preparationState]);

    if (preparationState === 'ready') {
        const play = () => {
            if (workletState !== 'ready') return;
            setPlayingState('playing');
            if (workletPlay) {
                workletPlay();
            }
        };

        const pause = () => {
            if (workletState !== 'ready') return;
            setPlayingState('paused');
            if (workletPause) {
                workletPause();
            }
        };

        const stop = () => {
            if (workletState !== 'ready') return;
            setPlayingState('stopped');
            if (workletStop) {
                workletStop();
            }
        };

        const trackInfo: TrackInfo = {
            filename: file!.name,
            artist,
            title,
            picture,
            pictureFormat,
        };

        const playingInfo: PlayingInfo = {
            timeMark: position!,
            // big numbers, no need to use big.js here
            length: decodedData?.getChannelData(0).length! / audioCtx.sampleRate,
            isLoop: isLoop!,
            loopStart: loopStart!,
            loopLength: loopLength!,
        };

        const playingControls: PlayingControls = {
            play,
            pause,
            stop,
            eject: eject!,
            setTempo: setTempo!,
            toggleLoop: toggleLoop!,
            setLoopStart: setLoopStart!,
            setLoopLength: setLoopLength!,
            prepareForTrack: prepareForTrack!,
        };

        return {state: playingState, data: decodedData, trackInfo, playingInfo, playingControls};
    }

    return {state: preparationState};
};

const getPreparationState = (
    isFileError: boolean,
    decodingState: DecodingState,
    metadataState: MetadataState,
    workletState: WorkletState,
    rawData?: ArrayBuffer,
): TrackState => {
    return !rawData
        ? // Reading data
          isFileError
            ? 'error'
            : 'reading'
        : // decoding the file
          decodingState !== 'ready'
          ? decodingState === 'error'
              ? 'error'
              : 'decoding'
          : // reading metadata
            metadataState !== 'ready'
            ? metadataState === 'error'
                ? 'error'
                : 'reading-metadata'
            : // connecting with player worklet
              workletState !== 'ready'
              ? workletState === 'error'
                  ? 'error'
                  : 'connecting-with-worklet'
              : 'ready';
};

/**
 * Private sub-hook for reading the file from a local file system
 */
const useFile = (file?: File) => {
    return useQuery({
        queryKey: ['sample', file?.name],
        queryFn: async () => {
            return await readFile(file);
        },
        refetchOnWindowFocus: false,
        staleTime: Infinity,
    });
};

function readFile(file?: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);

        reader.readAsArrayBuffer(file!);
    });
}

/**
 * Private sub-hook for decoding the file
 */
type DecodingState = 'not-decoded' | 'decoding' | 'ready' | 'error';

const useDecodedData = (audioCtx: AudioContext, data?: ArrayBuffer) => {
    const [decodingState, setDecodingState] = useState<DecodingState>('not-decoded');

    const decodedDataRef = useRef<AudioBuffer>();

    useEffect(() => {
        if (data && data.byteLength !== 0) {
            setDecodingState('decoding');

            audioCtx
                .decodeAudioData(data)
                .then((value: AudioBuffer) => {
                    decodedDataRef.current = value;
                    setDecodingState('ready');
                })
                .catch(() => {
                    setDecodingState('error');
                });
        } else {
            setDecodingState('not-decoded');
            decodedDataRef.current = undefined;
        }
    }, [audioCtx, data]);

    return {decodingState, decodedData: decodedDataRef.current};
};

/**
 * Internal sub-hook for reading metadata of the file
 */
type MetadataState = 'not-read' | 'reading' | 'ready' | 'error';

const useMetadata = (file?: File) => {
    const [metadataState, setMetadataState] = useState<MetadataState>('not-read');
    const [artist, setArtist] = useState<string>();
    const [title, setTitle] = useState<string>();
    const [pictureFormat, setPictureFormat] = useState<string>();

    const pictureRef = useRef<Uint8Array>();

    useEffect(() => {
        if (!file) {
            return;
        }

        setMetadataState('reading');

        parseBlob(file)
            .then((metadata) => {
                setArtist(metadata.common.artist);
                setTitle(metadata.common.title);
                if (metadata.common.picture) {
                    pictureRef.current = metadata.common.picture[0].data;
                    setPictureFormat(metadata.common.picture[0].type);
                }

                setMetadataState('ready');
            })
            .catch(() => {
                setMetadataState('error');
            });
    }, [file]);

    if (metadataState === 'ready') {
        return {metadataState, artist, title, picture: pictureRef.current, pictureFormat};
    }

    return {metadataState};
};

/**
 * Internal sub-hook for connecting with worklet.
 * The use of worklet is crucial for aligning playing and displaying waveform by exposing currently played position.
 */

type WorkletState = 'not-connected' | 'connecting' | 'ready' | 'error';

interface UsePlayerWorkletProps {
    audioCtx: AudioContext;
    lineInput: React.MutableRefObject<GainNode | undefined>;
    data?: AudioBuffer;
    initialTempo: number;
}

const usePlayerWorklet = ({audioCtx, lineInput, data, initialTempo}: UsePlayerWorkletProps) => {
    const [workletState, setWorkletState] = useState<WorkletState>('not-connected');
    // Currently played frame of an audio
    const [frame, setFrame] = useState(0);

    const [isLoop, setIsLoop] = useState<boolean>(false);
    const [loopStart, setLoopStart] = useState<number>(8000);
    const [loopLength, setLoopLength] = useState<number>(4_140);

    const workletRef = useRef<AudioWorkletNode | null>(null);

    useEffect(() => {
        if (!data) {
            return;
        }

        setWorkletState('connecting');

        audioCtx.audioWorklet
            .addModule('/audioPlayer.worklet.js')
            .then(() => {
                const worklet = new AudioWorkletNode(audioCtx, 'audio-player');

                worklet.connect(lineInput.current!);

                workletRef.current = worklet;

                // Message received from worklet
                worklet.port.onmessage = (e) => {
                    if (e.data.type === 'position') {
                        setFrame(e.data.frame);
                    }
                };

                const channels: readonly Readonly<Float32Array>[] = Array.from({length: data.numberOfChannels}, (_, i) =>
                    data.getChannelData(i).slice(),
                );

                worklet.port.postMessage({
                    type: 'load',
                    channels,
                    playbackRate: initialTempo,
                    // big numbers, no need to use big.js here
                    loopStart: (loopStart * audioCtx.sampleRate) / 1_000,
                    loopLength: (loopLength * audioCtx.sampleRate) / 1_000,
                });

                setWorkletState('ready');
            })
            .catch(() => {
                setWorkletState('error');
            });
        /*} else {
            workletRef.current?.port.postMessage('stop')
            workletRef.current?.port.postMessage('eject')
            workletRef.current?.port.close()
            workletRef.current?.disconnect();
            workletRef.current = null;

            return;
        }*/
        return () => {
            /**
             * The cleanup function should stop playing the track, stop the worklet process and disconnect worklet with audio context.
             * The callback is triggered, however, messages are not received for some reason.
             * As this is an experimental PoC I've hacked it by leveling the eject function up, so it's being called during file change.
             * This is crucial for memory management, so the unloaded track could free up some RAM.
             */
            workletRef.current?.port.postMessage('stop');
            workletRef.current?.port.postMessage('eject');
            workletRef.current?.port.close();
            workletRef.current?.disconnect();
            workletRef.current = null;
        };
    }, [data]);

    const play = async () => {
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }
        workletRef.current!.port.postMessage({type: 'play'});
    };

    const pause = () => {
        workletRef.current!.port.postMessage({type: 'pause'});
    };

    const stop = () => {
        workletRef.current!.port.postMessage({type: 'stop'});
    };

    const eject = () => {
        workletRef.current!.port.postMessage({type: 'stop'});
        workletRef.current!.port.postMessage({type: 'eject'});
    };

    const setTempo = (value: number) => {
        workletRef.current!.port.postMessage({
            type: 'rate',
            value,
        });
    };

    const toggleLoop = () => {
        setIsLoop(!isLoop);
        workletRef.current!.port.postMessage({
            type: 'toggle-loop',
        });
    };

    const handleLoopStartChange = (value: number) => {
        const intValue = Math.floor(value);
        setLoopStart(intValue);
        workletRef.current!.port.postMessage({
            type: 'set-loop',
            // big numbers, no need to use big.js here
            loopStart: (intValue * audioCtx.sampleRate) / 1_000,
            loopLength: (loopLength * audioCtx.sampleRate) / 1_000,
        });
    };

    const handleLoopLengthChange = (value: number) => {
        const intValue = Math.floor(value);
        setLoopLength(intValue);
        workletRef.current!.port.postMessage({
            type: 'set-loop',
            // big numbers, no need to use big.js here
            loopStart: (loopStart * audioCtx.sampleRate) / 1_000,
            loopLength: (intValue * audioCtx.sampleRate) / 1_000,
        });
    };

    const prepareForTrack = (newLoopStart: number, newLoopLength: number, newTempo: number) => {
        setLoopStart(newLoopStart);
        setLoopLength(newLoopLength);
        workletRef.current!.port.postMessage({
            type: 'prepare-for-track',
            // big numbers, no need to use big.js here
            loopStart: (newLoopStart * audioCtx.sampleRate) / 1_000,
            loopLength: (newLoopLength * audioCtx.sampleRate) / 1_000,
            tempo: newTempo,
        });
    };

    const position = new Big(frame).div(audioCtx.sampleRate).toNumber();

    if (workletState === 'ready') {
        return {
            workletState,
            position,
            setTempo,
            play,
            pause,
            stop,
            eject,
            isLoop,
            toggleLoop,
            loopStart,
            setLoopStart: handleLoopStartChange,
            loopLength,
            setLoopLength: handleLoopLengthChange,
            prepareForTrack,
        };
    }

    return {workletState};
};
