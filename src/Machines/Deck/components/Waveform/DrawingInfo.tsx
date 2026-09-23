import {Box, Text, Progress} from '@radix-ui/themes';
import {PlayingInfo} from '../../types';

interface DrawingInfoProps {
    length: PlayingInfo['length'];
}

export const DrawingInfo: React.FC<DrawingInfoProps> = ({length}) => {
    const duration = getProgressDuration(length);
    return (
        <Box alignSelf={'center'} position={'relative'} p={'9'}>
            <Text as={'p'} align={'center'} size={'4'}>
                Generating waveform image.
            </Text>
            <Text as={'p'} align={'center'} size={'2'}>
                This may take about {duration} sec.
            </Text>
            <Progress variant={'soft'} duration={`${duration}s`} mt={'2'} />
        </Box>
    );
};

const getProgressDuration = (length: number) => {
    if (length < 90) {
        return 1;
    }
    if (length < 215) {
        return 10.5;
    }
    if (length < 300) {
        return 15;
    }
    if (length < 330) {
        return 18;
    }
    if (length < 435) {
        return 21;
    }
    return 30;
};
