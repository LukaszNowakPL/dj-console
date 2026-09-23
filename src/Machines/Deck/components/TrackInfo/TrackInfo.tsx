import type {PlayingInfo, TrackInfo as TrackInfoInterface} from '../../types';
import {Box, Grid} from '@radix-ui/themes';
import {TrackTimer} from '../TrackTimer/TrackTimer';
import {TrackPicture} from '../TrackPicture/TrackPicture';

interface TrackInfoProps {
    trackInfo?: TrackInfoInterface;
    playingInfo?: PlayingInfo;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({trackInfo, playingInfo}) => {
    return (
        <Grid columns={'1'}>
            <Box>
                <TrackTimer timeMark={playingInfo?.timeMark} />
                <TrackPicture picture={trackInfo?.picture} pictureFormat={trackInfo?.pictureFormat} />
            </Box>
        </Grid>
    );
};
