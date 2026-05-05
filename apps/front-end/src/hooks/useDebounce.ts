import { useEffect, useState } from "react";

// TODO: Move to @alextheman/components
function useDebounce<ValueType>(value: ValueType, delay = 500): ValueType {
  const [debouncedValue, setDebouncedValue] = useState<ValueType>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
