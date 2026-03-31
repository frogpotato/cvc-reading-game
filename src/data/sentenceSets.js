const sentenceSets = {
  level1: {
    name: "Noun Phrases",
    patterns: [
      {
        type: "the_adj_noun",
        weight: 1,
        sentences: [
          "the fat cat",
          "the fat bat",
          "the fat rat",
          "the fat hen",
          "the fat fox",
          "the fat pig",
          "the fat ant",
          "the fat red cat",
          "the fat red rat",
        ],
      },
    ],
  },

  level2: {
    name: "Simple Possession",
    patterns: [
      {
        type: "sam_had_a",
        weight: 1,
        sentences: [
          "sam had a cat",
          "sam had a bat",
          "sam had a rat",
          "sam had a hen",
          "sam had a fox",
          "sam had a pig",
          "sam had an ant",
          "sam had a pen",
          "sam had a net",
          "sam had a pan",
          "sam had a bin",
          "sam had a box",
          "sam had a hat",
          "sam had a nan",
        ],
      },
    ],
  },

  level3: {
    name: "Simple Actions",
    patterns: [
      {
        type: "bit_it",
        weight: 1,
        sentences: [
          "the cat bit it",
          "the bat bit it",
          "the rat bit it",
          "the fox bit it",
          "the pig bit it",
          "the ant bit it",
          "the red cat bit it",
        ],
      },
      {
        type: "sat",
        weight: 1.5,
        sentences: [
          "the fat cat sat",
          "the fat bat sat",
          "the fat rat sat",
          "the fat hen sat",
          "the fat fox sat",
          "the fat pig sat",
        ],
      },
    ],
  },

  level4: {
    name: "Descriptions",
    patterns: [
      {
        type: "is_adj",
        weight: 1,
        sentences: [
          "the cat is fat",
          "the bat is fat",
          "the rat is fat",
          "the hen is fat",
          "the fox is fat",
          "the pig is fat",
          "the ant is fat",
        ],
      },
      {
        type: "is_adj_and_adj",
        weight: 2,
        sentences: [
          "the cat is fat and red",
          "the rat is fat and red",
          "the hen is fat and red",
          "the pig is fat and red",
        ],
      },
    ],
  },

  level5: {
    name: "Questions",
    patterns: [
      {
        type: "is_adj_q",
        weight: 1,
        sentences: [
          "is the cat fat?",
          "is the bat fat?",
          "is the rat fat?",
          "is the hen fat?",
          "is the fox fat?",
          "is the pig fat?",
          "is the ant fat?",
        ],
      },
      {
        type: "is_adj_and_adj_q",
        weight: 2,
        sentences: [
          "is the cat fat and red?",
          "is the rat fat and red?",
          "is the hen fat and red?",
        ],
      },
      {
        type: "is_red_q",
        weight: 1.5,
        sentences: [
          "is the pen red?",
          "is the net red?",
          "is the pan red?",
          "is the bin red?",
          "is the box red?",
          "is the hat red?",
          "is the hen red?",
          "is the ant red?",
          "is the nan red?",
        ],
      },
    ],
  },

  level6: {
    name: "Multi-Clause",
    patterns: [
      {
        type: "hit_and_ran",
        weight: 1.5,
        sentences: [
          "the cat hit the rat and ran",
          "the bat hit the cat and ran",
          "the rat hit the hen and ran",
          "the fox hit the pig and ran",
          "the pig hit the ant and ran",
          "the ant hit the cat and ran",
        ],
      },
      {
        type: "hid_in",
        weight: 1.5,
        sentences: [
          "the cat hid in the box",
          "the rat hid in the bin",
          "the bat hid in the box",
          "the hen hid in the bin",
          "the fox hid in the box",
          "the pig hid in the bin",
          "the ant hid in the box",
        ],
      },
      {
        type: "pet",
        weight: 2,
        sentences: [
          "the cat pet the rat",
          "the bat pet the hen",
          "the fox pet the cat",
          "the pig pet the bat",
          "the hen pet the ant",
          "the ant pet the cat",
        ],
      },
      {
        type: "fed",
        weight: 2,
        sentences: [
          "the cat fed the rat",
          "the hen fed the pig",
          "the rat fed the fox",
          "the bat fed the hen",
          "the pig fed the ant",
          "the ant fed the cat",
        ],
      },
    ],
  },
};

export default sentenceSets;
