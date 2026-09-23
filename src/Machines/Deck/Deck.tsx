import {useState} from 'react';
import {DeckControls} from './types';
import {Track} from './components/Track/Track';

interface DeckProps {
    audioCtx: AudioContext;
    lineInput: React.MutableRefObject<GainNode | undefined>;
    deckId: string;
}

export const Deck: React.FC<DeckProps> = ({audioCtx, lineInput, deckId}) => {
    const [file, setFile] = useState<File>();
    const [tempo, setTempo] = useState<number>(1);
    const [pitchBend, setPitchBend] = useState<number>(0);

    const handleFileChange = (sentFile: File) => {
        if (!file) {
            setFile(sentFile);
        } else {
            // Setting file undefined helps with memory management
            setFile(undefined);
            setTimeout(() => setFile(sentFile), 500);
        }
    };

    const deckControls: DeckControls = {
        tempo,
        onTempoChange: setTempo,
        pitchBend,
        onPitchBendChange: setPitchBend,
        onFileChange: handleFileChange,
        deckId,
    };

    return (
        <>
            <Track deckControls={deckControls} file={file} audioCtx={audioCtx} lineInput={lineInput} />
        </>
    );
};
