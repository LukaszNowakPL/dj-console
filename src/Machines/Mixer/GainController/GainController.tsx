import {useState} from 'react';
import {Knob} from '../Knob/Knob';
import Big from 'big.js';
import {GAIN_DEFAULT_MAX, GAIN_DEFAULT_SHOW_VALUE, GAIN_DEFAULT_WITH_CUT, GAIN_MIN, GAIN_MULTIPLIER} from '../consts';

interface GainControllerProps {
    label?: string;
    value: number;
    showValue?: boolean;
    max: number;
    withCut?: boolean;
    withReset?: number;
    node: React.MutableRefObject<GainNode | undefined>;
}

export const GainController: React.FC<GainControllerProps> = ({
    label,
    value: initialValue,
    showValue = GAIN_DEFAULT_SHOW_VALUE,
    max = GAIN_DEFAULT_MAX,
    node,
    withCut = GAIN_DEFAULT_WITH_CUT,
    withReset,
}) => {
    const visualMin = GAIN_MIN * GAIN_MULTIPLIER;
    const visualMax = max * GAIN_MULTIPLIER;

    const [value, setValue] = useState<number>(initialValue * GAIN_MULTIPLIER);
    const [isCut, setIsCut] = useState<boolean>(false);

    const handleChange = (newValue: number) => {
        const fixedValue = Math.max(Math.min(newValue, visualMax), visualMin);

        setValue(fixedValue);

        if (node.current) {
            if (!isCut) {
                // eslint-disable-next-line react-hooks/immutability
                node.current.gain.value = new Big(fixedValue).div(GAIN_MULTIPLIER).toNumber();
            }
        }
    };

    const handleCutToggle = () => {
        if (node.current) {
            // eslint-disable-next-line react-hooks/immutability
            node.current.gain.value = !isCut ? GAIN_MIN : new Big(value).div(GAIN_MULTIPLIER).toNumber();
        }

        setIsCut(!isCut);
    };

    const handleReset = () => {
        if (withReset !== undefined && node.current) {
            setValue(new Big(withReset).times(GAIN_MULTIPLIER).toNumber());
            // eslint-disable-next-line react-hooks/immutability
            node.current.gain.value = withReset;
        }
    };

    const withCutProps = withCut ? {withCut, isCut, onCutToggle: handleCutToggle} : {};

    return (
        <>
            <Knob
                value={value}
                onValueChange={handleChange}
                min={visualMin}
                max={visualMax}
                step={10}
                label={label}
                {...withCutProps}
                onCtrlClick={handleReset}
                showValue={showValue}
            />
        </>
    );
};
