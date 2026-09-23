import {Text, Box, Grid} from '@radix-ui/themes';
import {PlayingInfo, TrackState} from '../../types';
import {Waveform} from '../Waveform/Waveform';

interface WaveformContainerProps {
    data?: AudioBuffer;
    playingInfo: PlayingInfo;
    state: TrackState;
}

export const WaveformContainer: React.FC<WaveformContainerProps> = ({state, data, playingInfo}) => {
    const noDataInfo = state === 'empty' ? 'No track selected' : state === 'reloading' ? 'Reloading file' : 'Loading file';
    return (
        <Grid height={'100%'}>
            {data ? (
                <Waveform data={data} playingInfo={playingInfo} />
            ) : (
                <Box alignSelf={'center'} position={'relative'}>
                    <Text as={'p'} align={'center'} size={'4'}>
                        {noDataInfo}
                    </Text>
                </Box>
            )}
        </Grid>
    );
};
