import {Box, Text} from '@radix-ui/themes';

type ValueProps = {
    value: number;
};

export const KnobValue: React.FC<ValueProps> = ({value}) => {
    return (
        <Box px={'1'} width={'var(--space-7)'}>
            <Text size={'2'} mb={'1'}>
                {value}
            </Text>
        </Box>
    );
};
