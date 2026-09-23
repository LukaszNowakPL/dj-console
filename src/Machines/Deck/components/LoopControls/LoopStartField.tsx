import type {PlayingControls, PlayingInfo} from '../../types';
import {TextField} from '@radix-ui/themes';
import {AlignLeftIcon} from '@radix-ui/react-icons';

interface LoopStartFieldProps {
    setLoopStart?: PlayingControls['setLoopStart'];
    loopStart?: PlayingInfo['loopStart'];
}

export const LoopStartField: React.FC<LoopStartFieldProps> = ({setLoopStart, loopStart}) => {
    const handleLoopStartChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (setLoopStart) {
            const value = Number(ev.target.value);
            setLoopStart(Math.max(value, 0));
        }
    };

    return (
        <TextField.Root value={loopStart || ''} onChange={handleLoopStartChange} mt={'1'}>
            <TextField.Slot>
                <AlignLeftIcon />
            </TextField.Slot>
        </TextField.Root>
    );
};
