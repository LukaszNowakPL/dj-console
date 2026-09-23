import {Box, Flex} from '@radix-ui/themes';
import {TrackTitle} from '../TrackTitle/TrackTitle';
import type {DeckControls, PlayingControls, PlayingInfo, TrackInfo as TrackInfoInterface, TrackState} from '../../types';
import {TrackInfo} from '../TrackInfo/TrackInfo';
import {TrackControls} from '../TrackControls/TrackControls';

interface TrackControllerProps {
    state: TrackState;
    trackInfo?: TrackInfoInterface;
    playingControls?: PlayingControls;
    playingInfo?: PlayingInfo;
    deckControls: DeckControls;
}

export const TrackController: React.FC<TrackControllerProps> = ({state, trackInfo, playingInfo, playingControls, deckControls}) => {
    return (
        <>
            <TrackTitle trackInfo={trackInfo} />
            <Flex>
                <Box width={'100%'}>
                    <TrackInfo trackInfo={trackInfo} playingInfo={playingInfo} />
                </Box>
                <Box>
                    <TrackControls state={state} playingControls={playingControls} playingInfo={playingInfo} deckControls={deckControls} />
                </Box>
            </Flex>
        </>
    );
};
