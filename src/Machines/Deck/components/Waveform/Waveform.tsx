import {PlayingInfo} from '../../types';
import {useEffect, useRef, useState} from 'react';
import {WAVEFORM_CANVAS_WIDTH, WAVEFORM_CANVAS_HEIGHT, WAVEFORM_PX_PER_SECOND} from '../../consts';
import {DrawingInfo} from './DrawingInfo';

interface WaveformProps {
    data: AudioBuffer;
    playingInfo: PlayingInfo;
}

export const Waveform: React.FC<WaveformProps> = ({data, playingInfo: {length, timeMark: position, loopStart, loopLength, isLoop}}) => {
    const [isDrawingInfo, setIsDrawingInfo] = useState<boolean>(true);

    // Canvas being displayed to the user
    const visibleFrameRef = useRef<HTMLCanvasElement | null>(null);

    // Track canvas - will be partly displayed on the visible frame
    const trackRef = useRef<HTMLCanvasElement | null>(null);

    // Loop canvas - will also partly display on the visible frame
    const loopRef = useRef<HTMLCanvasElement | null>(null);

    // painting the initial track image (expensive work)
    useEffect(() => {
        const visibleFrame = visibleFrameRef.current;
        if (!visibleFrame) return;

        const devicePixelRatio = window.devicePixelRatio || 1;

        visibleFrame.width = visibleFrame.clientWidth * devicePixelRatio;
        visibleFrame.height = WAVEFORM_CANVAS_HEIGHT * devicePixelRatio;

        const frameCtx = visibleFrame.getContext('2d')!;
        frameCtx.scale(devicePixelRatio, devicePixelRatio);

        const trackWidth = Math.ceil(data.duration * WAVEFORM_PX_PER_SECOND);

        const trackCanvas = document.createElement('canvas');
        trackCanvas.width = trackWidth * devicePixelRatio;
        trackCanvas.height = WAVEFORM_CANVAS_HEIGHT * devicePixelRatio;

        const trackCtx = trackCanvas.getContext('2d')!;
        trackCtx.scale(devicePixelRatio, devicePixelRatio);

        // Drawing the waveform of an entire track
        drawWaveform(trackCtx, data, trackWidth, WAVEFORM_CANVAS_HEIGHT);

        trackRef.current = trackCanvas;

        if(loopRef.current !== null) {
            // Rendering part of the track waveform in the frame
            render(frameCtx, trackCanvas, loopRef.current, position * WAVEFORM_PX_PER_SECOND, visibleFrame.clientWidth /*, tempo*/);
        }

        setIsDrawingInfo(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // painting the initial loop image
    useEffect(() => {
        const visibleFrame = visibleFrameRef.current;
        if (!visibleFrame) return;

        const devicePixelRatio = window.devicePixelRatio || 1;

        visibleFrame.width = visibleFrame.clientWidth * devicePixelRatio;
        visibleFrame.height = WAVEFORM_CANVAS_HEIGHT * devicePixelRatio;

        const frameCtx = visibleFrame.getContext('2d')!;
        frameCtx.scale(devicePixelRatio, devicePixelRatio);

        const trackWidth = Math.ceil(data.duration * WAVEFORM_PX_PER_SECOND);

        const loopCanvas = document.createElement('canvas');
        loopCanvas.width = trackWidth * devicePixelRatio;
        loopCanvas.height = WAVEFORM_CANVAS_HEIGHT * devicePixelRatio;

        const loopCtx = loopCanvas.getContext('2d')!;
        loopCtx.scale(devicePixelRatio, devicePixelRatio);

        // Drawing the loop to be over an entire track
        drawLoop(loopCtx, loopStart, loopLength, isLoop, WAVEFORM_CANVAS_HEIGHT);

        loopRef.current = loopCanvas;

        if (trackRef.current !== null) {
            // Rendering part of the track waveform in the frame
            render(frameCtx, trackRef.current, loopCanvas, position * WAVEFORM_PX_PER_SECOND, visibleFrame.clientWidth /*, tempo*/);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, loopStart, loopLength, isLoop /*, tempo*/]);

    // Shifting the already painted images according to current position
    useEffect(() => {
        const frame = visibleFrameRef.current;
        const track = trackRef.current;
        const loop = loopRef.current;
        if (!frame || !track || !loop) return;

        render(frame.getContext('2d')!, track, loop, position * WAVEFORM_PX_PER_SECOND, frame.clientWidth /*, tempo*/);
    }, [position /*, tempo*/]);

    return (
        <>
            {isDrawingInfo && <DrawingInfo length={length} />}
            <canvas
                ref={visibleFrameRef}
                style={{
                    width: WAVEFORM_CANVAS_WIDTH,
                    height: WAVEFORM_CANVAS_HEIGHT,
                    display: 'block',
                }}
            />
        </>
    );
};

// Renders part of the track's waveform into the visible frame
// @ToDo: Perhaps it's good to add tempo factor too so matched tracks shift together in the tempo along the frame
function render(
    frameCtx: CanvasRenderingContext2D,
    track: HTMLCanvasElement,
    loop: HTMLCanvasElement,
    position: number,
    viewportWidth: number,
    // tempo: number
) {
    // const devicePixelRatioWidth = new Big(tempo).times(window.devicePixelRatio || 1).toNumber();
    const devicePixelRatioWidth = window.devicePixelRatio || 1;
    const devicePixelRatio = window.devicePixelRatio || 1;

    const sx = Math.max(0, Math.min(track.width / devicePixelRatioWidth - viewportWidth, position));

    frameCtx.clearRect(0, 0, viewportWidth, frameCtx.canvas.height);
    frameCtx.imageSmoothingEnabled = false;

    const imageSx = (sx - viewportWidth / 2) * devicePixelRatioWidth;

    const imageSw = viewportWidth * devicePixelRatioWidth;

    const imageDh = frameCtx.canvas.height / devicePixelRatio;

    frameCtx.drawImage(track, imageSx, 0, imageSw, frameCtx.canvas.height, 0, 0, viewportWidth, imageDh);

    frameCtx.drawImage(loop, imageSx, 0, imageSw, frameCtx.canvas.height, 0, 0, viewportWidth, imageDh);

    frameCtx.strokeStyle = '#f00';
    frameCtx.beginPath();
    frameCtx.moveTo(viewportWidth / 2, 0);
    frameCtx.lineTo(viewportWidth / 2, WAVEFORM_CANVAS_HEIGHT);
    frameCtx.stroke();
}

// Draws the waveform of a track into cashed canvas
function drawWaveform(frameCtx: CanvasRenderingContext2D, audioData: AudioBuffer, width: number, height: number) {
    const data = audioData.getChannelData(0);
    const samplesPerPixel = data.length / width;

    // --accent-track
    frameCtx.strokeStyle = '#3e63dd';
    frameCtx.beginPath();

    for (let x = 0; x < width; x++) {
        const start = Math.floor(x * samplesPerPixel);
        const end = Math.floor(start + samplesPerPixel);

        let min = 1;
        let max = -1;

        for (let i = start; i < end; i++) {
            const s = data[i];
            if (s < min) min = s;
            if (s > max) max = s;
        }

        const y1 = (1 - max) * 0.5 * height;
        const y2 = (1 - min) * 0.5 * height;

        frameCtx.moveTo(x, y1);
        frameCtx.lineTo(x, y2);
    }

    frameCtx.stroke();
}

// Draws the loop section into cashed canvas
function drawLoop(frameCtx: CanvasRenderingContext2D, loopStart: number, loopLength: number, isLoop: boolean, height: number) {
    const calculatedStart = (loopStart / 1_000) * WAVEFORM_PX_PER_SECOND;
    const calculatedEnd = ((loopStart + loopLength) / 1_000) * WAVEFORM_PX_PER_SECOND;
    const calculatedWidth = (loopLength / 1_000) * WAVEFORM_PX_PER_SECOND;
    const color = 'green';

    frameCtx.strokeStyle = color;
    frameCtx.lineWidth = 3;

    frameCtx.beginPath();
    frameCtx.moveTo(calculatedStart, 0);
    frameCtx.lineTo(calculatedStart, height);
    frameCtx.stroke();

    frameCtx.beginPath();
    frameCtx.moveTo(calculatedEnd, 0);
    frameCtx.lineTo(calculatedEnd, height);
    frameCtx.stroke();

    if (isLoop) {
        frameCtx.globalAlpha = 0.2;
        frameCtx.fillStyle = color;
        frameCtx.fillRect(calculatedStart, 0, calculatedWidth, height);
        frameCtx.globalAlpha = 1;
    }
}
