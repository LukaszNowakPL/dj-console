import type {DeckControls, PlayingControls, PlayingInfo, TrackState} from '../../types';
import {Box, Flex} from '@radix-ui/themes';
import {PlayControls} from '../PlayControls/PlayControls';
import {LoopControls} from '../LoopControls/LoopControls';
import {TempoController} from '../TempoController/TempoController';
import {PitchBendController} from '../PitchBendController/PitchBendController';

interface TrackControlsProps {
    playingControls?: PlayingControls;
    playingInfo?: PlayingInfo;
    state: TrackState;
    deckControls: DeckControls;
}

export const TrackControls: React.FC<TrackControlsProps> = ({playingControls, playingInfo, state, deckControls}) => {
    return (
        <Flex gap={'1'}>
            <Box width={'74px'}>
                <PlayControls state={state} deckControls={deckControls} playingControls={playingControls} />
            </Box>
            <Box width={'74px'}>
                <LoopControls playingControls={playingControls} playingInfo={playingInfo} state={state} />
            </Box>
            <Box width={'56px'}>
                <TempoController tempo={deckControls.tempo} onTempoChange={deckControls.onTempoChange} />
            </Box>
            <Box alignSelf={'center'} width={'24px'}>
                <PitchBendController onPitchBendChange={deckControls.onPitchBendChange} pitchBend={deckControls.pitchBend} />
            </Box>
        </Flex>
    );
};
