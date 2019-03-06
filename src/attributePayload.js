/** @flow */

/**
 * diffProperties takes two sets of props and a set of valid attributes
 * and write to updatePayload the values that changed or were deleted.
 * If no updatePayload is provided, a new one is created and returned if
 * anything changed.
 */
const diffProperties = (
  updatePayload: ?Object,
  prevProps: Object,
  nextProps: Object,
  validAttributes: Object,
) => {
  // first iterate through the next props
  for (const propKey in nextProps) {
    if (!validAttributes[propKey]) {
      continue; // not valid propKey
    }

    const prevProp = prevProps[propKey];
    const nextProp = nextProps[propKey];

    if (prevProp === nextProp) {
      continue; // nothing changed
    }

    (updatePayload || (updatePayload = {}))[propKey] = nextProp;
  }

  // iterate through previous props and flag for removal to reset to default
  for (const propKey in prevProps) {
    if (nextProps[propKey] !== undefined) {
      continue; // already covered this key in the previous pass
    }

    if (!validAttributes[propKey]) {
      continue; // not valid propKey
    }

    const prevProp = prevProps[propKey];
    if (prevProp === undefined) {
      continue; // was already empty anyway
    }

    // Pattern match on: validAttribute[propKey]
    if (typeof validAttributes[propKey] !== 'object') {
      // Flag the leaf property for removal
      (updatePayload || (updatePayload = {}))[propKey] = null;
    }
  }

  return updatePayload;
};

type C = (props: Object, validAttributes: Object) => ?Object;
export const create: C = (props, validAttributes) => {
  let result = null;
  for (const p in props) {
    if (!validAttributes[p]) {
      continue;
    }

    (result || (result = {}))[p] = props[p];
  }

  return result;
};

export const diff = (
  prevProps: Object,
  nextProps: Object,
  validAttributes: Object,
) => {
  return diffProperties(null, prevProps, nextProps, validAttributes);
};
