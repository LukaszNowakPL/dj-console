import {Container, Grid, Section} from '@radix-ui/themes';
import {LineControls} from './LineControls/LineControls';
import {MixerControl} from './MixerControl/MixerControl';

interface MixerProps {
    audioCtx: AudioContext;
    inputs: React.MutableRefObject<GainNode | undefined>[];
    mixerInput: React.MutableRefObject<GainNode | undefined>;
}

export const Mixer: React.FC<MixerProps> = ({audioCtx, inputs: [line1, line2], mixerInput}) => {
    return (
        <Section px={'2'} py={'4'}>
            <Container size={'4'} align={'center'}>
                <Grid columns={'4'} gap={'1'} width={'auto'}>
                    <div />
                    <LineControls audioCtx={audioCtx} input={line1} output={mixerInput} orientation={'left'} />
                    <LineControls audioCtx={audioCtx} input={line2} output={mixerInput} orientation={'right'} />
                    <MixerControl audioCtx={audioCtx} input={mixerInput} />
                </Grid>
            </Container>
        </Section>
    );
};
