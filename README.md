# use-mutable-context
A react hook, helps to pass the latest version of state to callback after setState
Without useEffect.

In fact useEffect is the most suitable way to listen state change.
And to some degree, useEffect is more pure function program oriented.

But sometimes useEffect is not intuitive, it separates the logic of event flow.

## usage

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