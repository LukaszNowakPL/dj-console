import type {PlayingControls, TrackState} from '../../types';
import {Button} from '@radix-ui/themes';
import {PlayIcon} from '@radix-ui/react-icons';

interface PlayProps {
    onClick?: PlayingControls['play'];
    state: TrackState;
}

export const Play: React.FC<PlayProps> = ({onClick, state}) => {
    const isDisabled = state === 'playing' || !onClick;
    const variant = state === 'playing' ? 'outline' : 'soft';
    return (
        <Button disabled={isDisabled} variant={variant} color={'green'} onClick={onClick} aria-label={'Play'}>
            <PlayIcon />
        </Button>
    );
};
