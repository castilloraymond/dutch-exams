/**
 * Typography constants — ported from web design system.
 * Font: Plus Jakarta Sans (bundled as custom font).
 */

import { StyleSheet } from 'react-native';
import Colors from './Colors';

const Typography = StyleSheet.create({
    // Headings
    h1: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.ink,
        lineHeight: 34,
    },
    h2: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.ink,
        lineHeight: 28,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.ink,
        lineHeight: 24,
    },

    // Body text
    body: {
        fontSize: 17,
        fontWeight: '400',
        color: Colors.ink,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 15,
        fontWeight: '400',
        color: Colors.inkSoft,
        lineHeight: 20,
    },

    // Captions & Labels
    caption: {
        fontSize: 13,
        fontWeight: '400',
        color: Colors.inkMuted,
        lineHeight: 18,
    },
    subtitle: {
        fontSize: 11,
        fontWeight: '400',
        color: Colors.inkMuted,
        lineHeight: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.inkSoft,
        lineHeight: 18,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Special
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.white,
        lineHeight: 22,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        lineHeight: 12,
    },
});

export default Typography;
