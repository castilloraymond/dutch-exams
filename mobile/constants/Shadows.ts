/**
 * Shadow presets — ported from web --shadow-card and --shadow-hover tokens.
 */

import { Platform, ViewStyle } from 'react-native';

type ShadowPreset = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;

export const Shadows: Record<string, ShadowPreset> = {
    card: Platform.select({
        ios: {
            shadowColor: '#1a1a2e',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
        },
        default: {
            elevation: 2,
        },
    }) as ShadowPreset,

    cardHover: Platform.select({
        ios: {
            shadowColor: '#1a1a2e',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.10,
            shadowRadius: 20,
        },
        default: {
            elevation: 6,
        },
    }) as ShadowPreset,

    button: Platform.select({
        ios: {
            shadowColor: '#E8632B',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
        },
        default: {
            elevation: 4,
        },
    }) as ShadowPreset,
};

export default Shadows;
