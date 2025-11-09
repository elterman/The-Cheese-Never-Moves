<script>
    import Won from '$lib/images/Won.webp';
    import Trap from '$lib/images/Trap.webp';
    import Cheese from '$lib/images/Cheese.webp';
    import Death from '$lib/images/Death.webp';
    import Think from '$lib/images/Think.webp';
    import BlackPlate from '$lib/images/Plate Black.webp';
    import WhitePlate from '$lib/images/Plate White.webp';
    import Plate from '$lib/images/Plate.webp';
    import { scale } from 'svelte/transition';
    import { BOARD_SIZE, COIN, LOST, MIN_GAME_DIMENSION, TILE_SET_SIZE, TRAP, WON } from './const';
    import { onOver } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post, samePos } from './utils';
    import { sample } from 'lodash-es';

    const { tile } = $props();
    const { row, col, item } = $derived(tile);
    const id = $derived(tile.id);
    const area = $derived(`${row}/${col}`);
    const flag = $derived(!ss.over && (item === COIN || item === TRAP));
    const coin = $derived(ss.over && item === COIN);
    const trap = $derived(ss.over && item === TRAP);
    const dim = $derived(ss.size + MIN_GAME_DIMENSION - 1);
    const width = $derived(BOARD_SIZE / dim);
    const sel = $derived(ss.over && ss.selected && samePos(ss.selected, tile));
    const flagSize = $derived(width / 1.9);
    const coinSize = $derived(width / 1.7);
    const trapSize = $derived(width / (sel && trap ? 1.2 : 1.5));
    let pressed = $state();
    let _this = $state();
    let flip = $derived(ss.flip ? sample(['flip-x', 'flip-y']) : '');

    const onClick = () => {
        ss.selected = { row, col };

        if (!item) {
            const nextStep = ss.step === TILE_SET_SIZE ? 1 : ss.step + 1;
            post(() => (ss.step = nextStep));

            return;
        }

        onOver(item === COIN ? WON : LOST);
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.propertyName === 'scale') {
                if (pressed) {
                    pressed = false;
                } else {
                    onClick();
                }

                return;
            }
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        _sound.play('tap');
        pressed = true;
    };
</script>

<div
    {id}
    bind:this={_this}
    class="tile no-highlight {ss.paused || ss.over ? 'ro' : ''} {pressed ? 'pressed' : ''} {ss.over === LOST ? 'shake' : ''} {flip}"
    style="grid-area: {area}; width: {width}px; height: {width}px;"
    onpointerdown={onPointerDown}>
    <img class="plate" src={ss.over && coin ? WhitePlate : sel && trap ? BlackPlate : Plate} alt="" width="100%" height="100%" />
    {#if !ss.paused || ss.over}
        <div class="content-wrapper" transition:scale={{ opacity: 1 }}>
            {#snippet content(img, sz, dy = 0)}
                {@const filter = `drop-shadow(0 0 ${sz / 20}px #0007)`}
                <div
                    class="content {coin && ss.over === WON ? 'pulse' : ''}"
                    style="transform: translateY({dy}%);"
                    transition:scale={{ duration: ss.over ? 400 : 100, opacity: 1 }}>
                    <img src={img} alt="" width={sz} style="filter: {filter};" />
                </div>
            {/snippet}
            {#if coin}
                {@render content(ss.over === WON ? Won : Cheese, coinSize, 0)}
            {/if}
            {#if trap}
                {@render content(sel && trap ? Death : Trap, trapSize, 0)}
            {/if}
            {#if flag}
                {@render content(Think, flagSize)}
            {/if}
        </div>
    {/if}
</div>

<style>
    .tile {
        display: grid;
        box-sizing: border-box;
        /* border: 1px solid #ffffff60; */
        padding: 2.3%;
        cursor: url('$lib/images/Mouse Cursor.png'), auto;
        transition:
            scale 0.1s,
            transform 0.5s ease-out;
    }

    .content-wrapper {
        grid-area: 1/1;
        display: grid;
    }

    .content {
        grid-area: 1/1;
        place-self: center;
        display: grid;
    }

    .ro {
        pointer-events: none;
    }

    .plate {
        grid-area: 1/1;
        opacity: 1;
    }

    .pressed {
        scale: 0.7;
    }

    .shake {
        animation: shake 0.1s alternate 2 ease-in-out;
    }

    @keyframes shake {
        from {
            transform: scale(1, 1);
        }
        33% {
            transform: scale(1, 1.2);
        }
        66% {
            transform: scale(1.2, 1);
        }
        to {
            transform: scale(1, 1);
        }
    }

    .flip-x {
        transform: rotateX(90deg);
    }

    .flip-y {
        transform: rotateY(90deg);
    }

    .pulse {
        animation: pulse 0.1s alternate 8 ease-in-out;
        animation-delay: 1000;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.8);
        }
    }
</style>
