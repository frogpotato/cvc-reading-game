// Each level is one word pair with its own theme.
// Levels are grouped into "worlds" — complete all levels in a world to unlock the treasure.
// After the treasure, the next world's levels appear.

const themes = [
  { left: '🐉', right: '🧝', leftColor: 'amber', rightColor: 'teal' },
  { left: '🦕', right: '🦸', leftColor: 'green', rightColor: 'blue' },
  { left: '👻', right: '🤺', leftColor: 'purple', rightColor: 'sky' },
  { left: '🧛', right: '🛡️', leftColor: 'red', rightColor: 'indigo' },
  { left: '👹', right: '⚔️', leftColor: 'orange', rightColor: 'cyan' },
  { left: '🦄', right: '🌟', leftColor: 'pink', rightColor: 'violet' },
  { left: '👽', right: '🚀', leftColor: 'lime', rightColor: 'blue' },
  { left: '🤖', right: '⚡', leftColor: 'slate', rightColor: 'amber' },
];

const worlds = [
  {
    name: 'at / it',
    pairs: [
      ['at', 'it'],
      ['sat', 'sit'],
      ['pat', 'pit'],
      ['nat', 'nit'],
      ['hat', 'hit'],
      ['bat', 'bit'],
      ['fat', 'fit'],
      ['mat', 'mit'],
    ],
  },
  {
    name: 'an / in',
    pairs: [
      ['an', 'in'],
      ['ban', 'bin'],
      ['fan', 'fin'],
      ['man', 'min'],
      ['pan', 'pin'],
      ['ran', 'rin'],
      ['tan', 'tin'],
      ['van', 'vin'],
    ],
  },
  {
    name: 'am / im',
    pairs: [
      ['am', 'im'],
      ['bam', 'bim'],
      ['dam', 'dim'],
      ['ham', 'him'],
      ['jam', 'jim'],
      ['ram', 'rim'],
    ],
  },
  {
    name: 'ap / ip',
    pairs: [
      ['ap', 'ip'],
      ['lap', 'lip'],
      ['nap', 'nip'],
      ['rap', 'rip'],
      ['sap', 'sip'],
      ['tap', 'tip'],
      ['yap', 'yip'],
      ['zap', 'zip'],
    ],
  },
  {
    name: 'ad / id',
    pairs: [
      ['ad', 'id'],
      ['bad', 'bid'],
      ['dad', 'did'],
      ['had', 'hid'],
      ['lad', 'lid'],
      ['pad', 'pid'],
      ['sad', 'sid'],
      ['mad', 'mid'],
    ],
  },
  {
    name: 'ag / ig',
    pairs: [
      ['ag', 'ig'],
      ['bag', 'big'],
      ['rag', 'rig'],
      ['tag', 'tig'],
      ['wag', 'wig'],
    ],
  },
  {
    name: 'h words set 1',
    pairs: [
      ['had', 'ham'],
      ['has', 'hat'],
      ['hid', 'him'],
      ['hip', 'his'],
      ['hit', 'hag'],
      ['had', 'hid'],
      ['ham', 'hit'],
    ],
  },
  {
    name: 'h words set 2',
    pairs: [
      ['had', 'hat'],
      ['ham', 'has'],
      ['hid', 'hit'],
      ['him', 'hip'],
      ['his', 'hag'],
      ['hat', 'hip'],
      ['ham', 'him'],
    ],
  },
  {
    name: 'h / n',
    pairs: [
      ['hit', 'nit'],
      ['hip', 'nip'],
      ['hag', 'nag'],
      ['hot', 'not'],
      ['hut', 'nut'],
    ],
  },
  {
    name: 'at / ut',
    pairs: [
      ['at', 'ut'],
      ['bat', 'but'],
      ['cat', 'cut'],
      ['hat', 'hut'],
      ['mat', 'mut'],
      ['nat', 'nut'],
      ['pat', 'put'],
      ['sat', 'sut'],
    ],
  },
  {
    name: 'an / un',
    pairs: [
      ['an', 'un'],
      ['ban', 'bun'],
      ['fan', 'fun'],
      ['man', 'mun'],
      ['pan', 'pun'],
      ['ran', 'run'],
      ['tan', 'tun'],
      ['van', 'vun'],
    ],
  },
  {
    name: 'ug / ub',
    pairs: [
      ['bug', 'bub'],
      ['dug', 'dub'],
      ['hug', 'hub'],
      ['jug', 'jub'],
      ['mug', 'mub'],
      ['pug', 'pub'],
      ['rug', 'rub'],
      ['tug', 'tub'],
    ],
  },
  {
    name: 'u words set 1',
    pairs: [
      ['bug', 'bus'],
      ['but', 'bud'],
      ['cup', 'cub'],
      ['cut', 'cud'],
      ['gum', 'gup'],
      ['gun', 'gus'],
      ['hug', 'hum'],
      ['hut', 'hub'],
    ],
  },
  {
    name: 'u words set 2',
    pairs: [
      ['jug', 'jut'],
      ['mud', 'mug'],
      ['mum', 'mun'],
      ['nun', 'nut'],
      ['pug', 'pun'],
      ['pub', 'pup'],
      ['run', 'rub'],
      ['sun', 'sum'],
    ],
  },
  {
    name: 'e words set 1',
    pairs: [
      ['and', 'ant'],
      ['hit', 'hid'],
      ['red', 'net'],
      ['pet', 'set'],
      ['get', 'ten'],
      ['hen', 'fed'],
      ['peg', 'met'],
      ['red', 'pet'],
      ['net', 'get'],
      ['set', 'hen'],
    ],
  },
  {
    name: 'e words set 2',
    pairs: [
      ['fed', 'red'],
      ['ten', 'hen'],
      ['met', 'net'],
      ['peg', 'get'],
      ['pet', 'fed'],
      ['set', 'met'],
      ['red', 'ten'],
      ['hen', 'peg'],
    ],
  },
];

// Flatten worlds into levels: each level = { wordA, wordB, icon, theme, worldName }
// Themes cycle within each world so every level looks different
function buildLevels() {
  const allLevels = [];
  for (const world of worlds) {
    const worldLevels = world.pairs.map((pair, i) => {
      const theme = themes[i % themes.length];
      return {
        wordA: pair[0],
        wordB: pair[1],
        icon: theme.left,
        theme,
        worldName: world.name,
      };
    });
    allLevels.push({ name: world.name, levels: worldLevels });
  }
  return allLevels;
}

const allWorlds = buildLevels();

export default allWorlds;
