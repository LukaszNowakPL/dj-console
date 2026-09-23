import type {DeckControls} from '../../types';
import {TEMPO_CONTROLLER_VALUE_MAX, TEMPO_CONTROLLER_VALUE_MIN} from '../../consts';
import {Box, Text} from '@radix-ui/themes';
import * as Slider from '@radix-ui/react-slider';
import './TempoController.styles.css';
import Big from 'big.js';

interface TempoControllerProps {
    tempo: DeckControls['tempo'];
    onTempoChange: DeckControls['onTempoChange'];
}

export const TempoController: React.FC<TempoControllerProps> = ({tempo, onTempoChange}) => {
    const progress = new Big(new Big(tempo).minus(TEMPO_CONTROLLER_VALUE_MIN))
        .div(new Big(TEMPO_CONTROLLER_VALUE_MAX).minus(TEMPO_CONTROLLER_VALUE_MIN))
        .toNumber();
    const sliderAccentTop = progress > 0.5 ? new Big(new Big(1).minus(progress)).times(SLIDER_SCALE).toNumber() : 50;
    const sliderAccentBottom = progress > 0.5 ? 50 : new Big(progress).times(SLIDER_SCALE);
    // For better visibility
    // const progress = (tempo - TEMPO_CONTROLLER_VALUE_MIN) / (TEMPO_CONTROLLER_VALUE_MAX - TEMPO_CONTROLLER_VALUE_MIN)
    // const sliderAccentTop = progress > .5 ? (1 - progress) * SLIDER_SCALE : 50
    // const sliderAccentBottom = progress > .5 ? 50 : progress * SLIDER_SCALE

    const tempoSidePart = `${tempo > 1 ? '+' : ''}`;
    // For better visibility
    // ${((tempo - 1) * 100).toFixed(1)
    const tempoValuePart = `${new Big(new Big(tempo).minus(1)).times(100).toFixed(1)}`;
    const tempoVisual = `${tempoSidePart}${tempoValuePart}%`;

    const handleTempoChange = (val: number[]) => {
        const scaledValue = Math.max(
            TEMPO_CONTROLLER_VALUE_MIN,
            Math.min(TEMPO_CONTROLLER_VALUE_MAX, new Big(val[0]).div(SLIDER_SCALE).toNumber()),
        );
        onTempoChange(scaledValue);
    };
    return (
        <>
            <Box>
                <Slider.Root
                    className="TempoControllerRoot"
                    orientation="vertical"
                    defaultValue={[tempo * SLIDER_SCALE]}
                    value={[tempo * SLIDER_SCALE]}
                    max={TEMPO_CONTROLLER_VALUE_MAX * SLIDER_SCALE}
                    min={TEMPO_CONTROLLER_VALUE_MIN * SLIDER_SCALE}
                    step={0.1}
                    onValueChange={handleTempoChange}
                    aria-label="Tempo control"
                    style={
                        {
                            '--track-tempo-slider-top': sliderAccentTop,
                            '--track-tempo-slider-bottom': sliderAccentBottom,
                        } as React.CSSProperties
                    }
                >
                    <Slider.Track className="TempoControllerTrack">
                        <Slider.Range className="TempoControllerRange" />
                    </Slider.Track>

                    <Slider.Thumb className="TempoControllerThumb" />
                </Slider.Root>
            </Box>
            <Box mt={'2'}>
                <Text size={'1'} as={'p'} align={'center'}>
                    {tempoVisual}
                </Text>
            </Box>
        </>
    );
};
const SLIDER_SCALE = 100;
