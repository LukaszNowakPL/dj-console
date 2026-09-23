import type {TrackInfo} from '../../types';
import {Strong, Text} from '@radix-ui/themes';

interface TrackTitleProps {
    trackInfo?: TrackInfo;
}
export const TrackTitle: React.FC<TrackTitleProps> = ({trackInfo}) => {
    if (!trackInfo) {
        return <Text as={'p'}>No track selected</Text>;
    }
    return (
        <Text as={'p'} truncate>
            {trackInfo.artist || trackInfo.title ? (
                <>
                    <Strong>{trackInfo.artist ? trackInfo.artist : 'No artist info'}</Strong> "
                    {trackInfo.title ? trackInfo.title : 'No title info'}"
                </>
            ) : (
                <>{trackInfo.filename}</>
            )}
        </Text>
    );
};
