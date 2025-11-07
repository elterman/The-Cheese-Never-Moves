<script>
    import { elapsedSecs } from './shared.svelte';
    import { ss } from './state.svelte';
    import Timer from './Timer.svelte';

    const color = $derived(ss.over === 'lost' ? 'lost' : '');
</script>

<div class="timer {color}">
    <Timer secs={elapsedSecs()} />
</div>

<style>
    .timer {
        grid-area: 2/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        align-items: center;
        gap: 50px;
        font-size: 44px;
        color: var(--gold);
        transition: color 1s;
        filter: drop-shadow(0 2px 5px black);
    }

    .lost {
        color: var(--orange);
    }
</style>
