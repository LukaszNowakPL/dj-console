import {useState} from 'react';
import {Fader} from '../Fader/Fader';
import Big from 'big.js';
import {FADER_MAX, FADER_MIN, FADER_MULTIPLIER} from '../consts';

interface VolumeProps {
    node: React.MutableRefObject<GainNode | undefined>;
    withReset?: boolean;
}

export const FaderController: React.FC<VolumeProps> = ({node, withReset}) => {
    const visualMin = FADER_MIN * FADER_MULTIPLIER;
    const visualMax = FADER_MAX * FADER_MULTIPLIER;

    const [value, setValue] = useState<number>(visualMax);

    const handleChange = (val: number) => {
        const fixedValue = Math.max(Math.min(val, visualMax), visualMin);

        setValue(fixedValue);

        if (node.current) {
            // eslint-disable-next-line react-hooks/immutability
            node.current.gain.value = new Big(fixedValue).div(FADER_MULTIPLIER).toNumber();
        }
    };

    const handleReset = () => {
        if (!!withReset && node.current) {
            setValue(visualMax);
            // eslint-disable-next-line react-hooks/immutability
            node.current.gain.value = FADER_MAX;
        }
    };

    return <Fader value={value} onChange={handleChange} onCtrlClick={handleReset} min={visualMin} max={visualMax} step={1} />;
};
