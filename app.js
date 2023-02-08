const graphy = require('graphy');
const dataset = graphy.memory.dataset.fast;
const factory = graphy.core.data.factory;
const { quad, namedNode } = factory;

// from https://github.com/blake-regalia/graphy.js/blob/5eecccae7c0cf04c0ddd84caef022484cfc563f5/test/package/memory.dataset.fast.js#L1226-L1245
const passing = (() => ({
	a: [
		['z://a', 'z://b', 'z://c', 'z://g'],
		['z://a', 'z://b', 'z://d', 'z://g'],
		['z://a', 'z://e', 'z://f', 'z://g'],
		['z://d', 'z://e', 'z://f', 'z://g'],
		['z://h', 'z://i', 'z://j', 'z://g'],
		['z://k', 'z://l', 'z://m', 'z://g'],
	],
	b: [
		['z://a', 'z://b', 'z://c', 'z://g'],
		['z://a', 'z://b', 'z://d', 'z://g'],
		['z://a', 'z://e', 'z://f', 'z://g'],
		['z://d', 'z://e', 'z://f', 'z://g'],
	],
	expect: [
		['z://h', 'z://i', 'z://j', 'z://g'],
		['z://k', 'z://l', 'z://m', 'z://g'],
	],
}))();


const failing = (() => ({
  a: [
    ['z://a', 'z://b', 'z://c', 'z://g'],
    ['z://d', 'z://e', 'z://f', 'z://g'],
    // triple with subject that occurs in b, but predicate that doesn't occurr in b
    ['z://d', 'z://h', 'z://i', 'z://g'],
  ],
  b: [
    ['z://a', 'z://b', 'z://c', 'z://g'],
    ['z://d', 'z://e', 'z://f', 'z://g'],
  ],
  expect: [
    ['z://d', 'z://h', 'z://i', 'z://g']
  ],
}))();

function loadTestset(testset) {
  const quad_testset = {};
  for (const k of Object.keys(testset)) {
    if (testset.hasOwnProperty(k)) {
      quad_testset[k] = [];
      for (const pre_q of testset[k]) {
        const q = quad(namedNode(pre_q[0]), namedNode(pre_q[1]), namedNode(pre_q[2]), namedNode(pre_q[3]));
        quad_testset[k].push(q);
      }
    }
  }
  return quad_testset;
}

function run_minus_test(quad_testset) {
  const graphyA = dataset().addAll(quad_testset['a']).canonicalize();
  const graphyB = dataset().addAll(quad_testset['b']).canonicalize();
  const graphyExpect = dataset().addAll(quad_testset['expect']);

  const minus = graphyA.minus(graphyB);

  console.log("DATASET A");
  for (const q of graphyA) {
    console.log(q);
  }
  console.log("DATASET B");
  for (const q of graphyB) {
    console.log(q);
  }
  console.log("DATASET A MINUS B");
  for (const q of minus) {
    console.log(q);
  }

  // console.log(additions);
  console.log(minus.equals(graphyExpect) ? 'pass' : 'fail');
}

run_minus_test(loadTestset(passing));
run_minus_test(loadTestset(failing));
