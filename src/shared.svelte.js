import { APP_STATE, CHEER_BEST_SCORE, CHEER_DELICIOUS, CHEER_TOAST, PROMPT_PLAY_AGAIN, TICK_MS, TIME_OUT_SECS, WON } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { post, retile } from './utils';

export const log = (value) => console.log($state.snapshot(value));

export const appKey = () => `${APP_STATE} • ${ss.size}`;

export const persist = () => {
    let json = JSON.stringify({ sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(APP_STATE, json);

    json = JSON.stringify({ ..._stats, sfx: _sound.sfx, music: _sound.music });
    localStorage.setItem(appKey(), json);
};

const loadGame = () => {
    let json = localStorage.getItem(APP_STATE);
    let job = JSON.parse(json);

    if (job) {
        _sound.sfx = job.sfx;
        _sound.music = job.music;
    }

    json = localStorage.getItem(appKey());
    job = JSON.parse(json);

    _stats.plays = job?.plays || 0;
    _stats.won = job?.won || 0;
    _stats.total_secs = job?.total_secs || 0;
    _stats.best_secs = job?.best_secs || 0;
};

export const onSizeSet = (size, tileSets) => {
    ss.size = size;
    loadGame();

    if (!tileSets) {
        ss.tileSets = null;

        post(() => {
            const sets = retile(size);
            ss.tileSets = sets;
        });
    }

    ss.step = 1;
    ss.ticks = 0;
    ss.over = null;
    ss.paused = true;

    _prompt.set(null);
};

export const showIntro = (value, plop = true) => {
    // _prompt.set(null);

    plop && _sound.play('plop');
    ss.intro = true;
    ss.paused = true;
};

export const onStartOrResume = () => {
    delete ss.paused;
    delete ss.startPrompt;

    if (ss.ticks === 0) {
        _sound.play('dice');

        _stats.plays += 1;
        persist();

        startTimer();
    }
};

export const startTimer = () => {
    stopTimer();
    ss.ticks = 0;

    post(() => {
        if (!ss.over) {
            onTick();
            ss.timer = setInterval(onTick, TICK_MS);
        }
    }, 1000);
};

export const stopTimer = () => {
    clearInterval(ss.timer);
    delete ss.timer;
};

export const selectedCells = () => ss.cells.filter((c) => c.selected);

export const selectedValueCells = () => ss.cells.filter((c) => c.value && c.value === ss.selected);

const onTick = () => {
    if (ss.paused) {
        return;
    }

    ss.ticks += 1;
    const secs = elapsedSecs();

    if (secs >= TIME_OUT_SECS) {
        onOver('lost');
        return;
    }
};

export const onOver = (over) => {
    if (ss.over) {
        return;
    }

    _sound.play(over);
    ss.over = over;
    stopTimer();

    let cheer;

    if (over === WON) {
        _stats.won += 1;
        const secs = elapsedSecs();

        _stats.total_secs += secs;

        cheer = CHEER_DELICIOUS;

        if (_stats.best_secs === 0 || secs < _stats.best_secs) {
            _stats.best_secs = secs;

            if (_stats.won > 1) {
                cheer = CHEER_BEST_SCORE;
            }
        }

        persist();
    } else {
        cheer = CHEER_TOAST;
    }

    _prompt.set(cheer);
    post(() => _prompt.set(PROMPT_PLAY_AGAIN), 3000);
};

export const onSizeSelect = (op) => {
    _sound.play('plop');
    ss.flip = true;

    post(() => {
        onSizeSet(op);
        post(() => delete ss.flip, 50);
    }, 500);

};

export const elapsedSecs = () => Math.round(((ss.ticks || 0) * TICK_MS) / 1000);
