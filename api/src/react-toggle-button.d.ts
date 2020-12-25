declare module "react-toggle-button" {
  import React from "react";

  export interface ToggleButtonColor {
    base: string;
    hover?: string;
  }

  export interface ToggleButtonColors {
    active: ToggleButtonColor;
    inactive: ToggleButtonColor;
    activeThumb: ToggleButtonColor;
    inactiveThumb: ToggleButtonColor;
  }

  export interface ToggleButtonProps {
    value: boolean;
    onToggle: (v: boolean) => void;
    colors?: ToggleButtonColors;
    activeLabel?: string | object;
    inactiveLabel?: string | object;
    activeLabelStyle?: object;
    activeLabelStyleHover?: object;
    activeThumbStyle?: object;
    activeThumbStyleHover?: object;
    inactiveLabelStyle?: object;
    inactiveLabelStyleHover?: object;
    thumbStyle?: object;
    thumbStyleHover?: object;
    trackStyle?: object;
    trackStyleHover?: object;
    animateThumbStyleHover?: Function;
    animateTrackStyleHover?: Function;
    animateTrackStyleToggle?: Function;
    animateThumbStyleToggle?: Function;
    internalSpringSetting?: object;
    internalHoverSpringSetting?: object;
    thumbIcon?: string | object;
    thumbAnimateRange?: number[];
    passThroughInputProps?: object;
  }

  export default class ToggleButton extends React.Component<ToggleButtonProps, any> {}
}
