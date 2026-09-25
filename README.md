# DJ Console

This repository supports `Web audio api` talk. Its aim is to investigate one of the exotic apis available on JS environment.

It contains example React SPA as a basic DJ console. It allows to mix two tracks together, alter their tempo and put some basic effects on top, like volume manipulations, changing the stereo settings and equalisation of registries.

The talk was performed during:

- [React Alicante](https://reactalicante.es/) conference (25.09.2026 - Alicante, Spain)

## PoC structure

Please note that this is a PoC project for confirming Web Audio Capabilities. It breaks several rules of code quality, has some issues with memory management and lacks good UX design. Using longer tracks (4 minutes in length or more) may froze your browser for a while, as the graphic waveform representation creation is costy for Java Script environment. After some time you also may find the browser consumes larger portion of a RAM memory. I try to fix those issues in the future.

## Commands available

`npm install` for installing dependencies of overall project.

`npm run dev` will fire the dev environment of a SPA and will open the application automatically in the browser using http://localhost:3000/ url. 

## Presentation

The repository contains pdf presentations displayed during meetings. Please note the language prefix used on file's name.

## Contact

- [GitHub profile](https://github.com/LukaszNowakPL/)
- [Linkedin profile](https://linkedin.com/in/%C5%82ukasz-nowak-533844101)
