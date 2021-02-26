import { renderHook, act } from '@testing-library/react-hooks';

import useVisualMode from 'hooks/useVisualMode';

// tests for our inital state we pass into useVisualMode function
const FIRST = 'FIRST';
const SECOND = 'SECOND';
const THIRD = 'THIRD';

// This test will initialize the mode to FIRST
test('useVisualMode should initialize with default value', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));
  expect(result.current.mode).toBe(FIRST);
});

/* This test will initialize the mode to FIRST, then transition to SECOND
 * and then check to see what the current value of mode is. */
test('useVisualMode should transition to another mode', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));
  expect(result.current.mode).toBe(SECOND);
});

/* Afterwards, the test will attempt to pop back to the most recent mode, which should be SECOND.
After another back, we should find ourselves back at the FIRST mode. */
test('useVisualMode should return to previous mode', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));
  expect(result.current.mode).toBe(SECOND);

  act(() => result.current.transition(THIRD));
  expect(result.current.mode).toBe(THIRD);

  act(() => result.current.back());
  expect(result.current.mode).toBe(SECOND);

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});

// test back limit
test('useVisualMode should not return to previous mode if already at initial', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});

// Replace
test('useVisualMode should replace the current mode', () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));
  expect(result.current.mode).toBe(SECOND);

  // Passing "true" to transition(THIRD, true) says "Transition to THIRD by REPLACING SECOND"
  act(() => result.current.transition(THIRD, true));
  expect(result.current.mode).toBe(THIRD);

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});
