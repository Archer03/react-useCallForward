import { useCallback, useRef } from "react";

export const useMutableContext = (paramContext) => {
  const paramsRef = useRef();
  paramsRef.current = paramContext;
  const renderRef = useRef();
  renderRef.current?.resolve();
  renderRef.current = null;
  return {
    callForwardSync: fn => {
      const values = getValues(paramsRef.current, fn);
      fn(...values);
    },
    useCallForwardSync: fn => {
      const deps = getValues(paramsRef.current, fn);
      return useCallback((...payload) => {
        const values = getValues(paramsRef.current, fn);
        fn(...values)(...payload);
      }, deps);
    },
    callForward: fn => { // recommended
      if (!renderRef.current) {
        const [renderPromise, resolve] = newPromise();
        renderRef.current = { renderPromise, resolve };
      } 
      renderRef.current.renderPromise.then(() => {
        const values = getValues(paramsRef.current, fn);
        fn(...values);
      })
    },
    useCallForward: fn => { // recommended
      const deps = getValues(paramsRef.current, fn);
      return useCallback((...payload) => {
        if (!renderRef.current) {
          const [renderPromise, resolve] = newPromise();
          renderRef.current = { renderPromise, resolve };
        } 
        renderRef.current.renderPromise.then(() => {
          const values = getValues(paramsRef.current, fn);
          fn(...values)(...payload);
        })
      }, [deps]);
    }
  }
}

const getValues = (paramContext, fn) => {
  const arrowFunc = /[^()=]*(?==>)/;
  const commonFunc = /(?<=\()[^)]*(?=\))/;
  const matcher = fn.prototype ? commonFunc : arrowFunc;
  const paramNames = fn.toString().replaceAll(/\s/g, '').match(matcher)[0].split(',');
  return paramNames.filter(name => name).map(name => paramContext[name]);
}

const newPromise = () => {
  let resolve = null;
  let reject = null;
  return [new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  }), resolve, reject];
}