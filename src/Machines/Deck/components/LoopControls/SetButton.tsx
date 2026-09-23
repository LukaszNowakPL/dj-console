import type {PlayingControls, PlayingInfo, TrackState} from '../../types';
import {Button} from '@radix-ui/themes';
import {LoopIcon} from '@radix-ui/react-icons';

interface LoopControlsProps {
    playingControls?: PlayingControls;
    isLoop?: PlayingInfo['isLoop'];
    state: TrackState;
}

export const SetButton: React.FC<LoopControlsProps> = ({playingControls, isLoop, state}) => {
    const isDisabled = !['ready', 'playing', 'paused', 'stopped'].includes(state) || !playingControls?.toggleLoop;
    const variant = isLoop ? 'outline' : 'soft';
    const color = isLoop ? 'green' : 'gray';

    return (
        <Button disabled={isDisabled} variant={variant} color={color} onClick={playingControls?.toggleLoop}>
            <LoopIcon />
        </Button>
    );
};
