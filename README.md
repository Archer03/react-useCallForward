# use-mutable-context

A react hook, helps to pass the latest version of state to callback after setState\
Without useEffect.

In fact useEffect is the most suitable way to listen state change.\

But sometimes useEffect is not intuitive, it separates the logic of event flow.

## problem background

```javascript
const Foo = () => {
  const [count, setCount] = useState(0);
  const callFn = () => console.log(count);
  return <div onClick={() => {
    setCount(count + 1);
    callFn() // log 0, not expected
  }}>foo{count}</div>
}
```

I know that we can just 'console.log(count + 1)', it will be correct and easy.\
But at the same time, it has coupling now.\
Even you can just have 'const newCount = count + 1' to avoid duplicate calculation.\
But newCount should be delivered to different place. So there is still coupling.\
To be honest, maybe it's the best way to handle this in react.\
What can we do? Maybe nothing.\
But just try to think more, just have a fun.\

### useEffect way

```javascript
useEffect(callFn, [count])
```

but what if I just want callFn in click event? count maybe changed by other case, which i don't care.

### useRef way

```javascript
const countRef = useRef();
countRef.current = count;
const callFn = () => console.log(countRef.current);
```

but useRef is redundant while there already have been useState.

so what if not useEffect and not useRef?
Let's see useMutableContext.

## usage

callForward and useCallForward, both is ok.

```javascript
import { useMutableContext } from 'use-mutable-context';

const Child = () => {
  const [count, setCount] = useState(0);
  const { callForward, useCallForward } = useMutableContext({ count });
  const callFn = useCallForward(count => () => console.log(count));
  return <div onClick={() => {
    setCount(count + 1);

    // log count correctly, async way
    callForward(count => console.log(count));

    // log count correctly, useCallback built-in, async way
    callFn();
  }}>foo {count}</div>
}
```

## Api

|**Method**|**Description**|
|-|-|
|callForward|`callForward(fn)` to call the fn safely|
|useCallForward|`const callFn = useCallForward((dep1, dep2, ...) => fn)` an alternative to useCallback. With same ability to cache reference. The difference is that callFn is always safe for state version, whenever you execute it.|
|callForwardSync| sync version |
|useCallForwardSync| sync version |
