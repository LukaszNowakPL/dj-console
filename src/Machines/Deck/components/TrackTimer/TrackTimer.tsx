import {PlayingInfo} from '../../types';
import {Text} from '@radix-ui/themes';

interface TrackTimerProps {
    timeMark?: PlayingInfo['timeMark'];
}
export const TrackTimer: React.FC<TrackTimerProps> = ({timeMark}) => {
    return <Text as={'p'}>{!timeMark ? '-' : formatTime(timeMark)}</Text>;
};

const formatTime = (mark: number) => {
    const minutes = Math.floor(mark / 60);
    const seconds = Math.floor(mark % 60);
    const miliseconds = Math.floor((mark * 100) % 100);

    const minutesPart = `${minutes < 10 ? '0' : ''}${minutes}:`;
    const secondsPart = `${seconds < 10 ? '0' : ''}${seconds}:`;
    const millisecondsPart = `${miliseconds < 10 ? '0' : ''}${miliseconds}`;

    return `${minutesPart}${secondsPart}${millisecondsPart}`;
};
