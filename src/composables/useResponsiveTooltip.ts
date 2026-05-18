import { useWindowSize } from './useWindowSize';

type TooltipOptions = Record<string, unknown>;

type TooltipBinding = TooltipOptions & {
  value: string;
  disabled: boolean;
};

/**
 * @returns Returns a tooltip JSON for v-tooltip, ensuring that tooltips are disabled on small screens (its buggy)
 * @returns The tooltip JSON
 */
export function useResponsiveTooltip() {
  const { isSmallDevice } = useWindowSize();

  function tooltip(value: string, options: TooltipOptions = {}): TooltipBinding {
    return {
      ...options,
      value,
      disabled: isSmallDevice.value
    };
  }

  return {
    tooltip
  };
}