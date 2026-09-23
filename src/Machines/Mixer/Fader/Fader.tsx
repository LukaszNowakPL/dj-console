import * as Slider from '@radix-ui/react-slider';
import './styles.css';

interface FaderProps {
    value: number;
    onChange: (e: number) => void;
    onCtrlClick: () => void;
    min: number;
    max: number;
    step: number;
}

export const Fader: React.FC<FaderProps> = ({value, onChange, onCtrlClick, min, max, step}) => {
    const handleChange = (v: number[]) => {
        onChange(v[0]);
    };
    const handleClick = (click: React.MouseEvent<HTMLDivElement>) => {
        if (onCtrlClick && click.ctrlKey) {
            onCtrlClick();
        }
    };

    return (
        <Slider.Root
            className="SliderRoot"
            orientation="vertical"
            defaultValue={[value]}
            value={[value]}
            max={max}
            min={min}
            step={step}
            onValueChange={handleChange}
            onClick={handleClick}
            aria-label="Stereo control"
        >
            <Slider.Track className="SliderTrack">
                <Slider.Range className="SliderRange" />
            </Slider.Track>

            <Slider.Thumb className="SliderThumb" />
        </Slider.Root>
    );
};
