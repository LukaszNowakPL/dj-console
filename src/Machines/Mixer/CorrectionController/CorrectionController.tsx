import {Box} from '@radix-ui/themes';
import {GainController} from '../GainController/GainController';

interface CorrectionControllerProps {
    highGainNode: React.MutableRefObject<GainNode | undefined>;
    midGainNode: React.MutableRefObject<GainNode | undefined>;
    lowGainNode: React.MutableRefObject<GainNode | undefined>;
}

export const CorrectionController: React.FC<CorrectionControllerProps> = ({highGainNode, midGainNode, lowGainNode}) => {
    return (
        <Box alignSelf={'end'}>
            <GainController node={highGainNode} label={'High'} max={1.5} value={1} showValue withCut withReset={1} />
            <GainController node={midGainNode} label={'Mid'} max={1.5} value={1} showValue withCut withReset={1} />
            <GainController node={lowGainNode} label={'Low'} max={1.5} value={1} showValue withCut withReset={1} />
        </Box>
    );
};
