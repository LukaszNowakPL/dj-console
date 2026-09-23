import {Box, Button} from '@radix-ui/themes';
import {SpeakerLoudIcon, SpeakerOffIcon} from '@radix-ui/react-icons';
import './KnobCut.styles.css';

interface CutButtonProps {
    isOn: boolean;
    onClick: () => void;
}

export const KnobCut: React.FC<CutButtonProps> = ({isOn, onClick}) => {
    const color = isOn ? 'red' : 'green';
    const highContrast = isOn;
    const variant = isOn ? 'outline' : 'soft';

    return (
        <Box>
            <Button className={'CutButton'} size={'1'} variant={variant} color={color} highContrast={highContrast} onClick={onClick}>
                {isOn ? <SpeakerOffIcon /> : <SpeakerLoudIcon />}
            </Button>
        </Box>
    );
};
