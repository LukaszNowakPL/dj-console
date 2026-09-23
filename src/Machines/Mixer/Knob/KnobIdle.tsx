import {Box, Button} from '@radix-ui/themes';
import {CheckCircledIcon, CrossCircledIcon} from '@radix-ui/react-icons';
import './KnobIdle.styles.css';

interface IdleButtonProps {
    isOn: boolean;
    onClick: () => void;
}

export const KnobIdle: React.FC<IdleButtonProps> = ({isOn, onClick}) => {
    const color = isOn ? 'red' : 'green';
    const highContrast = isOn;
    const variant = isOn ? 'surface' : 'soft';

    return (
        <Box>
            <Button className={'IdleButton'} size={'1'} variant={variant} color={color} highContrast={highContrast} onClick={onClick}>
                {isOn ? <CrossCircledIcon /> : <CheckCircledIcon />}
            </Button>
        </Box>
    );
};
