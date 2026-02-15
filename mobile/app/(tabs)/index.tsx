/**
 * Practice Tab (Home) — Module Dashboard
 * Shows 5 module cards with progress indicators.
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
import { useProgress } from '@/hooks/useProgress';
import {
  getAllPassages,
  getAllKNMTopics,
  getAllListeningExercises,
  getAllWritingTasks,
  getAllSpeakingTasks,
  getMockExamIndex,
} from '@/lib/content';

interface ModuleConfig {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  colorSoft: string;
}

const modules: ModuleConfig[] = [
  {
    id: 'lezen',
    name: 'Lezen',
    nameEn: 'Reading',
    description: 'Practice reading comprehension with Dutch texts',
    icon: 'book',
    color: Colors.accent,
    colorSoft: Colors.accentSoft,
  },
  {
    id: 'knm',
    name: 'KNM',
    nameEn: 'Society Knowledge',
    description: 'Learn about Dutch society, history, and culture',
    icon: 'globe',
    color: Colors.blue,
    colorSoft: Colors.blueSoft,
  },
  {
    id: 'luisteren',
    name: 'Luisteren',
    nameEn: 'Listening',
    description: 'Practice listening to Dutch conversations',
    icon: 'headphones',
    color: Colors.green,
    colorSoft: Colors.greenSoft,
  },
  {
    id: 'schrijven',
    name: 'Schrijven',
    nameEn: 'Writing',
    description: 'Practice writing emails, messages, and forms',
    icon: 'pencil',
    color: '#8B5CF6',
    colorSoft: '#F3F0FF',
  },
  {
    id: 'spreken',
    name: 'Spreken',
    nameEn: 'Speaking',
    description: 'Practice speaking and pronunciation',
    icon: 'microphone',
    color: '#EC4899',
    colorSoft: '#FDF2F8',
  },
];

function getModuleProgress(moduleId: string, progress: ReturnType<typeof useProgress>['progress']) {
  const passageProgress = progress.passageProgress || {};

  switch (moduleId) {
    case 'lezen': {
      const passages = getAllPassages();
      const total = passages.length;
      const completed = passages.filter((p) => passageProgress[p.id]?.completed).length;
      return { completed, total };
    }
    case 'knm': {
      const topics = getAllKNMTopics();
      const total = topics.length;
      const completed = topics.filter((t) => passageProgress[t.id]?.completed).length;
      return { completed, total };
    }
    case 'luisteren': {
      const exercises = getAllListeningExercises();
      const total = exercises.length;
      const completed = exercises.filter((e) => passageProgress[e.id]?.completed).length;
      return { completed, total };
    }
    case 'schrijven': {
      const tasks = getAllWritingTasks();
      const total = tasks.length;
      const completed = tasks.filter((t) => progress.writingProgress?.[t.id]).length;
      return { completed, total };
    }
    case 'spreken': {
      const tasks = getAllSpeakingTasks();
      const total = tasks.length;
      const completed = tasks.filter((t) => progress.speakingProgress?.[t.id]).length;
      return { completed, total };
    }
    default:
      return { completed: 0, total: 0 };
  }
}

function getMockExamCount(moduleId: string): number {
  if (!['lezen', 'knm', 'luisteren'].includes(moduleId)) return 0;
  const index = getMockExamIndex(moduleId);
  return index?.exams.length || 0;
}

export default function PracticeScreen() {
  const { progress, loading } = useProgress();
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>📚 Practice Exams</Text>
        <Text style={styles.bannerSubtitle}>
          Prepare for all 5 sections of the Dutch inburgering exam
        </Text>
      </View>

      {/* Module Cards */}
      {modules.map((mod) => {
        const moduleProgress = loading
          ? { completed: 0, total: 0 }
          : getModuleProgress(mod.id, progress);
        const mockCount = getMockExamCount(mod.id);
        const progressPercent =
          moduleProgress.total > 0
            ? Math.round((moduleProgress.completed / moduleProgress.total) * 100)
            : 0;

        return (
          <TouchableOpacity
            key={mod.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/learn/${mod.id}` as any)}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: mod.colorSoft }]}>
                <FontAwesome name={mod.icon} size={22} color={mod.color} />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{mod.name}</Text>
                <Text style={styles.cardNameEn}>{mod.nameEn}</Text>
              </View>
              {moduleProgress.completed >= moduleProgress.total && moduleProgress.total > 0 && (
                <View style={styles.completedBadge}>
                  <FontAwesome name="check" size={12} color={Colors.white} />
                </View>
              )}
            </View>

            <Text style={styles.cardDescription}>{mod.description}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercent}%`,
                      backgroundColor: mod.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {moduleProgress.completed}/{moduleProgress.total} completed
              </Text>
            </View>

            {/* Mock Exam Count */}
            {mockCount > 0 && (
              <View style={styles.mockExamBadge}>
                <FontAwesome name="file-text-o" size={12} color={Colors.inkMuted} />
                <Text style={styles.mockExamText}>
                  {mockCount} mock exam{mockCount !== 1 ? 's' : ''} available
                </Text>
              </View>
            )}

            {/* Chevron */}
            <View style={styles.chevron}>
              <FontAwesome name="chevron-right" size={14} color={Colors.inkMuted} />
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
  banner: {
    marginBottom: 24,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 15,
    color: Colors.inkSoft,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Shadows.card,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  cardNameEn: {
    fontSize: 13,
    color: Colors.inkMuted,
    marginTop: 1,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.inkSoft,
    lineHeight: 20,
    marginBottom: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.creamDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.inkMuted,
    minWidth: 90,
    textAlign: 'right',
  },
  mockExamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  mockExamText: {
    fontSize: 12,
    color: Colors.inkMuted,
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },
});
