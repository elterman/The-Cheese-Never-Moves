<script>
    import Board from './Board.svelte';
    import Counters from './Counters.svelte';
    import Prompt from './Prompt.svelte';
    import StartPrompt from './Start Prompt.svelte';
    import Stats from './Stats.svelte';
    import Toolbar from './Toolbar.svelte';
    import { ss } from './state.svelte';

    const hidden = $derived(ss.intro);
</script>

<div class="game-page {hidden ? 'hidden' : ''}">
    <Stats />
    <Counters />
    <Board />
    <StartPrompt />
    <Prompt />
    <Toolbar />
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        grid: auto 0.3fr 1fr 0.3fr auto / auto;
        padding: 20px 0;
        /* background: #0007; */
        width: 100%;
        transition: opacity 0.2s;
    }

    .hidden {
        opacity: 0;
        pointer-events: none;
    }
</style>
