import type {PlayingControls, PlayingInfo} from '../../types';
import {TextField} from '@radix-ui/themes';
import {AlignLeftIcon} from '@radix-ui/react-icons';

interface LoopLengthFieldProps {
    setLoopLength?: PlayingControls['setLoopLength'];
    loopLength?: PlayingInfo['loopLength'];
}

export const LoopLengthField: React.FC<LoopLengthFieldProps> = ({setLoopLength, loopLength}) => {
    const handleLoopLengthChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (setLoopLength) {
            const value = Number(ev.target.value);
            setLoopLength(Math.max(value, 0));
        }
    };

    return (
        <TextField.Root value={loopLength || ''} onChange={handleLoopLengthChange} mt={'1'}>
            <TextField.Slot>
                <AlignLeftIcon />
            </TextField.Slot>
        </TextField.Root>
    );
};
