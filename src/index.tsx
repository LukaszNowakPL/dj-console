import React from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient} from '@tanstack/react-query';
import {ReactQueryContext} from './context/ReactQueryContext';
import {Theme} from '@radix-ui/themes';
import {DjConsole} from './views/DjConsole/DjConsole';
import '@radix-ui/themes/styles.css';

const container = document.getElementById('root')!;

const root = createRoot(container!);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {retry: 3},
    },
});

root.render(
    <React.StrictMode>
        <Theme appearance={'light'} panelBackground="solid">
            <ReactQueryContext queryClient={queryClient}>
                <DjConsole />
            </ReactQueryContext>
        </Theme>
    </React.StrictMode>,
);
