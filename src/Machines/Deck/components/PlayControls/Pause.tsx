import type {PlayingControls, TrackState} from '../../types';
import {Button} from '@radix-ui/themes';
import {PauseIcon} from '@radix-ui/react-icons';

interface PauseProps {
    onClick?: PlayingControls['pause'];
    state: TrackState;
}

export const Pause: React.FC<PauseProps> = ({onClick, state}) => {
    const isDisabled = state !== 'playing' || !onClick;
    const variant = state === 'paused' ? 'outline' : 'soft';
    return (
        <Button mt={'1'} disabled={isDisabled} variant={variant} color={'yellow'} onClick={onClick} aria-label={'Pause'}>
            <PauseIcon />
        </Button>
    );
};
