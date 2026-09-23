import * as Slider from '@radix-ui/react-slider';
import './KnobControl.styles.css';
import Big from 'big.js';

interface KnobControlProps {
    value: number;
    onChange: (e: number) => void;
    min: number;
    max: number;
    step: number;
    mode?: 'gain' | 'pan';
    onCtrlClick?: () => void;
}
export const KnobControl: React.FC<KnobControlProps> = ({value, onChange, min, max, step, mode = 'gain', onCtrlClick}) => {
    const handleChange = (v: number[]) => {
        onChange(v[0]);
    };
    const handleClick = (click: React.MouseEvent<HTMLDivElement>) => {
        if (onCtrlClick && click.ctrlKey) {
            onCtrlClick();
        }
    };

    // const progress = (value - min) / (max - min);
    const progress = new Big(new Big(value).minus(min)).div(new Big(max).minus(min)).toNumber();
    // const knobMidPoint = KNOB_SCALE / 2
    const knobMidPoint = new Big(KNOB_SCALE).div(2).toNumber();
    // const panZeroEnd = KNOB_SCALE / 40
    const panZeroEnd = new Big(KNOB_SCALE).div(40).toNumber();
    const visualScale = mode === 'gain' ? KNOB_SCALE : knobMidPoint;

    // shift left from 0deg
    const knobStart =
        mode === 'gain'
            ? knobMidPoint
            : progress < 0.5
              ? // ? (visualScale * (0.5 - progress) * 2)
                new Big(visualScale).times(new Big(0.5).minus(progress)).times(2).toNumber()
              : panZeroEnd;
    // shift right from 0deg
    const knobEnd =
        mode === 'gain'
            ? // ? (visualScale * progress) - knobStart
              new Big(new Big(visualScale).times(progress)).minus(knobStart).toNumber()
            : progress <= 0.5
              ? panZeroEnd
              : // : (progress - 0.5) * 2 * visualScale
                new Big(new Big(progress).minus(0.5)).times(2).times(visualScale).toNumber();

    return (
        <div className="KnobControlWrapper">
            <Slider.Root
                className="KnobControlRoot"
                orientation="vertical"
                value={[value]}
                onValueChange={handleChange}
                onClick={handleClick}
                min={min}
                max={max}
                step={step}
                aria-label="Wartość"
                style={
                    {
                        '--knob-start': knobStart,
                        '--knob-end': knobEnd,
                    } as React.CSSProperties
                }
            >
                <div className="KnobControlFace">
                    <div className="KnobControlTrack" />

                    <div className="KnobControlIndicator">
                        <Slider.Thumb className="KnobControlThumb" aria-label="Wartość" />
                    </div>
                </div>
            </Slider.Root>
        </div>
    );
};

const KNOB_SCALE = 270;
