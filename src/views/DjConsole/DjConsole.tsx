import {useEffect, useRef} from 'react';
import {Decks} from './components/Decks/Decks';
import {Mixer} from '../../Machines/Mixer/Mixer';

export const DjConsole: React.FC = () => {
    const mainAudioCtx = new AudioContext();
    const line1Input = mainAudioCtx.createGain();
    const line2Input = mainAudioCtx.createGain();
    const mixerInput = mainAudioCtx.createGain();

    const line1Ref = useRef<GainNode>();
    const line2Ref = useRef<GainNode>();
    const mixerInputRef = useRef<GainNode>();

    useEffect(() => {
        line1Ref.current = line1Input;
        line2Ref.current = line2Input;
        mixerInputRef.current = mixerInput;
    });

    return (
        <>
            <Decks audioCtx={mainAudioCtx} line1Input={line1Ref} line2Input={line2Ref} />
            <Mixer audioCtx={mainAudioCtx} inputs={[line1Ref, line2Ref]} mixerInput={mixerInputRef} />
        </>
    );
};
