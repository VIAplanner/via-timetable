/* Enums */
export const FAILURE = 'FAILURE';


/* Helper functions */

const partialAssignment = (assigned, unassigned) => {
  // Combine unassigned and assigned for use in enforceConsistency.
  const partial = {};
  Object.keys(unassigned).forEach((key) => { partial[key] = unassigned[key].slice();})
  Object.keys(assigned).forEach((key) => { partial[key] = assigned[key].slice(); })
  return partial;
}

const enforceConsistency = (assigned, unassigned, csp) => {
  // Enforces arc consistency by removing inconsistent values from
  // every constraint's tail node.

  const removeInconsistentValues = (head, tail, constraint, variables) => {
    // Removes inconsistent values from the tail node. A value is
    // inconsistent when if the `tail` is assigned that value, there are
    // no values in `head`'s domain that satisfies the constraint.
    const headVal = variables[head];
    const tailVal = variables[tail];
    const validTailValues = tailVal.filter((t) => 
      headVal.some((h) =>
        constraint(h, t)
      )
    );
    const removed = tailVal.length !== validTailValues.length;
    variables[tail] = validTailValues;
    return removed;
  }

  // Returns all the constraints where `node` is the head node.
  const incomingConstraints = (node) => csp.constraints.filter((c) => c[0] === node);
  
  
  let queue = csp.constraints.slice();
  const variables = partialAssignment(assigned, unassigned);
  while (queue.length) { // While there are more constraints to test.
    const c = queue.shift()
    const [head, tail, constraint] = c;
    if (removeInconsistentValues(head, tail, constraint, variables)) {
      // If values from the tail have been removed, incoming constraints
      // to the tail must be rechecked.
      queue = queue.concat(incomingConstraints(tail));
    }
  }
  return variables;
}

const orderValues = (nextKey, assigned, unassigned, csp) => {
  // Orders the values of an unassigned variable according to the
  // Least Constraining Values heuristic. Perform arc consistency
  // on each possible value, and order variables according to the
  // how many values were eliminated from all the domains (fewest
  // eliminated in the front). This helps makes success more likely
  // by keeping future options open.
  
  const countValues = (vars) => 
    // Returns total length of all keys
    Object.keys(vars).reduce((prevSum, key) => prevSum + vars[key].length, 0)

  const valuesEliminated = (val) => {
    assigned[nextKey] = [val];
    const newLength = countValues(enforceConsistency(assigned, unassigned, csp));
    delete assigned[nextKey];
    return newLength;
  }

  // Cache valuesEliminated to be used in sort.
  const cache = {}, values = unassigned[nextKey];
  values.forEach((val) => {
    cache[val] = valuesEliminated(val);
  });
  // Descending order based on the number of domain values remaining.
  values.sort((a, b) => cache[b] - cache[a]);
  return values;
}

const selectUnassignedVariable = (unassigned)  => {
  // Picks the next variable to assign according to the Minimum
  // Remaining Values heuristic. Pick the variable with the fewest
  // values remaining in its domain. This helps identify domain
  // failures earlier.
  let minKey = null;
  let minLen = Number.POSITIVE_INFINITY;
  for (const key in unassigned) {
    const len = unassigned[key].length;
    if (len < minLen) { 
      minKey = key;
      minLen = len;
    }
  }
  return minKey;
}


const anyEmpty = (consistent) => {
  // Checks if any variable's domain is empty.
  for (const key in consistent) {
    if (consistent[key].length === 0) { return true; }
  }
  return false;
}

// Checks if there are no more variables to assign.
const finished = (unassigned) => Object.keys(unassigned).length === 0;


const backtrack = (_assigned, unassigned, csp) => {
  // Backtracking search.
  
  // Copying assigned in necessary because we modify it. Without copying
  // the object over, modifying assigned would also change values for old
  // assigned objects (which are used in callbacks).
  const assigned = { ..._assigned};

  if (finished(unassigned)) { return assigned; } // Base case.
  const nextKey = selectUnassignedVariable(unassigned);
  const values = orderValues(nextKey, assigned, unassigned, csp);
  delete unassigned[nextKey];

  for (const value of values) {
    assigned[nextKey] = [value]; // Assign a value to a variable.
    const consistent = enforceConsistency(assigned, unassigned, csp);
    const newUnassigned = {}, newAssigned = {};
    for (const key in consistent) {
      if (assigned[key]) { newAssigned[key] = assigned[key].slice(); }
      else { newUnassigned[key] = consistent[key].slice(); }
    }
    // eslint-disable-next-line no-continue
    if (anyEmpty(consistent)) { continue; } // Empty domains means failure.
    const result = backtrack(newAssigned, newUnassigned, csp);
    if (result !== FAILURE) { return result; }
  }

  return FAILURE;
}


// Solves a constraint satisfaction problem.
// `csp` is an object that should have the properties:
//    `variables`  : object that holds variable names and their domain.
//    `constraints`: list of constraints where each element is an 
//                   array of [head node, tail node, constraint function]
//    `cb`: callback function for visualizing assignments. It is passed in
//          an "assigned" object, an "unassigned" object, and `csp`.
export default function solve(csp) {
  const result = backtrack({}, csp.variables, csp);
  if (result === FAILURE) { return result; }
  // Unwrap values from array containers.
  for (const key in result) {
    // eslint-disable-next-line prefer-destructuring
    result[key] = result[key][0];
  }
  return result;
};