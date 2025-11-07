<script>
    import { ss } from './state.svelte';
    import Tile from './Tile.svelte';

    let _this = $state();
    const tiles = $derived(ss.tileSets ? ss.tileSets[ss.step - 1] : []);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'transform') {
                return;
            }

            if (ss.flip) {
                ss.flip = false;
            }
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div bind:this={_this} class="board {ss.paused && !ss.over ? 'paused' : ''}">
    {#each tiles as tile (tile.id)}
        <Tile {tile} />
    {/each}
</div>

<style>
    .board {
        grid-area: 3/1;
        display: grid;
        place-self: center;
        z-index: 1;
        filter: drop-shadow(0 4px 4px #00000080);
        transition: opacity 0.5s;
    }

    .paused {
        opacity: 0.3;
    }
</style>
