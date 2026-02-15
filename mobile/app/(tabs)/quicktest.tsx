/**
 * Quick Test Tab — Quick Assessment entry point.
 * Shows module cards for quick 5-question diagnostic tests.
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import Shadows from '@/constants/Shadows';
import { getQuickAssessmentModules } from '@/lib/content';

const iconMap: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
    book: 'book',
    globe: 'globe',
    headphones: 'headphones',
    pencil: 'pencil',
    microphone: 'microphone',
};

const colorMap: Record<string, string> = {
    lezen: Colors.accent,
    knm: Colors.blue,
    luisteren: Colors.green,
    schrijven: '#8B5CF6',
    spreken: '#EC4899',
};

const colorSoftMap: Record<string, string> = {
    lezen: Colors.accentSoft,
    knm: Colors.blueSoft,
    luisteren: Colors.greenSoft,
    schrijven: '#F3F0FF',
    spreken: '#FDF2F8',
};

export default function QuickTestScreen() {
    const router = useRouter();
    const modules = getQuickAssessmentModules();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            {/* Intro */}
            <View style={styles.intro}>
                <Text style={styles.introTitle}>⚡ Quick Assessment</Text>
                <Text style={styles.introSubtitle}>
                    See where you stand — quick 5-question test per module. No account needed.
                </Text>
            </View>

            {/* Module Cards */}
            {modules.map((mod) => {
                const icon = iconMap[mod.icon] || 'question';
                const color = colorMap[mod.module] || Colors.accent;
                const colorSoft = colorSoftMap[mod.module] || Colors.accentSoft;

                return (
                    <TouchableOpacity
                        key={mod.module}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => router.push(`/quicktest/${mod.module}` as any)}>
                        <View style={styles.cardRow}>
                            <View style={[styles.iconContainer, { backgroundColor: colorSoft }]}>
                                <FontAwesome name={icon} size={20} color={color} />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{mod.name}</Text>
                                <Text style={styles.cardNameEn}>{mod.nameEnglish}</Text>
                                <Text style={styles.cardDescription}>{mod.description}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={14} color={Colors.inkMuted} />
                        </View>
                        <View style={styles.cardMeta}>
                            <View style={styles.metaBadge}>
                                <FontAwesome name="clock-o" size={11} color={Colors.inkMuted} />
                                <Text style={styles.metaText}>{mod.estimatedMinutes} min</Text>
                            </View>
                            <View style={styles.metaBadge}>
                                <FontAwesome name="list" size={11} color={Colors.inkMuted} />
                                <Text style={styles.metaText}>
                                    {mod.taskType === 'mcq' ? '5 questions' : '1 task'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.cream,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    intro: {
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.ink,
        marginBottom: 4,
    },
    introSubtitle: {
        fontSize: 15,
        color: Colors.inkSoft,
        lineHeight: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        ...Shadows.card,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.ink,
    },
    cardNameEn: {
        fontSize: 12,
        color: Colors.inkMuted,
        marginTop: 1,
    },
    cardDescription: {
        fontSize: 13,
        color: Colors.inkSoft,
        marginTop: 4,
        lineHeight: 18,
    },
    cardMeta: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.inkMuted,
    },
});
