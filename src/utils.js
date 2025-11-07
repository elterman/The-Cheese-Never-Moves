import { isNumber, sample, sampleSize } from 'lodash-es';
import { COIN, FLAGS, MIN_GAME_DIMENSION, TILE_SET_SIZE, TRAP } from './const';

export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = e.clientWidth || g.clientWidth,
        h = e.clientHeight || g.clientHeight;

    return { w, h };
};

export const clientRect = selector => {
    const ob = document.querySelector(selector);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const underMouse = (event, selectors) => {
    for (const selector of selectors) {
        const r = clientRect(selector);

        if (!r) {
            continue;
        }

        const x = event.clientX;
        const y = event.clientY;

        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return true;
        }
    }

    return false;
};

export const focusOnApp = () => {
    document.querySelector('.app')?.focus();
};

export const isTouchable = () => navigator.maxTouchPoints > 0;

export const tapOrClick = (lower = false) => {
    const verb = isTouchable() ? 'Tap' : 'Click on';
    return lower ? verb.toLowerCase() : verb;
};

export const isAppleDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const scrollClass = () => `root-scroll ${isTouchable() ? 'root-scroll-mobile' : ''}`;

export const post = (fn, ms) => setTimeout(fn, ms);

export const range = (n) => [...Array(n + 1).keys()].slice(1);

const shuffle = (size, coinIndex = null) => {
    const dim = size + MIN_GAME_DIMENSION - 1;
    const tileCount = dim * dim;
    let rng = range(tileCount).map(i => i - 1);
    let flagCount = FLAGS[size - 1];
    let indexes;

    if (isNumber(coinIndex)) {
        rng = rng.filter(i => i !== coinIndex);
        flagCount -= 1;
        indexes = sampleSize(rng, flagCount);
    } else {
        indexes = sampleSize(rng, flagCount);
        coinIndex = sample(indexes);
    }

    const tiles = [];
    rng = range(dim);

    for (const row of rng) {
        for (const col of rng) {
            const tile = { row, col };
            const i = (row - 1) * dim + (col - 1);

            if (i === coinIndex) {
                tile.item = COIN;
            } else if (indexes.includes(i)) {
                tile.item = TRAP;
            }

            tile.id = size * 100 + row * 10 + col;
            tiles.push(tile);
        }
    }

    return { tiles, coinIndex };
};

export const retile = size => {
    const sets = [];

    let { tiles, coinIndex } = shuffle(size);
    sets.push(tiles);

    for (let i = 0; i < TILE_SET_SIZE - 1; i++) {
        tiles = shuffle(size, coinIndex).tiles;
        sets.push(tiles);
    }

    return sets;
};

export const samePos = (one, two) => one?.row === two.row && one?.col === two.col;
