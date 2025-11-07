<script>
    import { fade } from 'svelte/transition';
    import { DEFAULT_GAME_SIZE, PROMPT_BACK_TO_GAME, PROMPT_PLAY } from './const';
    import PromptPanel from './Prompt Panel.svelte';
    import { onSizeSet } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';

    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 10px 0 0 -20px;">';
    const cookie = '<span class="cookie">';
    const napkin = '<span class="cookie">';
    const toast = '<span class="toast" style="filter: brightness(1.7) saturate(1.2)">';

    const CONTENT = `
        <span>How quickly can your mouse find the ${cookie}cheese</span> hidden in the ${napkin}grid?</span>
        ${ul}
        ${li}${napkin}Mice</span> mark either the ${cookie}cheese</span> or a ${toast}mouse trap</span>.</li>
        ${li}Click on a ${napkin}mouse</span> if you think you know  where the ${cookie}cheese</span> is. Otherwise, click on an empty cell.</li>
        ${li}${toast}Traps</span> may move with each click, but the ${cookie}cheese</span> stays in the same spot.</li>
        </ul>`;

    const resume = $derived(ss.ticks);
    const label = $derived(resume ? PROMPT_BACK_TO_GAME : PROMPT_PLAY);

    const onClick = () => {
        _sound.play('plop');

        if (!ss.size) {
            onSizeSet(DEFAULT_GAME_SIZE);
        }

        if (!_sound.musicPlayed) {
            _sound.playMusic();
        }

        if (!ss.over) {
            ss.startPrompt = true;
        }

        ss.intro = false;
    };
</script>

{#if ss.intro}
    <div class="intro" in:fade>
        <div class="title-panel">
            <span class="title cookie">SAY CHEESE!</span>
        </div>
        <div class="content" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html CONTENT}
        </div>
        <div class="buttons">
            <PromptPanel ops={[{ label, style: `font-size: ${resume ? 28 : 36}px;`, onClick }]} />
        </div>
    </div>
{/if}

<style>
    .intro {
        place-self: center;
        grid-area: 1/1;
        display: grid;
        gap: 50px;
        justify-items: center;
    }

    .title-panel {
        grid-area: 1/1;
        display: grid;
        place-items: center;
        filter: drop-shadow(0px 2px 5px black);
    }

    .title {
        font-size: 38px;
    }

    .content {
        grid-area: 2/1;
        font-size: 22px;
        display: grid;
        align-content: start;
        width: 330px;
        filter: drop-shadow(0 2px 3px black);
    }

    .buttons {
        grid-area: 3/1;
        place-self: center;
    }
</style>
