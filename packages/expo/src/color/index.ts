import { PlatformColor, type ColorValue } from 'react-native';

import { Material3DynamicColor, type AndroidMaterialColorName } from './materialColor';

export { AndroidMaterialColorName } from './materialColor';

export type IOSColorName = // TODO: Check

    | 'systemBlue'
    | 'systemRed'
    | 'systemGreen'
    | 'systemYellow'
    | 'systemGray'
    | 'label'
    | 'secondaryLabel'
    | 'tertiaryLabel'
    | 'quaternaryLabel'
    | 'systemFill'
    | 'secondarySystemFill'
    | 'tertiarySystemFill'
    | 'quaternarySystemFill'
    | 'systemBackground'
    | 'secondarySystemBackground'
    | 'tertiarySystemBackground'
    | 'systemGroupedBackground'
    | 'secondarySystemGroupedBackground'
    | 'tertiarySystemGroupedBackground'
    | 'separator'
    | 'opaqueSeparator'
    | 'link';

export type AndroidBaseColorName = 'background_dark' | 'background_light'; // TODO: https://developer.android.com/reference/android/R.color

export type AndroidAttrColorName = // TODO: https://developer.android.com/reference/android/R.attr
  'colorPrimary' | 'colorError' | 'colorAccent' | 'colorBackground' | 'colorForeground';

type ColorGroup<PredefinedValues extends string> = {
  [key in PredefinedValues | (string & {})]: ColorValue;
};

export interface ColorType {
  ios: ColorGroup<IOSColorName>;
  android: ColorGroup<AndroidBaseColorName> & {
    attr: ColorGroup<AndroidAttrColorName>;
    material: { [key in AndroidMaterialColorName]: ColorValue | undefined };
  };
}

const iosColor = new Proxy({} as ColorGroup<IOSColorName>, {
  get(_, prop: string) {
    return PlatformColor(prop);
  },
});

const androidAttrColor = new Proxy({} as ColorGroup<AndroidAttrColorName>, {
  get(_, prop: string) {
    return PlatformColor('?attr/' + prop);
  },
});

const androidMaterialColor = new Proxy(
  {} as { [key in AndroidMaterialColorName]: ColorValue | undefined },
  {
    get(_, prop: string) {
      return Material3DynamicColor(prop) ?? undefined;
    },
  }
);

const androidColor = new Proxy(
  {
    get attr() {
      return androidAttrColor;
    },
    get material() {
      return androidMaterialColor;
    },
  } as ColorGroup<AndroidBaseColorName> & {
    attr: ColorGroup<AndroidAttrColorName>;
    material: { [key in AndroidMaterialColorName]: ColorValue | undefined };
  },
  {
    get(target, prop: string) {
      if (prop in target) {
        return target[prop];
      }
      return PlatformColor('@android:color/' + prop);
    },
  }
);

export const Color: ColorType = {
  get ios() {
    return iosColor;
  },
  get android() {
    return androidColor;
  },
};
