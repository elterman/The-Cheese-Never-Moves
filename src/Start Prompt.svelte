<script>
    import BlackSizeL from '$lib/images/Size L Black.webp';
    import SizeL from '$lib/images/Size L.webp';
    import BlackSizeM from '$lib/images/Size M Black.webp';
    import SizeM from '$lib/images/Size M.webp';
    import BlackSizeS from '$lib/images/Size S Black.webp';
    import SizeS from '$lib/images/Size S.webp';
    import BlackSizeXL from '$lib/images/Size XL Black.webp';
    import SizeXL from '$lib/images/Size XL.webp';
    import BlackSizeXS from '$lib/images/Size XS Black.webp';
    import SizeXS from '$lib/images/Size XS.webp';
    import { fade } from 'svelte/transition';
    import { PROMPT_RESUME, PROMPT_START } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { onSizeSelect, onStartOrResume } from './shared.svelte';
    import { _prompt, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const sizes = [
        [SizeXS, BlackSizeXS],
        [SizeS, BlackSizeS],
        [SizeM, BlackSizeM],
        [SizeL, BlackSizeL],
        [SizeXL, BlackSizeXL],
    ];
</script>

{#if ss.startPrompt && !_prompt.id}
    <div class="start-prompt" transition:fade>
        {#snippet prompt(label)}
            <div class="start">
                <PromptPanel ops={[{ label, style: 'font-size: 32px;', onClick: onStartOrResume }]} />
            </div>
        {/snippet}
        {#if ss.ticks === 0}
            <div class="sizes">
                {#each sizes as sob, i (i)}
                    {@const current = i + 1 === ss.size}
                    <div class={current ? 'ro' : ''}>
                        <ToolButton id={`size-${i + 1}`} src={sob[current ? 0 : 1]} onClick={() => onSizeSelect(i + 1)} ro={ss.flip}/>
                    </div>
                {/each}
            </div>
            {@render prompt(PROMPT_START)}
        {:else}
            {@render prompt(PROMPT_RESUME)}
        {/if}
    </div>
{/if}

<style>
    .start-prompt {
        grid-area: 4/1;
        display: grid;
        gap: 15px;
        z-index: 1;
        place-content: center;
    }

    .sizes {
        display: grid;
        grid-auto-flow: column;
        gap: 20px;
        place-content: center;
        filter: drop-shadow(0 2px 3px black);
    }

    .ro {
        pointer-events: none;
    }

    .start {
        place-self: center;
        animation: pulse 0.25s alternate infinite ease-in-out;
    }

    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0.85);
        }
    }
</style>
