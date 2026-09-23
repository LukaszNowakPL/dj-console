import {useState} from 'react';
import {Knob} from '../Knob/Knob';
import Big from 'big.js';
import {PAN_DEFAULT_MAX, PAN_MIN, PAN_MULTIPLIER, PAN_DEFAULT_SHOW_VALUE, PAN_DEFAULT_WITH_OFF} from '../consts';

interface StereoControllerProps {
    label?: string;
    value: number;
    showValue?: boolean;
    max: number;
    withIdle?: boolean;
    withReset?: number;
    node: React.MutableRefObject<StereoPannerNode | undefined>;
}

export const PanController: React.FC<StereoControllerProps> = ({
    label,
    value: initialValue,
    showValue = PAN_DEFAULT_SHOW_VALUE,
    max = PAN_DEFAULT_MAX,
    node,
    withIdle = PAN_DEFAULT_WITH_OFF,
    withReset,
}) => {
    const visualMin = PAN_MIN * PAN_MULTIPLIER;
    const visualMax = max * PAN_MULTIPLIER;

    const [value, setValue] = useState<number>(initialValue * PAN_MULTIPLIER);
    const [isIdle, setIsIdle] = useState<boolean>(false);

    const handleChange = (newValue: number) => {
        const fixedValue = Math.max(Math.min(newValue, visualMax), visualMin);

        setValue(fixedValue);

        if (node.current) {
            if (!isIdle) {
                // eslint-disable-next-line react-hooks/immutability
                node.current.pan.value = new Big(fixedValue).div(PAN_MULTIPLIER).toNumber();
            }
        }
    };

    const handleIdleToggle = () => {
        if (node.current) {
            // eslint-disable-next-line react-hooks/immutability
            node.current.pan.value = !isIdle ? 0 : new Big(value).div(PAN_MULTIPLIER).toNumber();
        }

        setIsIdle(!isIdle);
    };

    const handleReset = () => {
        if (withReset !== undefined && node.current) {
            setValue(new Big(withReset).times(PAN_MULTIPLIER).toNumber());
            // eslint-disable-next-line react-hooks/immutability
            node.current.pan.value = withReset;
        }
    };

    const withIdleProps = withIdle ? {withIdle, isIdle, onIdleToggle: handleIdleToggle} : {};

    return (
        <>
            <Knob
                value={value}
                onValueChange={handleChange}
                min={visualMin}
                max={visualMax}
                step={10}
                label={label}
                {...withIdleProps}
                onCtrlClick={handleReset}
                showValue={showValue}
                mode={'pan'}
            />
        </>
    );
};
