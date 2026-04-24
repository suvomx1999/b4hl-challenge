function parseEntries(entries) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const valid_edges = [];
  
  const seen_edges = new Set();
  
  for (let entry of entries) {
    if (typeof entry !== 'string') {
      invalid_entries.push(entry);
      continue;
    }
    
    // Trim each entry
    const trimmed = entry.trim();
    // Valid format: single uppercase letter -> single uppercase letter
    if (/^[A-Z]->[A-Z]$/.test(trimmed)) {
      const parts = trimmed.split('->');
      // Reject self-loops
      if (parts[0] === parts[1]) {
        invalid_entries.push(entry);
      } else {
        // Handle duplicates: first occurrence wins
        if (seen_edges.has(trimmed)) {
          // Push to duplicate only once per pair, spec says "push subsequent to duplicate_edges[] (only once per pair)"
          // Wait, if it's already in duplicate array? We should only push once.
          if (!duplicate_edges.includes(trimmed)) {
            duplicate_edges.push(trimmed);
          }
        } else {
          seen_edges.add(trimmed);
          valid_edges.push({ from: parts[0], to: parts[1] });
        }
      }
    } else {
      // Push original invalid string according to instructions (but using trimmed or original? Spec: "Reject... push invalid ones to invalid_entries[]")
      invalid_entries.push(entry);
    }
  }
  
  return { valid_edges, invalid_entries, duplicate_edges };
}

function buildHierarchies(valid_edges) {
  const adj = {};
  const inDegree = {};
  const nodes = new Set();
  const parentOf = {};
  // First, populate all nodes involved in valid edges
  for (let edge of valid_edges) {
    nodes.add(edge.from);
    nodes.add(edge.to);
  }
  
  // Initialize inDegree for all nodes
  for (let node of nodes) {
    inDegree[node] = 0;
  }
  
  // Build adjacency list, enforcing the diamond rule
  for (let edge of valid_edges) {
    const { from, to } = edge;
    if (parentOf.hasOwnProperty(to)) {
      continue; // silently discard subsequent parent edges for same child
    }
    
    parentOf[to] = from;
    if (!adj[from]) adj[from] = [];
    adj[from].push(to);
    inDegree[to]++;
  }
  
  let potentialRoots = [...nodes].filter(n => inDegree[n] === 0);
  
  const visited = new Set();
  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = null;
  let max_depth = -1;
  
  function getSubtree(node, recStack) {
    visited.add(node);
    if (!adj[node] || adj[node].length === 0) {
      return { tree: { [node]: {} }, depth: 1, hasCycle: false };
    }
    
    let currentTree = {};
    let cycleDetected = false;
    let maxChildDepth = 0;
    
    // Sort children for predictable output
    const children = adj[node].sort();
    
    for (let child of children) {
      if (recStack.has(child)) {
        cycleDetected = true;
      } else if (!visited.has(child)) {
        recStack.add(child);
        const childResult = getSubtree(child, recStack);
        recStack.delete(child);
        
        currentTree = { ...currentTree, ...childResult.tree };
        if (childResult.hasCycle) cycleDetected = true;
        maxChildDepth = Math.max(maxChildDepth, childResult.depth);
      }
    }
    
    const depth = maxChildDepth + 1;
    return { tree: { [node]: currentTree }, depth, hasCycle: cycleDetected };
  }
  
  potentialRoots.sort();
  
  for (let root of potentialRoots) {
    if (!visited.has(root)) {
      const recStack = new Set([root]);
      const result = getSubtree(root, recStack);
      
      const hierarchy = {
        root: root,
        tree: result.tree,
      };
      
      if (result.hasCycle) {
        hierarchy.has_cycle = true;
        total_cycles++;
      } else {
        hierarchy.depth = result.depth;
        total_trees++;
        if (result.depth > max_depth) {
          max_depth = result.depth;
          largest_tree_root = root;
        } else if (result.depth === max_depth) {
          if (root < largest_tree_root) {
            largest_tree_root = root;
          }
        }
      }
      
      hierarchies.push(hierarchy);
    }
  }
  
  const unvisitedNodes = [...nodes].filter(n => !visited.has(n));
  unvisitedNodes.sort(); 
  
  for (let node of unvisitedNodes) {
    if (!visited.has(node)) {
      const recStack = new Set([node]);
      const result = getSubtree(node, recStack);
      
      hierarchies.push({
        root: node,
        tree: result.tree,
        has_cycle: true
      });
      total_cycles++;
    }
  }
  
  return {
    hierarchies,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  };
}

module.exports = { parseEntries, buildHierarchies };
