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
      ['fat', 'fit'],
      ['mat', 'mit'],
      ['bat', 'bit'],
    ],
  },
  {
    name: 'an / in',
    pairs: [
      ['an', 'in'],
      ['fan', 'fin'],
      ['man', 'min'],
      ['pan', 'pin'],
      ['ran', 'rin'],
      ['tan', 'tin'],
      ['van', 'vin'],
      ['ban', 'bin'],
    ],
  },
  {
    name: 'am / im',
    pairs: [
      ['am', 'im'],
      ['dam', 'dim'],
      ['ham', 'him'],
      ['ram', 'rim'],
      ['bam', 'bim'],
      ['jam', 'jim'],
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
      ['dad', 'did'],
      ['had', 'hid'],
      ['lad', 'lid'],
      ['pad', 'pid'],
      ['sad', 'sid'],
      ['mad', 'mid'],
      ['bad', 'bid'],
    ],
  },
  {
    name: 'ag / ig',
    pairs: [
      ['ag', 'ig'],
      ['rag', 'rig'],
      ['tag', 'tig'],
      ['wag', 'wig'],
      ['bag', 'big'],
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
      ['cat', 'cut'],
      ['hat', 'hut'],
      ['mat', 'mut'],
      ['nat', 'nut'],
      ['pat', 'put'],
      ['sat', 'sut'],
      ['bat', 'but'],
    ],
  },
  {
    name: 'an / un',
    pairs: [
      ['an', 'un'],
      ['fan', 'fun'],
      ['man', 'mun'],
      ['pan', 'pun'],
      ['ran', 'run'],
      ['tan', 'tun'],
      ['van', 'vun'],
      ['ban', 'bun'],
    ],
  },
  {
    name: 'ug / ub',
    pairs: [
      ['dug', 'dub'],
      ['hug', 'hub'],
      ['mug', 'mub'],
      ['pug', 'pub'],
      ['rug', 'rub'],
      ['tug', 'tub'],
      ['bug', 'bub'],
      ['jug', 'jub'],
    ],
  },
  {
    name: 'u words set 1',
    pairs: [
      ['cup', 'cub'],
      ['cut', 'cud'],
      ['gum', 'gup'],
      ['gun', 'gus'],
      ['hug', 'hum'],
      ['hut', 'hub'],
      ['bug', 'bus'],
      ['but', 'bud'],
    ],
  },
  {
    name: 'u words set 2',
    pairs: [
      ['mud', 'mug'],
      ['mum', 'mun'],
      ['nun', 'nut'],
      ['pug', 'pun'],
      ['pub', 'pup'],
      ['run', 'rub'],
      ['sun', 'sum'],
      ['jug', 'jut'],
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
