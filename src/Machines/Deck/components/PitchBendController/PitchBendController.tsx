import {PITCH_BEND_CONTROLLER_VALUE_MAX, PITCH_BEND_CONTROLLER_VALUE_MIN} from '../../consts';
import * as Slider from '@radix-ui/react-slider';
import {DeckControls} from '../../types';
import './PitchBend.styles.css';
import Big from 'big.js';

interface PitchBendControllerProps {
    pitchBend: DeckControls['pitchBend'];
    onPitchBendChange: DeckControls['onPitchBendChange'];
}

export const PitchBendController: React.FC<PitchBendControllerProps> = ({pitchBend, onPitchBendChange}) => {
    const progress = new Big(new Big(pitchBend).minus(PITCH_BEND_CONTROLLER_VALUE_MIN))
        .div(new Big(PITCH_BEND_CONTROLLER_VALUE_MAX).minus(PITCH_BEND_CONTROLLER_VALUE_MIN))
        .toNumber();
    const sliderAccentTop = progress > 0.5 ? new Big(new Big(1).minus(progress)).times(SLIDER_SCALE).toNumber() : 50;
    const sliderAccentBottom = progress > 0.5 ? 50 : new Big(progress).times(SLIDER_SCALE);
    // For better visibility
    // const progress = (pitchBend - PITCH_BEND_CONTROLLER_VALUE_MIN) / (PITCH_BEND_CONTROLLER_VALUE_MAX - PITCH_BEND_CONTROLLER_VALUE_MIN)
    // const sliderAccentTop = progress > .5 ? (1 - progress) * SLIDER_SCALE : 50
    // const sliderAccentBottom = progress > .5 ? 50 : progress * SLIDER_SCALE

    const handlePitchBendChange = (val: number[]) => {
        const scaledValue = Math.max(
            PITCH_BEND_CONTROLLER_VALUE_MIN,
            Math.min(PITCH_BEND_CONTROLLER_VALUE_MAX, new Big(val[0]).div(SLIDER_SCALE).toNumber()),
        );
        onPitchBendChange(scaledValue);
    };

    const handlePitchBendFinish = () => {
        handlePitchBendChange([0]);
    };
    return (
        <Slider.Root
            className="PitchBendRoot"
            orientation="vertical"
            value={[pitchBend * SLIDER_SCALE]}
            defaultValue={[pitchBend * SLIDER_SCALE]}
            max={PITCH_BEND_CONTROLLER_VALUE_MAX * SLIDER_SCALE}
            min={PITCH_BEND_CONTROLLER_VALUE_MIN * SLIDER_SCALE}
            step={0.1}
            onValueChange={handlePitchBendChange}
            onValueCommit={handlePitchBendFinish}
            aria-label="Pitch bend control"
            style={
                {
                    '--track-pitch-bend-slider-top': sliderAccentTop,
                    '--track-pitch-bend-slider-bottom': sliderAccentBottom,
                } as React.CSSProperties
            }
        >
            <Slider.Track className="PitchBendTrack">
                <Slider.Range className="PitchBendRange" />
            </Slider.Track>

            <Slider.Thumb className="PitchBendThumb" />
        </Slider.Root>
    );
};
const SLIDER_SCALE = 100;
