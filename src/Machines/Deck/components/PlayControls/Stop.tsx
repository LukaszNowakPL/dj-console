import type {PlayingControls, TrackState} from '../../types';
import {Button} from '@radix-ui/themes';
import {StopIcon} from '@radix-ui/react-icons';

interface StopProps {
    onClick?: PlayingControls['stop'];
    state: TrackState;
}

export const Stop: React.FC<StopProps> = ({onClick, state}) => {
    const isDisabled = !['playing', 'paused'].includes(state) || !onClick;
    const variant = ['stopped', 'ready'].includes(state) ? 'outline' : 'soft';
    return (
        <Button mt={'1'} disabled={isDisabled} variant={variant} color={'red'} onClick={onClick} aria-label={'Stop'}>
            <StopIcon />
        </Button>
    );
};
