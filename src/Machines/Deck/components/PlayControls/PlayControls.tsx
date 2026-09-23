import type {DeckControls, PlayingControls, TrackState} from '../../types';
import {Grid} from '@radix-ui/themes';
import {Play} from './Play';
import {Pause} from './Pause';
import {Stop} from './Stop';
import {Eject} from './Eject';

interface PlayControlsProps {
    playingControls?: PlayingControls;
    state: TrackState;
    deckControls: DeckControls;
}

export const PlayControls: React.FC<PlayControlsProps> = ({playingControls, state, deckControls}) => {
    return (
        <Grid columns={'1'}>
            <Play onClick={playingControls?.play} state={state} />
            <Pause onClick={playingControls?.pause} state={state} />
            <Stop onClick={playingControls?.stop} state={state} />
            <Eject state={state} deckId={deckControls.deckId} onFileChange={deckControls.onFileChange} />
        </Grid>
    );
};
