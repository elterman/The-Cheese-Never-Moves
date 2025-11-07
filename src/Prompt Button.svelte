<script>
    import { CHEER_TOAST } from './const';
    import { _prompt } from './state.svelte';
    import { post } from './utils';

    const { op } = $props();
    let scale = $state(1);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== op.label) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(op.onClick);
                _prompt.opacity = 0;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const classes = `button-base no-highlight button ${op.label === CHEER_TOAST ? 'toast' : 'cookie'} ${op.label === CHEER_TOAST ? 'saturate' : ''} ${op.onClick ? '' : 'ro'}`;
</script>

<div id={op.label} class={classes} style='transform: scale({scale});' onpointerdown={() => (scale = 0.8)}>
    <span style={op.style}>{op.label}</span>
</div>

<style>
    .button {
        cursor: pointer;
        filter: drop-shadow(0 2px 5px black);
    }

    .button:hover {
        filter: saturate(2) drop-shadow(0 2px 5px black);
    }

    .saturate {
        filter: saturate(2.5) drop-shadow(0 2px 5px black);
    }

    .ro {
        pointer-events: none;
    }
</style>
