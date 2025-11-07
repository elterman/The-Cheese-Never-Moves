<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats } from './state.svelte';
    import Timer from './Timer.svelte';

    const aveSecs = $derived(_stats.won ? Math.round(_stats.total_secs / _stats.won) : 0);
</script>

<div class="stats">
    <div class="item">
        <span class="label">PLAYS</span>
        <div class="plays">
            <NumberFlow value={_stats.won} />
            <span>/</span>
            <NumberFlow value={_stats.plays} />
        </div>
    </div>
    <div class="item">
        <span class="label">AVE</span>
        <Timer secs={aveSecs} />
    </div>
    <div class="item">
        <span class="label">BEST</span>
        <Timer secs={_stats.best_secs} />
    </div>
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        padding: 5px 20px 3px;
        place-self: center;
        place-content: center;
        gap: 10px;
        border-radius: 50vh;
        color: gold;
        filter: drop-shadow(0 1px 2px black);
    }

    .item {
        box-sizing: border-box;
        font-size: 20px;
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
        align-items: center;
        place-content: center;
    }

    .label {
        color: var(--red);
    }

    .plays {
        display: grid;
        grid-auto-flow: column;
        gap: 2px;
        align-items: center;
    }
</style>
