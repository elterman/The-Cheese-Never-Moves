<script>
    import Cookie from '$lib/images/Cookie.webp';
    import Toast from '$lib/images/Toast.webp';
    import Flag from '$lib/images/Flag.webp';
    import Frame from '$lib/images/Frame.webp';
    import GamePage from '../Game Page.svelte';
    import Intro from '../Intro.svelte';
    import Splash from '../Splash.svelte';
    import { ss } from '../state.svelte';
    import { post, windowSize } from '../utils';
    import { fade } from 'svelte/transition';

    let scale = $state(1);

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        const onResize = () => {
            let scx = 1;
            let scy = 1;

            const { w, h } = windowSize();

            if (w < 450) {
                scx = w / 450;
            }

            if (h < 788) {
                scy = h / 788;
            }

            scale = Math.min(scx, scy);
        };

        onResize();

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
            window.removeEventListener('resize', onResize);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);
</script>

<div class="app">
    {#if splash}
        <Splash />
    {:else}
        <div class="content" style="scale: {scale};">
            <img class="frame" src={Frame} alt="" />
            {#if ss.intro}
                <img class="flag" src={Flag} alt="" width={400} transition:fade={{ duration: 100 }} />
                <img class="coin" src={Cookie} alt="" width={200} transition:fade={{ duration: 100 }} />
                <img class="death" src={Toast} alt="" width={200} transition:fade={{ duration: 100 }} />
            {/if}
            <GamePage />
            <Intro />
            {#if ss.intro}
                <div class="disclaimer">
                    <span>MUSIC BY ERIC MATYAS  •  WWW.SOUNDIMAGE.ORG</span>
                </div>
            {/if}</div>
    {/if}
</div>

<style>
    :global {
        body {
            margin: 0;
            overflow: hidden;
            --ow: #c6c7be;
            --gold: #daa520;
            --red: #a52a2a;
            --orange: #ff7900;
            --background: #604020;
            color: var(--ow);
            background: var(--background);
            font-family: Cooper;
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .cookie {
            background-image: url('$lib/images/Cookie Texture.webp');
        }

        .napkin {
            background-image: url('$lib/images/Napkin Texture.webp');
        }

        .toast {
            background-image: url('$lib/images/Toast Texture.webp');
            filter: brightness(1.7);
        }

        .cookie,
        .napkin,
        .toast {
            background-clip: text;
            -webkit-background-clip: text; /* For broader browser compatibility */
            color: transparent;
            text-shadow: none;
            background-size: cover;
            background-position: center;
        }
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background-image: url('$lib/images/Pattern Original.webp');
        background-size: 200px;
        place-content: center;
    }

    .content {
        grid-area: 1/1;
        display: grid;
        background: #5c341d;
        background-image: radial-gradient(transparent, black 150%);
        touch-action: none;
    }

    .frame {
        grid-area: 1/1;
        touch-action: none;
    }

    .flag {
        grid-area: 1/1;
        touch-action: none;
        place-self: center;
        filter: drop-shadow(0 0 10px black) opacity(0.4) grayscale(0.75);
    }

    .coin {
        grid-area: 1/1;
        touch-action: none;
        justify-self: end;
        filter: drop-shadow(0 0 10px black);
        transform: translate(45%, -45%);
        clip-path: inset(45% 45% 0 0);
    }

    .death {
        grid-area: 1/1;
        touch-action: none;
        align-self: end;
        filter: drop-shadow(0 0 10px black);
        transform: translate(-35%, 35%);
        clip-path: inset(0 0 35% 35%);
    }

    .disclaimer {
        grid-area: 1/1;
        place-self: center end;
        margin-right: 25px;
        /* font-family: Roboto Mono; */
        font-size: 10px;
        transform: translateY(370px);
        display: grid;
        justify-items: center;
        gap: 3px;
        opacity: 0.8;
    }

    @font-face {
        font-family: Cooper;
        src: url('$lib/fonts/COOPBL.TTF');
    }

    @font-face {
        font-family: Roboto;
        src: url('$lib/fonts/Roboto-Regular.ttf');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        src: url('$lib/fonts/Roboto Condensed.ttf');
    }

    @font-face {
        font-family: 'Roboto Mono';
        src: url('$lib/fonts/Roboto Mono.ttf');
    }
</style>
