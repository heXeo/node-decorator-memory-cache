'use strict';

import Hook from '@hexeo/decorator-hook';
import cache from 'memory-cache';
import _ from 'lodash';

export default (argsAsKey = null, cacheTime = 60 * 60 * 1000) => {
  return Hook.create((context, self, trampoline, args) => {
    if (!argsAsKey) {
      argsAsKey = _.range(args.length);
    }

    let argsAsKeyValues = _.map(argsAsKey, (path) => _.result(args, path));
    let cacheKey = JSON.stringify([
      context.uuid,
      ...argsAsKeyValues
    ]);

    let cached = cache.get(cacheKey);
    if (cached !== null) {
      return cached;
    }

    let returnValue = trampoline.apply(self, args);
    cache.put(cacheKey, returnValue, cacheTime);
    return returnValue;
  });
};
