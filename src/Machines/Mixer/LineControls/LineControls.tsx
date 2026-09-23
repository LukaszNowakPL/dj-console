import {useEffect, useRef} from 'react';
import {Box, Grid} from '@radix-ui/themes';
import {CorrectionController} from '../CorrectionController/CorrectionController';
import {GainController} from '../GainController/GainController';
import {PanController} from '../PanController/PanController';
import {FaderController} from '../FaderController/FaderController';

interface LineControlsProps {
    audioCtx: AudioContext;
    input: React.MutableRefObject<GainNode | undefined>;
    output: React.MutableRefObject<GainNode | undefined>;
    orientation?: 'left' | 'right';
}

export const LineControls: React.FC<LineControlsProps> = ({audioCtx, input, output, orientation = 'left'}) => {
    // Main volume (to set once, when track is loaded)
    const gainRef = useRef<GainNode>();

    // Stereo
    const panRef = useRef<StereoPannerNode>();

    // Tone correction - High
    const highGainRef = useRef<GainNode>();
    const highRef = useRef<BiquadFilterNode>();

    // Tone correction - Mid
    // I couldn't figure out values for bandpass, so just aligned lowpass and highpass together
    const midGainRef = useRef<GainNode>();
    const midHighRef = useRef<BiquadFilterNode>();
    const midLowRef = useRef<BiquadFilterNode>();

    // Tone correction - Low
    const lowGainRef = useRef<GainNode>();
    const lowRef = useRef<BiquadFilterNode>();

    // FaderController via up-fader - to play with during mixing
    const faderRef = useRef<GainNode>();

    useEffect(() => {
        if (input.current) {
            const gainControl = audioCtx.createGain();
            gainRef.current = gainControl;

            const panControl = audioCtx.createStereoPanner();
            panRef.current = panControl;

            const lowGainControl = audioCtx.createGain();
            lowGainRef.current = lowGainControl;
            const lowControl = audioCtx.createBiquadFilter();
            lowControl.type = 'lowpass';
            lowControl.frequency.value = 500;
            lowRef.current = lowControl;

            const midGainControl = audioCtx.createGain();
            midGainRef.current = midGainControl;
            const midLowControl = audioCtx.createBiquadFilter();
            midLowControl.type = 'highpass';
            midLowControl.frequency.value = 650;
            midLowRef.current = midLowControl;
            const midHighControl = audioCtx.createBiquadFilter();
            midHighControl.type = 'lowpass';
            midHighControl.frequency.value = 5000;
            midHighRef.current = midHighControl;

            const highGainControl = audioCtx.createGain();
            highGainRef.current = highGainControl;
            const highControl = audioCtx.createBiquadFilter();
            highControl.type = 'highpass';
            highControl.frequency.value = 7000;
            highRef.current = highControl;

            const faderControl = audioCtx.createGain();
            faderRef.current = faderControl;

            // Routing the sound
            // The volume for biquad filters seems not to work.
            // I just split input signal into three parallel channels (per correction registries) and sent them to the stereo panner
            input.current.connect(lowGainControl).connect(lowControl).connect(panControl);
            input.current.connect(midGainControl).connect(midLowControl).connect(midHighControl).connect(panControl);
            input.current.connect(highGainControl).connect(highControl).connect(panControl);

            panControl.connect(faderControl).connect(gainControl).connect(output.current!);
        }
    }, [input, output, audioCtx]);

    return (
        <Grid columns={'2'}>
            {orientation === 'left' && (
                <CorrectionController highGainNode={highGainRef} midGainNode={midGainRef} lowGainNode={lowGainRef} />
            )}
            <Box>
                <GainController node={gainRef} label={'Level'} max={2} value={1} showValue withCut withReset={1} />
                <PanController node={panRef} label={'Pan'} max={1} value={0} showValue withIdle withReset={0} />
                <FaderController node={faderRef} withReset />
            </Box>
            {orientation === 'right' && (
                <CorrectionController highGainNode={highGainRef} midGainNode={midGainRef} lowGainNode={lowGainRef} />
            )}
        </Grid>
    );
};
