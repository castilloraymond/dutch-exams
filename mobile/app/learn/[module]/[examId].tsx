/**
 * Exam Flow Screen — /learn/[module]/[examId].tsx
 * Core question/answer interface for KNM, Lezen, and Luisteren.
 * Handles question navigation, answer selection, timer, bookmarks, and content panel.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import {
    getPassage,
    getKNMTopic,
    getListeningExercise,
    getMockExam,
} from '@/lib/content';
import { useExamState } from '@/hooks/useExamState';
import { useProgress } from '@/hooks/useProgress';
import { formatTime, isPassing } from '@/lib/utils';
import type { Question, Passage, KNMTopic, ListeningExercise } from '@/lib/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ExamFlowScreen() {
    const { module, examId } = useLocalSearchParams<{ module: string; examId: string }>();
    const router = useRouter();
    const { recordAnswer, recordExamCompletion } = useProgress();
    const [showQuestionGrid, setShowQuestionGrid] = useState(false);
    const [elapsed, setElapsed] = useState(0);

    // Load content based on module
    const moduleId = module || 'lezen';
    const id = examId || '';

    let questions: Question[] = [];
    let contentTitle = '';
    let contentText: string | undefined;
    let isMockExam = false;

    // Check if it's a mock exam
    if (id.includes('-a1-') || id.includes('-a2-')) {
        const mockExam = getMockExam(id);
        if (mockExam) {
            questions = mockExam.questions;
            contentTitle = mockExam.title;
            isMockExam = true;
        }
    } else {
        switch (moduleId) {
            case 'lezen': {
                const passage = getPassage(id);
                if (passage) {
                    questions = passage.questions;
                    contentTitle = passage.title;
                    contentText = passage.content;
                }
                break;
            }
            case 'knm': {
                const topic = getKNMTopic(id);
                if (topic) {
                    questions = topic.questions;
                    contentTitle = topic.title;
                }
                break;
            }
            case 'luisteren': {
                const exercise = getListeningExercise(id);
                if (exercise) {
                    questions = exercise.questions;
                    contentTitle = exercise.title;
                    contentText = exercise.transcript;
                }
                break;
            }
        }
    }

    const handleComplete = useCallback(
        async (answers: Record<string, number | null>, timeTaken: number) => {
            let correct = 0;
            for (const q of questions) {
                if (answers[q.id] === q.correctIndex) correct++;
            }

            if (isMockExam) {
                await recordExamCompletion(id, correct, questions.length);
            } else {
                // Record each answer for progress tracking
                for (const q of questions) {
                    const userAnswer = answers[q.id];
                    if (userAnswer !== null && userAnswer !== undefined) {
                        await recordAnswer(id, q.id, userAnswer === q.correctIndex, questions.length);
                    }
                }
            }
        },
        [id, isMockExam, questions, recordAnswer, recordExamCompletion]
    );

    const exam = useExamState({ questions, onComplete: handleComplete });

    // Timer
    useEffect(() => {
        const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Content not found</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.emptyLink}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const currentQ = exam.currentQuestion;
    const selectedAnswer = currentQ ? exam.answers[currentQ.id] ?? null : null;

    if (exam.isSubmitted) {
        // Navigate to results
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <ResultsView
                    score={exam.score}
                    total={exam.totalQuestions}
                    answerRecords={exam.answerRecords}
                    timeTaken={elapsed}
                    contentTitle={contentTitle}
                    moduleId={moduleId}
                    onTryAgain={exam.resetExam}
                    onGoBack={() => router.back()}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header Bar */}
            <View style={styles.headerBar}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        Alert.alert(
                            'Leave Exam?',
                            'Your progress on this exam will be lost.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Leave', style: 'destructive', onPress: () => router.back() },
                            ]
                        );
                    }}>
                    <FontAwesome name="times" size={20} color={Colors.ink} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerModuleName}>{contentTitle}</Text>
                    <Text style={styles.headerProgress}>
                        Question {exam.currentQuestionIndex + 1} of {exam.totalQuestions}
                    </Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBarFill,
                        {
                            width: `${((exam.currentQuestionIndex + 1) / exam.totalQuestions) * 100}%`,
                        },
                    ]}
                />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                {/* Content Panel (Lezen / Luisteren) */}
                {contentText && (
                    <View style={styles.contentPanel}>
                        <Text style={styles.contentText}>{contentText}</Text>
                    </View>
                )}

                {/* Question */}
                {currentQ && (
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionText}>{currentQ.text}</Text>

                        {/* Answer Options */}
                        {currentQ.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        isSelected && styles.optionButtonSelected,
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => exam.selectAnswer(currentQ.id, index)}>
                                    <View style={[styles.optionRadio, isSelected && styles.optionRadioSelected]}>
                                        {isSelected && <View style={styles.optionRadioDot} />}
                                    </View>
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isSelected && styles.optionTextSelected,
                                        ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Question Grid Toggle */}
            {showQuestionGrid && (
                <View style={styles.gridOverlay}>
                    <View style={styles.gridContainer}>
                        <Text style={styles.gridTitle}>Questions</Text>
                        <View style={styles.gridItems}>
                            {questions.map((q, idx) => {
                                const isAnswered = exam.answers[q.id] !== undefined && exam.answers[q.id] !== null;
                                const isCurrent = idx === exam.currentQuestionIndex;
                                const isBookmarked = exam.bookmarked.has(q.id);

                                return (
                                    <TouchableOpacity
                                        key={q.id}
                                        style={[
                                            styles.gridItem,
                                            isAnswered && styles.gridItemAnswered,
                                            isCurrent && styles.gridItemCurrent,
                                            isBookmarked && styles.gridItemBookmarked,
                                        ]}
                                        onPress={() => {
                                            exam.goToQuestion(idx);
                                            setShowQuestionGrid(false);
                                        }}>
                                        <Text
                                            style={[
                                                styles.gridItemText,
                                                isAnswered && styles.gridItemTextAnswered,
                                                isCurrent && styles.gridItemTextCurrent,
                                            ]}>
                                            {idx + 1}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <TouchableOpacity
                            style={styles.gridClose}
                            onPress={() => setShowQuestionGrid(false)}>
                            <Text style={styles.gridCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.navButton, exam.currentQuestionIndex === 0 && styles.navButtonDisabled]}
                    disabled={exam.currentQuestionIndex === 0}
                    onPress={exam.previousQuestion}>
                    <FontAwesome name="chevron-left" size={14} color={exam.currentQuestionIndex === 0 ? Colors.inkMuted : Colors.ink} />
                    <Text style={[styles.navButtonText, exam.currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <View style={styles.navCenter}>
                    <TouchableOpacity
                        style={styles.gridToggle}
                        onPress={() => setShowQuestionGrid(!showQuestionGrid)}>
                        <FontAwesome name="th" size={18} color={Colors.inkSoft} />
                    </TouchableOpacity>
                    {currentQ && (
                        <TouchableOpacity
                            style={styles.bookmarkToggle}
                            onPress={() => exam.toggleBookmark(currentQ.id)}>
                            <FontAwesome
                                name={exam.bookmarked.has(currentQ.id) ? 'bookmark' : 'bookmark-o'}
                                size={18}
                                color={exam.bookmarked.has(currentQ.id) ? Colors.accent : Colors.inkSoft}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {exam.currentQuestionIndex < exam.totalQuestions - 1 ? (
                    <TouchableOpacity style={styles.navButton} onPress={exam.nextQuestion}>
                        <Text style={styles.navButtonText}>Next</Text>
                        <FontAwesome name="chevron-right" size={14} color={Colors.ink} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.navButton, styles.submitButton]}
                        onPress={() => {
                            const unanswered = exam.totalQuestions - exam.answeredCount;
                            if (unanswered > 0) {
                                Alert.alert(
                                    'Submit Exam?',
                                    `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submit anyway?`,
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Submit', onPress: exam.submit },
                                    ]
                                );
                            } else {
                                exam.submit();
                            }
                        }}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

/* ============================================ */
/* Results View (inline component)              */
/* ============================================ */

interface ResultsViewProps {
    score: number;
    total: number;
    answerRecords: ReturnType<typeof useExamState>['answerRecords'];
    timeTaken: number;
    contentTitle: string;
    moduleId: string;
    onTryAgain: () => void;
    onGoBack: () => void;
}

function ResultsView({
    score,
    total,
    answerRecords,
    timeTaken,
    contentTitle,
    moduleId,
    onTryAgain,
    onGoBack,
}: ResultsViewProps) {
    const percentage = Math.round((score / total) * 100);
    const passed = isPassing(score, total);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

    const toggleQuestion = (id: string) => {
        setExpandedQuestions((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.resultsContent}
            showsVerticalScrollIndicator={false}>
            {/* Score Header */}
            <View style={[styles.scoreCard, passed ? styles.scoreCardPass : styles.scoreCardFail]}>
                <Text style={styles.scoreEmoji}>{passed ? '🎉' : '📖'}</Text>
                <Text style={[styles.scoreLabel, passed ? styles.scoreLabelPass : styles.scoreLabelFail]}>
                    {passed ? 'Geslaagd!' : 'Niet Geslaagd'}
                </Text>
                <Text style={styles.scorePercentage}>{percentage}%</Text>
                <Text style={styles.scoreDetail}>
                    {score} / {total} correct · {formatTime(timeTaken)}
                </Text>
                <Text style={styles.scoreThreshold}>
                    Pass threshold: 60%
                </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.actionButtonPrimary} onPress={onTryAgain}>
                    <FontAwesome name="refresh" size={14} color={Colors.white} />
                    <Text style={styles.actionButtonPrimaryText}>Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButtonSecondary} onPress={onGoBack}>
                    <FontAwesome name="arrow-left" size={14} color={Colors.ink} />
                    <Text style={styles.actionButtonSecondaryText}>Back</Text>
                </TouchableOpacity>
            </View>

            {/* Answer Review */}
            <Text style={styles.reviewTitle}>Answer Review</Text>
            {answerRecords.map((record, idx) => {
                const isCorrect = record.userAnswer === record.correctAnswer;
                const isExpanded = expandedQuestions.has(record.questionId);

                return (
                    <TouchableOpacity
                        key={record.questionId}
                        style={[
                            styles.reviewCard,
                            isCorrect ? styles.reviewCardCorrect : styles.reviewCardIncorrect,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => toggleQuestion(record.questionId)}>
                        <View style={styles.reviewHeader}>
                            <FontAwesome
                                name={isCorrect ? 'check-circle' : 'times-circle'}
                                size={18}
                                color={isCorrect ? Colors.green : Colors.red}
                            />
                            <Text style={styles.reviewQuestionNumber}>Q{idx + 1}</Text>
                            <Text style={styles.reviewQuestionText} numberOfLines={isExpanded ? undefined : 2}>
                                {record.questionText}
                            </Text>
                            <FontAwesome
                                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                size={12}
                                color={Colors.inkMuted}
                            />
                        </View>
                        {isExpanded && (
                            <View style={styles.reviewDetails}>
                                {record.options.map((opt, optIdx) => {
                                    const isUserAnswer = record.userAnswer === optIdx;
                                    const isCorrectAnswer = record.correctAnswer === optIdx;

                                    return (
                                        <View
                                            key={optIdx}
                                            style={[
                                                styles.reviewOption,
                                                isCorrectAnswer && styles.reviewOptionCorrect,
                                                isUserAnswer && !isCorrectAnswer && styles.reviewOptionIncorrect,
                                            ]}>
                                            <Text style={styles.reviewOptionText}>
                                                {isCorrectAnswer ? '✓ ' : isUserAnswer ? '✗ ' : '  '}
                                                {opt}
                                            </Text>
                                        </View>
                                    );
                                })}
                                {(record.explanation || record.explanationEn) && (
                                    <View style={styles.explanationBox}>
                                        {record.explanation && (
                                            <Text style={styles.explanationText}>{record.explanation}</Text>
                                        )}
                                        {record.explanationEn && (
                                            <Text style={styles.explanationTextEn}>{record.explanationEn}</Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

/* ============================================ */
/* Styles                                       */
/* ============================================ */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.cream,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: Colors.inkSoft,
    },
    emptyLink: {
        fontSize: 16,
        color: Colors.accent,
        marginTop: 12,
    },

    // Header
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    closeButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerModuleName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.ink,
    },
    headerProgress: {
        fontSize: 12,
        color: Colors.inkMuted,
        marginTop: 1,
    },
    headerRight: {
        width: 60,
        alignItems: 'flex-end',
    },
    timerText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.inkSoft,
        fontVariant: ['tabular-nums'],
    },

    // Progress Bar
    progressBarContainer: {
        height: 3,
        backgroundColor: Colors.creamDark,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.accent,
    },

    // Content
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 20,
    },
    contentPanel: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: Colors.accent,
    },
    contentText: {
        fontSize: 15,
        color: Colors.ink,
        lineHeight: 24,
    },

    // Question
    questionContainer: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.ink,
        lineHeight: 24,
        marginBottom: 16,
    },

    // Options
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: Colors.borderLight,
    },
    optionButtonSelected: {
        borderColor: Colors.accent,
        backgroundColor: Colors.accentSoft,
    },
    optionRadio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionRadioSelected: {
        borderColor: Colors.accent,
    },
    optionRadioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.accent,
    },
    optionText: {
        flex: 1,
        fontSize: 15,
        color: Colors.ink,
        lineHeight: 22,
    },
    optionTextSelected: {
        fontWeight: '600',
    },

    // Question Grid
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    gridContainer: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
    },
    gridTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.ink,
        marginBottom: 16,
        textAlign: 'center',
    },
    gridItems: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
    },
    gridItem: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: Colors.creamDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridItemAnswered: {
        backgroundColor: Colors.accentSoft,
    },
    gridItemCurrent: {
        backgroundColor: Colors.accent,
    },
    gridItemBookmarked: {
        borderWidth: 2,
        borderColor: Colors.accent,
    },
    gridItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.ink,
    },
    gridItemTextAnswered: {
        color: Colors.accent,
    },
    gridItemTextCurrent: {
        color: Colors.white,
    },
    gridClose: {
        marginTop: 16,
        alignItems: 'center',
    },
    gridCloseText: {
        fontSize: 16,
        color: Colors.accent,
        fontWeight: '600',
    },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    navButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.ink,
    },
    navButtonTextDisabled: {
        color: Colors.inkMuted,
    },
    navCenter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    gridToggle: {
        padding: 8,
    },
    bookmarkToggle: {
        padding: 8,
    },
    submitButton: {
        backgroundColor: Colors.accent,
        borderRadius: 10,
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.white,
    },

    // Results
    resultsContent: {
        padding: 20,
        paddingBottom: 40,
    },
    scoreCard: {
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginBottom: 20,
    },
    scoreCardPass: {
        backgroundColor: Colors.greenSoft,
    },
    scoreCardFail: {
        backgroundColor: Colors.redSoft,
    },
    scoreEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    scoreLabel: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 4,
    },
    scoreLabelPass: {
        color: Colors.green,
    },
    scoreLabelFail: {
        color: Colors.red,
    },
    scorePercentage: {
        fontSize: 48,
        fontWeight: '800',
        color: Colors.ink,
        marginBottom: 4,
    },
    scoreDetail: {
        fontSize: 15,
        color: Colors.inkSoft,
    },
    scoreThreshold: {
        fontSize: 12,
        color: Colors.inkMuted,
        marginTop: 8,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    actionButtonPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.accent,
        paddingVertical: 14,
        borderRadius: 12,
    },
    actionButtonPrimaryText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.white,
    },
    actionButtonSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    actionButtonSecondaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.ink,
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.ink,
        marginBottom: 12,
    },
    reviewCard: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderLeftWidth: 3,
    },
    reviewCardCorrect: {
        backgroundColor: Colors.greenSoft,
        borderLeftColor: Colors.green,
    },
    reviewCardIncorrect: {
        backgroundColor: Colors.redSoft,
        borderLeftColor: Colors.red,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reviewQuestionNumber: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.inkSoft,
    },
    reviewQuestionText: {
        flex: 1,
        fontSize: 14,
        color: Colors.ink,
        lineHeight: 20,
    },
    reviewDetails: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
    reviewOption: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 4,
    },
    reviewOptionCorrect: {
        backgroundColor: 'rgba(45, 143, 94, 0.12)',
    },
    reviewOptionIncorrect: {
        backgroundColor: 'rgba(220, 38, 38, 0.08)',
    },
    reviewOptionText: {
        fontSize: 14,
        color: Colors.ink,
    },
    explanationBox: {
        marginTop: 8,
        padding: 12,
        backgroundColor: Colors.blueSoft,
        borderRadius: 8,
    },
    explanationText: {
        fontSize: 13,
        color: Colors.ink,
        lineHeight: 20,
    },
    explanationTextEn: {
        fontSize: 13,
        color: Colors.inkSoft,
        lineHeight: 20,
        marginTop: 4,
        fontStyle: 'italic',
    },
});
