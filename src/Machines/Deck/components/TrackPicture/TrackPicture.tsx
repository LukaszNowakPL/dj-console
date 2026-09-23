import {Box, Grid, Text} from '@radix-ui/themes';
import {TRACK_PICTURE_MAX_SIZE} from '../../consts';
import './TrackPicture.styles.css';
import type {TrackInfo} from '../../types';

interface TrackPictureProps {
    picture: TrackInfo['picture'];
    pictureFormat: TrackInfo['pictureFormat'];
}
export const TrackPicture: React.FC<TrackPictureProps> = ({picture, pictureFormat}) => {
    if (!picture) {
        return (
            <Grid
                my={'2'}
                columns={'1'}
                width={`${TRACK_PICTURE_MAX_SIZE}px`}
                height={`${TRACK_PICTURE_MAX_SIZE}px`}
                className={'TrackPicture'}
                style={
                    {
                        '--track-picture-max-size': TRACK_PICTURE_MAX_SIZE,
                    } as React.CSSProperties
                }
            >
                <Box alignSelf={'center'}>
                    <Text align={'center'} as={'p'} color={'gray'}>
                        No cover
                    </Text>
                </Box>
            </Grid>
        );
    }

    let binary = '';

    for (const byte of picture) {
        binary += String.fromCharCode(byte);
    }

    const base64 = btoa(binary);
    const src = `data:${pictureFormat};base64,${base64}`;

    return (
        <Grid my={'2'} columns={'1'}>
            <img
                alt={'Track cover'}
                src={src}
                className={'TrackPicture'}
                style={
                    {
                        '--track-picture-max-size': `${TRACK_PICTURE_MAX_SIZE}px`,
                    } as React.CSSProperties
                }
            />
        </Grid>
    );
};
