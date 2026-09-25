class AudioPlayerProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.channels = [];
        this.position = 0;
        this.playing = false;
        this.playbackRate = 1.0;  // 1.0 = normal speed
        this.isLoop = false;
        this.loopStart = 0;
        this.loopEnd = 48_000;

        this.isAlive = true

        this.port.onmessage = (e) => {
            const msg = e.data;

            switch (msg.type) {
                case 'load':
                    this.channels = msg.channels.map(ch => new Float32Array(ch));
                    this.position = 0;
                    this.playbackRate = msg.playbackRate;
                    this.loopStart = msg.loopStart;
                    this.loopEnd = msg.loopStart + msg.loopLength;
                    break;

                case 'play':
                    this.playing = true;
                    break;

                case 'pause':
                    this.playing = false;
                    break;

                case 'stop':
                    if(this.isLoop) {
                        this.position = this.loopStart
                    } else {
                        this.position = 0;
                    }
                    this.playing = false;

                    this.port.postMessage({
                        type: 'position',
                        frame: Math.floor(this.position)
                    });
                    break;

                case 'seek':
                    this.position = Math.max(0, msg.frame);
                    break;

                case 'rate':
                    // clamp safety
                    this.playbackRate = Math.max(0.5, Math.min(2.0, msg.value));
                    break;
                case 'toggle-loop':
                    // Once we switch the loop on and track does not play, we want to cue to the beginning of a loop
                    if(!this.isLoop && !this.playing) {
                        if(this.position >= this.loopEnd || this.position < this.loopStart) {
                            this.position = this.loopStart
                            this.port.postMessage({
                                type: 'position',
                                frame: Math.floor(this.position)
                            });
                        }
                    }
                    this.isLoop = !this.isLoop;
                    break;
                case 'set-loop':
                    this.loopStart = msg.loopStart
                    this.loopEnd = msg.loopStart + msg.loopLength
                    break;
                case 'prepare-for-track':
                    this.loopStart = msg.loopStart
                    this.loopEnd = msg.loopStart + msg.loopLength
                    this.playbackRate = Math.max(0.5, Math.min(2.0, msg.tempo));
                    // Once the loop is on and track does not play, we want to cue to the beginning of a loop
                    if(this.isLoop && !this.playing) {
                        if(this.position >= this.loopEnd || this.position < this.loopStart) {
                            this.position = this.loopStart
                            this.port.postMessage({
                                type: 'position',
                                frame: Math.floor(this.position)
                            });
                        }
                    }
                    break;
                case 'eject':
                    this.isAlive = false
                    break;
            }
        };
    }

    process(_, outputs) {
        if(!this.isAlive) {
            console.log('worklet process finished')
            return false // informs that the process has finished
        }

        const output = outputs[0];
        const frames = output[0].length;

        if (!this.playing || this.channels.length === 0) {
            output.forEach(ch => ch.fill(0));
            return true;
        }

        const chCount = output.length;
        const bufferLength = this.channels[0].length;

        for (let i = 0; i < frames; i++) {
            if (this.position >= bufferLength - 1) {
                this.playing = false;
                break;
            }

            const i0 = this.position | 0;
            const i1 = i0 + 1;
            const frac = this.position - i0;

            for (let ch = 0; ch < chCount; ch++) {
                const a = this.channels[ch][i0] || 0;
                const b = this.channels[ch][i1] || 0;

                // linear interpolation
                output[ch][i] = a + (b - a) * frac;
            }

            this.position += this.playbackRate;

            if(this.isLoop && (this.position > this.loopEnd || this.position < this.loopStart)) {
                this.position = this.loopStart
            }
        }

        this.port.postMessage({
            type: 'position',
            frame: Math.floor(this.position)
        });

        return true;
    }
}

registerProcessor('audio-player', AudioPlayerProcessor);
