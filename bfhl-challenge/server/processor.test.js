const assert = require('assert');
const { parseEntries, buildHierarchies } = require('./processor');

function testBasicTree() {
  const data = ["A->B", "A->C", "B->D"];
  const { valid_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);
  
  assert.strictEqual(summary.total_trees, 1);
  assert.strictEqual(summary.largest_tree_root, 'A');
  assert.strictEqual(hierarchies[0].root, 'A');
  assert.strictEqual(hierarchies[0].depth, 3);
  console.log('testBasicTree passed');
}

function testPureCycle() {
  const data = ["X->Y", "Y->Z", "Z->X"];
  const { valid_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);
  
  assert.strictEqual(summary.total_cycles, 1);
  assert.strictEqual(summary.total_trees, 0);
  assert.strictEqual(hierarchies[0].has_cycle, true);
  assert.strictEqual(hierarchies[0].root, 'X'); // Lexicographically smallest
  console.log('testPureCycle passed');
}

function testDuplicate() {
  const data = ["G->H", "G->H", "G->I"];
  const { valid_edges, duplicate_edges } = parseEntries(data);
  const { hierarchies } = buildHierarchies(valid_edges);
  
  assert.deepStrictEqual(duplicate_edges, ["G->H"]);
  assert.strictEqual(valid_edges.length, 2);
  console.log('testDuplicate passed');
}

function testInvalidBatch() {
  const data = ["hello", "1->2", "A->", "A->A", " A->B "];
  const { valid_edges, invalid_entries } = parseEntries(data);
  
  assert.strictEqual(invalid_entries.length, 4);
  assert.strictEqual(valid_edges.length, 1);
  assert.strictEqual(valid_edges[0].from, 'A');
  assert.strictEqual(valid_edges[0].to, 'B');
  console.log('testInvalidBatch passed');
}

function testDiamond() {
  const data = ["A->D", "B->D"];
  const { valid_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);
  
  // A found D first. B->D should be skipped. 
  // We should have 2 trees: one starting at A, one starting at B
  assert.strictEqual(summary.total_trees, 2);
  const rootA = hierarchies.find(h => h.root === 'A');
  const rootB = hierarchies.find(h => h.root === 'B');
  assert.strictEqual(rootA.depth, 2);
  assert.strictEqual(rootB.depth, 1);
  console.log('testDiamond passed');
}

function testTiebreak() {
  const data = ["Z->Y", "A->B"];
  const { valid_edges } = parseEntries(data);
  const { summary } = buildHierarchies(valid_edges);
  
  assert.strictEqual(summary.total_trees, 2);
  // Both depth 2. A is lexicographically smaller.
  assert.strictEqual(summary.largest_tree_root, 'A');
  console.log('testTiebreak passed');
}

function testPdfExample() {
  const data = [
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ];
  
  const { valid_edges, duplicate_edges, invalid_entries } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);
  
  // Verify counts
  assert.strictEqual(summary.total_trees, 3);
  assert.strictEqual(summary.total_cycles, 1);
  assert.strictEqual(summary.largest_tree_root, 'A');
  
  // Verify invalid & duplicates
  assert.deepStrictEqual(invalid_entries, ["hello", "1->2", "A->"]);
  assert.deepStrictEqual(duplicate_edges, ["G->H"]);
  
  // Verify hierarchy structures
  // 1: A tree
  const rootA = hierarchies.find(h => h.root === 'A');
  assert.strictEqual(rootA.depth, 4);
  
  // 2: X cycle
  const rootX = hierarchies.find(h => h.root === 'X');
  assert.strictEqual(rootX.has_cycle, true);
  assert.deepStrictEqual(rootX.tree, {}); // Empty tree per new rule
  
  // 3: P tree
  const rootP = hierarchies.find(h => h.root === 'P');
  assert.strictEqual(rootP.depth, 3);
  
  // 4: G tree
  const rootG = hierarchies.find(h => h.root === 'G');
  assert.strictEqual(rootG.depth, 2);
  
  console.log('testPdfExample passed');
}

function testRandomMaliciousInputs() {
  const data = [
    null, undefined, 1234, false, { "trick": "object" }, ["nested", "array"], 
    "H->J", 
    "A->B->C", "---", "$->%", 
    "K->L", "K->L ", " K->L",
    "G->G", ""
  ];
  
  const { valid_edges, invalid_entries, duplicate_edges } = parseEntries(data);
  const { hierarchies, summary } = buildHierarchies(valid_edges);

  // We should successfully ignore 11 complete "gibberish" entities.
  assert.strictEqual(invalid_entries.length, 11);
  
  // Handled whitespace correctly to create identical edges (which become duplicate, stored once)
  assert.deepStrictEqual(duplicate_edges, ["K->L"]);
  
  // Valid edges remaining stringently processed
  assert.strictEqual(summary.total_trees, 2);
  assert.strictEqual(hierarchies.find(h => h.root === 'H').depth, 2);
  assert.strictEqual(hierarchies.find(h => h.root === 'K').depth, 2);
  
  console.log('testRandomMaliciousInputs passed');
}

try {
  testBasicTree();
  testPureCycle();
  testDuplicate();
  testInvalidBatch();
  testDiamond();
  testTiebreak();
  testPdfExample();
  testRandomMaliciousInputs();
  console.log('All tests passed!');
} catch (error) {
  console.error('Test failed:', error);
}
