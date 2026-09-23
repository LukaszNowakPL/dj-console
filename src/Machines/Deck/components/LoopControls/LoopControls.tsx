import type {PlayingControls, PlayingInfo, TrackState} from '../../types';
import {Grid} from '@radix-ui/themes';
import {SetButton} from './SetButton';
import {LoopStartField} from './LoopStartField';
import {LoopLengthField} from './LoopLengthField';

interface LoopControlsProps {
    playingControls?: PlayingControls;
    playingInfo?: PlayingInfo;
    state: TrackState;
}

export const LoopControls: React.FC<LoopControlsProps> = ({playingControls, playingInfo, state}) => {
    return (
        <Grid columns={'1'}>
            <SetButton playingControls={playingControls} isLoop={playingInfo?.isLoop} state={state} />
            <LoopStartField loopStart={playingInfo?.loopStart} setLoopStart={playingControls?.setLoopStart} />
            <LoopLengthField loopLength={playingInfo?.loopLength} setLoopLength={playingControls?.setLoopLength} />
        </Grid>
    );
};
