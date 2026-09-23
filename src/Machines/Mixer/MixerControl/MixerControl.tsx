import {useEffect, useRef} from 'react';
import {Box, Grid} from '@radix-ui/themes';
import {FaderController} from '../FaderController/FaderController';

interface MixerControlProps {
    audioCtx: AudioContext;
    input: React.MutableRefObject<GainNode | undefined>;
}

export const MixerControl: React.FC<MixerControlProps> = ({audioCtx, input}) => {
    // Main volume (to manipulate during talking)
    const faderRef = useRef<GainNode>();

    useEffect(() => {
        if (input.current) {
            const faderControl = audioCtx.createGain();
            faderRef.current = faderControl;

            // Routing the sound
            input.current.connect(faderControl).connect(audioCtx.destination);
        }
    }, [input, audioCtx]);

    return (
        <Grid columns={'1'}>
            <Box alignSelf={'end'}>
                <FaderController node={faderRef} withReset />
            </Box>
        </Grid>
    );
};
