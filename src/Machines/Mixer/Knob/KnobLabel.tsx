import {Text} from '@radix-ui/themes';
import './KnobLabel.styles.css';

interface LabelProps {
    label: string;
}

export const KnobLabel: React.FC<LabelProps> = ({label}) => {
    return (
        <Text className={'Label'} as={'p'} align={'center'}>
            {label}
        </Text>
    );
};
