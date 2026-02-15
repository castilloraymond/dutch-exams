/**
 * Module Select Screen — /learn/[module]/index.tsx
 * Shared across Lezen, KNM, Luisteren, Schrijven, Spreken.
 * Shows free exams and mock exam cards.
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
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import Shadows from '@/constants/Shadows';
import { useProgress } from '@/hooks/useProgress';
import {
    getContentIndex,
    getKNMIndex,
    getListeningIndex,
    getMockExamIndex,
    getWritingIndex,
    getSpeakingIndex,
} from '@/lib/content';

interface ExamCardData {
    id: string;
    title: string;
    description?: string;
    difficulty?: string;
    questionCount?: number;
    isFree?: boolean;
    completed?: boolean;
    score?: number;
}

const moduleNames: Record<string, { dutch: string; english: string }> = {
    lezen: { dutch: 'Lezen', english: 'Reading' },
    knm: { dutch: 'KNM', english: 'Society Knowledge' },
    luisteren: { dutch: 'Luisteren', english: 'Listening' },
    schrijven: { dutch: 'Schrijven', english: 'Writing' },
    spreken: { dutch: 'Spreken', english: 'Speaking' },
};

const moduleColors: Record<string, string> = {
    lezen: Colors.accent,
    knm: Colors.blue,
    luisteren: Colors.green,
    schrijven: '#8B5CF6',
    spreken: '#EC4899',
};

function getModuleExams(moduleId: string): ExamCardData[] {
    const cards: ExamCardData[] = [];

    switch (moduleId) {
        case 'lezen': {
            const index = getContentIndex();
            index.passages.forEach((p) => {
                cards.push({
                    id: p.id,
                    title: p.title,
                    difficulty: p.difficulty,
                    questionCount: p.questionCount,
                    isFree: true,
                });
            });
            break;
        }
        case 'knm': {
            const index = getKNMIndex();
            index.topics.forEach((t) => {
                cards.push({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    questionCount: t.questionCount,
                    isFree: true,
                });
            });
            break;
        }
        case 'luisteren': {
            const index = getListeningIndex();
            index.exercises.forEach((e) => {
                cards.push({
                    id: e.id,
                    title: e.title,
                    difficulty: e.difficulty,
                    questionCount: e.questionCount,
                    isFree: true,
                });
            });
            break;
        }
        case 'schrijven': {
            const index = getWritingIndex();
            index.tasks.forEach((t) => {
                cards.push({
                    id: t.id,
                    title: t.title,
                    description: t.titleEn,
                    isFree: t.isFreePreview,
                });
            });
            break;
        }
        case 'spreken': {
            const index = getSpeakingIndex();
            index.tasks.forEach((t) => {
                cards.push({
                    id: t.id,
                    title: t.title,
                    description: t.titleNl,
                    isFree: t.isFreePreview,
                });
            });
            break;
        }
    }

    return cards;
}

function getMockExams(moduleId: string): ExamCardData[] {
    if (!['lezen', 'knm', 'luisteren'].includes(moduleId)) return [];
    const mockIndex = getMockExamIndex(moduleId);
    if (!mockIndex) return [];

    return mockIndex.exams.map((exam) => ({
        id: exam.id,
        title: exam.title,
        difficulty: exam.difficulty,
        questionCount: exam.questionCount,
        description: `${exam.difficulty.toUpperCase()} · ${exam.questionCount} questions · ${exam.recommendedTime}`,
    }));
}

export default function ModuleSelectScreen() {
    const { module } = useLocalSearchParams<{ module: string }>();
    const router = useRouter();
    const { progress } = useProgress();

    const moduleId = module || 'lezen';
    const moduleInfo = moduleNames[moduleId] || { dutch: moduleId, english: '' };
    const color = moduleColors[moduleId] || Colors.accent;
    const exams = getModuleExams(moduleId);
    const mockExams = getMockExams(moduleId);
    const passageProgress = progress.passageProgress || {};
    const examProgress = progress.examProgress || {};

    return (
        <>
            <Stack.Screen
                options={{
                    title: moduleInfo.dutch,
                    headerStyle: { backgroundColor: Colors.cream },
                    headerTintColor: Colors.ink,
                    headerTitleStyle: { fontWeight: '700' },
                    headerShadowVisible: false,
                }}
            />
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}>
                {/* Module Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color }]}>{moduleInfo.dutch}</Text>
                    <Text style={styles.headerSubtitle}>{moduleInfo.english}</Text>
                </View>

                {/* Free Exams Section */}
                <Text style={styles.sectionLabel}>Practice Exams</Text>
                {exams.map((exam) => {
                    const isCompleted = passageProgress[exam.id]?.completed ||
                        progress.writingProgress?.[exam.id] ||
                        progress.speakingProgress?.[exam.id];
                    const prevScore = passageProgress[exam.id];

                    return (
                        <TouchableOpacity
                            key={exam.id}
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (['schrijven', 'spreken'].includes(moduleId)) {
                                    router.push(`/learn/${moduleId}/${exam.id}` as any);
                                } else {
                                    router.push(`/learn/${moduleId}/${exam.id}` as any);
                                }
                            }}>
                            <View style={styles.cardRow}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{exam.title}</Text>
                                    {exam.description && (
                                        <Text style={styles.cardDescription}>{exam.description}</Text>
                                    )}
                                    <View style={styles.cardMeta}>
                                        {exam.questionCount && (
                                            <Text style={styles.metaText}>{exam.questionCount} questions</Text>
                                        )}
                                        {exam.difficulty && (
                                            <View style={[styles.difficultyBadge, { borderColor: color }]}>
                                                <Text style={[styles.difficultyText, { color }]}>
                                                    {exam.difficulty}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <View style={styles.cardRight}>
                                    {isCompleted ? (
                                        <View style={styles.completedIcon}>
                                            <FontAwesome name="check-circle" size={22} color={Colors.green} />
                                            {prevScore && (
                                                <Text style={styles.scoreText}>
                                                    {Math.round((prevScore.correctAnswers / prevScore.totalQuestions) * 100)}%
                                                </Text>
                                            )}
                                        </View>
                                    ) : (
                                        <FontAwesome name="chevron-right" size={14} color={Colors.inkMuted} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Mock Exams Section */}
                {mockExams.length > 0 && (
                    <>
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Mock Exams</Text>
                        {mockExams.map((exam) => {
                            const isCompleted = examProgress[exam.id];

                            return (
                                <TouchableOpacity
                                    key={exam.id}
                                    style={[styles.card, styles.mockCard]}
                                    activeOpacity={0.7}
                                    onPress={() => router.push(`/learn/${moduleId}/mock/${exam.id}` as any)}>
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardContent}>
                                            <View style={styles.mockHeader}>
                                                <FontAwesome name="file-text-o" size={14} color={color} />
                                                <Text style={[styles.cardTitle, { marginLeft: 8 }]}>{exam.title}</Text>
                                            </View>
                                            {exam.description && (
                                                <Text style={styles.cardDescription}>{exam.description}</Text>
                                            )}
                                        </View>
                                        <View style={styles.cardRight}>
                                            {isCompleted ? (
                                                <View style={styles.completedIcon}>
                                                    <FontAwesome name="check-circle" size={22} color={Colors.green} />
                                                    <Text style={styles.scoreText}>
                                                        {Math.round((isCompleted.correctAnswers / isCompleted.totalQuestions) * 100)}%
                                                    </Text>
                                                </View>
                                            ) : (
                                                <FontAwesome name="chevron-right" size={14} color={Colors.inkMuted} />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </>
                )}
            </ScrollView>
        </>
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
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 15,
        color: Colors.inkSoft,
        marginTop: 2,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.inkMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        ...Shadows.card,
    },
    mockCard: {
        borderLeftWidth: 3,
        borderLeftColor: Colors.accent,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.ink,
    },
    cardDescription: {
        fontSize: 13,
        color: Colors.inkSoft,
        marginTop: 3,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    metaText: {
        fontSize: 12,
        color: Colors.inkMuted,
    },
    difficultyBadge: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 1,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    cardRight: {
        marginLeft: 12,
        alignItems: 'center',
    },
    completedIcon: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 11,
        color: Colors.green,
        fontWeight: '600',
        marginTop: 2,
    },
    mockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
