/**
 * Profile Tab — User profile, progress summary, and settings.
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

import Colors from '@/constants/Colors';
import Shadows from '@/constants/Shadows';
import { useProgress } from '@/hooks/useProgress';
import {
    getAllPassages,
    getAllKNMTopics,
    getAllListeningExercises,
    getAllWritingTasks,
    getAllSpeakingTasks,
} from '@/lib/content';

interface ProgressModuleInfo {
    id: string;
    name: string;
    color: string;
    completed: number;
    total: number;
}

function getModuleProgressList(progress: ReturnType<typeof useProgress>['progress']): ProgressModuleInfo[] {
    const passageProgress = progress.passageProgress || {};

    const passages = getAllPassages();
    const topics = getAllKNMTopics();
    const exercises = getAllListeningExercises();
    const writingTasks = getAllWritingTasks();
    const speakingTasks = getAllSpeakingTasks();

    return [
        {
            id: 'lezen',
            name: 'Lezen',
            color: Colors.accent,
            completed: passages.filter((p) => passageProgress[p.id]?.completed).length,
            total: passages.length,
        },
        {
            id: 'knm',
            name: 'KNM',
            color: Colors.blue,
            completed: topics.filter((t) => passageProgress[t.id]?.completed).length,
            total: topics.length,
        },
        {
            id: 'luisteren',
            name: 'Luisteren',
            color: Colors.green,
            completed: exercises.filter((e) => passageProgress[e.id]?.completed).length,
            total: exercises.length,
        },
        {
            id: 'schrijven',
            name: 'Schrijven',
            color: '#8B5CF6',
            completed: writingTasks.filter((t) => progress.writingProgress?.[t.id]).length,
            total: writingTasks.length,
        },
        {
            id: 'spreken',
            name: 'Spreken',
            color: '#EC4899',
            completed: speakingTasks.filter((t) => progress.speakingProgress?.[t.id]).length,
            total: speakingTasks.length,
        },
    ];
}

export default function ProfileScreen() {
    const { progress, loading } = useProgress();
    const moduleProgressList = loading ? [] : getModuleProgressList(progress);

    const totalCompleted = moduleProgressList.reduce((sum, m) => sum + m.completed, 0);
    const totalItems = moduleProgressList.reduce((sum, m) => sum + m.total, 0);
    const overallPercent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}>
            {/* Profile Header — Guest state */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <FontAwesome name="user-circle" size={56} color={Colors.inkMuted} />
                </View>
                <Text style={styles.guestLabel}>Guest</Text>
                <TouchableOpacity style={styles.loginButton} activeOpacity={0.7}>
                    <Text style={styles.loginButtonText}>Sign in to sync progress</Text>
                </TouchableOpacity>
            </View>

            {/* Overall Progress */}
            <View style={styles.overallCard}>
                <Text style={styles.sectionTitle}>Overall Progress</Text>
                <View style={styles.overallStats}>
                    <Text style={styles.overallPercent}>{overallPercent}%</Text>
                    <Text style={styles.overallSubtext}>
                        {totalCompleted} / {totalItems} exercises completed
                    </Text>
                </View>
                <View style={styles.overallProgressBar}>
                    <View
                        style={[
                            styles.overallProgressFill,
                            { width: `${overallPercent}%` },
                        ]}
                    />
                </View>
            </View>

            {/* Per-Module Progress */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>By Module</Text>
                {moduleProgressList.map((mod) => {
                    const percent = mod.total > 0 ? Math.round((mod.completed / mod.total) * 100) : 0;
                    return (
                        <View key={mod.id} style={styles.moduleRow}>
                            <Text style={styles.moduleName}>{mod.name}</Text>
                            <View style={styles.moduleProgressBar}>
                                <View
                                    style={[
                                        styles.moduleProgressFill,
                                        { width: `${percent}%`, backgroundColor: mod.color },
                                    ]}
                                />
                            </View>
                            <Text style={styles.moduleProgressText}>
                                {mod.completed}/{mod.total}
                            </Text>
                        </View>
                    );
                })}
            </View>

            {/* Settings */}
            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.settingsRow}>
                    <FontAwesome name="bell" size={16} color={Colors.inkSoft} />
                    <Text style={styles.settingsText}>Push Notifications</Text>
                    <FontAwesome name="chevron-right" size={12} color={Colors.inkMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsRow}>
                    <FontAwesome name="cloud" size={16} color={Colors.inkSoft} />
                    <Text style={styles.settingsText}>Cloud Sync</Text>
                    <FontAwesome name="chevron-right" size={12} color={Colors.inkMuted} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsRow}>
                    <FontAwesome name="info-circle" size={16} color={Colors.inkSoft} />
                    <Text style={styles.settingsText}>About</Text>
                    <FontAwesome name="chevron-right" size={12} color={Colors.inkMuted} />
                </TouchableOpacity>
            </View>
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: 24,
        paddingVertical: 16,
    },
    avatarContainer: {
        marginBottom: 8,
    },
    guestLabel: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.ink,
        marginBottom: 8,
    },
    loginButton: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    loginButtonText: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
    overallCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Shadows.card,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.ink,
        marginBottom: 14,
    },
    overallStats: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 10,
    },
    overallPercent: {
        fontSize: 36,
        fontWeight: '800',
        color: Colors.accent,
    },
    overallSubtext: {
        fontSize: 13,
        color: Colors.inkMuted,
    },
    overallProgressBar: {
        height: 8,
        backgroundColor: Colors.creamDark,
        borderRadius: 4,
        overflow: 'hidden',
    },
    overallProgressFill: {
        height: '100%',
        backgroundColor: Colors.accent,
        borderRadius: 4,
    },
    sectionCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...Shadows.card,
    },
    moduleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    moduleName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.ink,
        width: 80,
    },
    moduleProgressBar: {
        flex: 1,
        height: 6,
        backgroundColor: Colors.creamDark,
        borderRadius: 3,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    moduleProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    moduleProgressText: {
        fontSize: 12,
        color: Colors.inkMuted,
        width: 36,
        textAlign: 'right',
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        gap: 12,
    },
    settingsText: {
        flex: 1,
        fontSize: 15,
        color: Colors.ink,
    },
});
