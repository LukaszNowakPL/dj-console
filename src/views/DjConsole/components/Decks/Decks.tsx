import {Box, Grid, Section} from '@radix-ui/themes';
import {Deck} from '../../../../Machines/Deck/Deck';

interface DecksProps {
    audioCtx: AudioContext;
    line1Input: React.MutableRefObject<GainNode | undefined>;
    line2Input: React.MutableRefObject<GainNode | undefined>;
}

export const Decks: React.FC<DecksProps> = ({audioCtx, line1Input, line2Input}) => {
    return (
        <Section p={'2'}>
            <Grid columns={'1'} gap={'1'} width={'auto'}>
                <Box>
                    <Deck audioCtx={audioCtx} lineInput={line1Input} deckId={'deck-a'} />
                </Box>
                <Box>
                    <Deck audioCtx={audioCtx} lineInput={line2Input} deckId={'deck-b'} />
                </Box>
            </Grid>
        </Section>
    );
};
