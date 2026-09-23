import type {DeckControls, TrackState} from '../../types';
import {Button} from '@radix-ui/themes';
import {UploadIcon} from '@radix-ui/react-icons';

interface EjectProps {
    state: TrackState;
    onFileChange: DeckControls['onFileChange'];
    deckId: DeckControls['deckId'];
}

export const Eject: React.FC<EjectProps> = ({state, deckId, onFileChange}) => {
    const isDisabled = !['empty', 'ready', 'stopped', 'paused'].includes(state);

    const loadFileFormId = `load-file-id-${deckId}`;
    const handleButtonClick = () => {
        document.getElementById(loadFileFormId)?.click();
    };

    const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files && ev.target.files.length > 0) {
            onFileChange(ev.target.files?.[0]);
        }
    };

    return (
        <>
            <Button mt={'1'} disabled={isDisabled} variant={'soft'} color={'gray'} onClick={handleButtonClick} aria-label={'Eject'}>
                <UploadIcon />
            </Button>
            <input
                id={loadFileFormId}
                type="file"
                accept="audio/*,.mp3,.flac,.wav"
                onChange={handleFileChange}
                aria-hidden={true}
                style={{display: 'none'}}
            />
        </>
    );
};
