import {Card, Flex} from '@radix-ui/themes';
import {useTrack} from './Track.hooks';
import './Track.styles.css';
import {TRACK_SECTIONS_BREAKPOINT, WAVEFORM_CANVAS_WIDTH} from '../../consts';
import type {DeckControls} from '../../types';
import {TrackController} from '../TrackController/TrackController';
import {WaveformContainer} from '../WaveformContainer/WaveformContainer';
import Big from 'big.js';

interface TrackProps {
    file?: File;
    audioCtx: AudioContext;
    lineInput: React.MutableRefObject<GainNode | undefined>;
    deckControls: DeckControls;
}

export const Track: React.FC<TrackProps> = ({file, audioCtx, lineInput, deckControls}) => {
    const {state, data, trackInfo, playingInfo, playingControls} = useTrack({
        audioCtx,
        lineInput,
        file,
        initialTempo: deckControls.tempo + deckControls.pitchBend,
    });

    const handleFileChange = (e: File) => {
        // Ejecting is important for memory management. It cleans up worklet things.
        playingControls?.eject();
        deckControls.onFileChange(e);
    };

    const handleTempoChange = (value: number) => {
        // Setting tempo on the worklet so it plays accordingly
        playingControls?.setTempo(new Big(value).plus(deckControls.pitchBend).toNumber());
        // Setting tempo on Deck's state so it's shared between tracks
        deckControls.onTempoChange(value);
    };

    const handlePitchBendChange = (value: number) => {
        // Adding value of pitch bend to the overall tempo on the worklet
        playingControls?.setTempo(new Big(deckControls.tempo).plus(value).toNumber());
        // Setting pitch bend value on Deck's state
        deckControls.onPitchBendChange(value);
    };

    const handleTrackChange = (loopStart: number, loopLength: number, tempo: number) => {
        // Setting right data on the worklet so it plays and loops accordingly
        playingControls?.prepareForTrack(loopStart, loopLength, tempo);
        // Setting tempo on Deck's state so it's shared between tracks
        deckControls.onTempoChange(tempo);
    };

    const adjustedDeckControls = {
        ...deckControls,
        onTempoChange: handleTempoChange,
        onPitchBendChange: handlePitchBendChange,
        onFileChange: handleFileChange,
    };

    const adjustedPlayingControls = {
        ...playingControls!,
        prepareForTrack: handleTrackChange,
    };

    return (
        <Flex
            gap={'1'}
            width={'auto'}
            style={
                {
                    '--track-sections-breakpoint': TRACK_SECTIONS_BREAKPOINT,
                } as React.CSSProperties
            }
        >
            <Card className={'TrackControllerCard'}>
                <TrackController
                    trackInfo={trackInfo}
                    playingInfo={playingInfo}
                    playingControls={adjustedPlayingControls}
                    state={state}
                    deckControls={adjustedDeckControls}
                />
            </Card>
            <Card
                style={
                    {
                        '--waveform-canvas-width': WAVEFORM_CANVAS_WIDTH,
                    } as React.CSSProperties
                }
                className={'WaveformContainerCard'}
            >
                <WaveformContainer state={state} data={data} playingInfo={playingInfo!} />
            </Card>
        </Flex>
    );
};
