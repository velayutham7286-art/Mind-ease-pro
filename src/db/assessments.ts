import { db, isPostgresConfigured } from './index';
import { assessments, emergencyAlerts, users } from './schema';
import { desc, eq } from 'drizzle-orm';
import { AssessmentResult } from '../types';
import { store } from '../lib/store';

export async function saveAssessmentToDb(asm: AssessmentResult) {
  // Always update in-memory store
  store.addAssessment(asm);

  if (!isPostgresConfigured() || !db) {
    return asm as any;
  }

  try {
    // Find relational user ID by Firebase Auth UID if exists
    let userRelationalId: number | undefined;
    try {
      const foundUser = await db.select({ id: users.id }).from(users).where(eq(users.uid, asm.userId)).limit(1);
      if (foundUser.length > 0) {
        userRelationalId = foundUser[0].id;
      }
    } catch {
      // Non-blocking if users table lookup fails
    }

    const inserted = await db.insert(assessments)
      .values({
        id: asm.id,
        userId: userRelationalId,
        uid: asm.userId,
        userEmail: asm.userEmail || 'user@mind-ease.org',
        userName: asm.userName || 'User',
        stressScore: asm.stressScore,
        stressCategory: asm.stressCategory,
        transcript: asm.transcript,
        audioDuration: asm.audioDuration,
        speakingWpm: asm.acousticMetrics?.speakingWpm,
        pauseLengthSeconds: asm.acousticMetrics?.pauseLengthSeconds,
        pitchFluctuationHz: asm.acousticMetrics?.pitchFluctuationHz,
        vocalTensionScore: asm.acousticMetrics?.vocalTensionScore,
        tempoRhythm: asm.acousticMetrics?.tempoRhythm,
        sentimentScore: asm.sentimentMetrics?.sentimentScore,
        anxietyLexiconScore: asm.sentimentMetrics?.anxietyLexiconScore,
        primaryEmotion: asm.sentimentMetrics?.primaryEmotion,
        breakdownJson: JSON.stringify(asm.breakdown || []),
        locationJson: asm.location ? JSON.stringify(asm.location) : undefined,
        highRiskFlag: asm.highRiskFlag,
        smsStatus: asm.smsStatus,
        smsSid: asm.smsSid,
        smsRecipient: asm.smsRecipient,
        smsDispatchedAt: asm.smsDispatchedAt,
        emergencyAlertTriggered: asm.emergencyAlertTriggered || false,
        createdAt: asm.createdAt ? new Date(asm.createdAt) : new Date(),
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.warn('Database saveAssessment fallback to store:', error);
    return asm as any;
  }
}

export async function getAllAssessmentsFromDb() {
  if (!isPostgresConfigured() || !db) {
    const list = store.getAllAssessments();
    return list.map((a, idx) => ({
      id: a.id || `asm_${idx}`,
      userId: idx + 1,
      uid: a.userId,
      userEmail: a.userEmail || 'user@mindease.care',
      userName: a.userName || 'User',
      stressScore: a.stressScore,
      stressCategory: a.stressCategory,
      transcript: a.transcript,
      audioDuration: a.audioDuration || 6.5,
      speakingWpm: a.acousticMetrics?.speakingWpm || 120,
      pauseLengthSeconds: a.acousticMetrics?.pauseLengthSeconds || 0.8,
      pitchFluctuationHz: a.acousticMetrics?.pitchFluctuationHz || 24,
      vocalTensionScore: a.acousticMetrics?.vocalTensionScore || 45,
      tempoRhythm: a.acousticMetrics?.tempoRhythm || 'Moderate Steady',
      sentimentScore: a.sentimentMetrics?.sentimentScore || 0,
      anxietyLexiconScore: a.sentimentMetrics?.anxietyLexiconScore || 30,
      primaryEmotion: a.sentimentMetrics?.primaryEmotion || 'Neutral',
      breakdownJson: JSON.stringify(a.breakdown || []),
      locationJson: a.location ? JSON.stringify(a.location) : undefined,
      highRiskFlag: a.highRiskFlag,
      smsStatus: a.smsStatus || 'SKIPPED',
      smsSid: a.smsSid || null,
      smsRecipient: a.smsRecipient || null,
      smsDispatchedAt: a.smsDispatchedAt || null,
      emergencyAlertTriggered: a.emergencyAlertTriggered || false,
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    }));
  }

  try {
    return await db.select().from(assessments).orderBy(desc(assessments.createdAt));
  } catch (error) {
    console.warn('Database getAllAssessments fallback to store:', error);
    const list = store.getAllAssessments();
    return list.map((a, idx) => ({
      id: a.id || `asm_${idx}`,
      userId: idx + 1,
      uid: a.userId,
      userEmail: a.userEmail || 'user@mindease.care',
      userName: a.userName || 'User',
      stressScore: a.stressScore,
      stressCategory: a.stressCategory,
      transcript: a.transcript,
      audioDuration: a.audioDuration || 6.5,
      speakingWpm: a.acousticMetrics?.speakingWpm || 120,
      pauseLengthSeconds: a.acousticMetrics?.pauseLengthSeconds || 0.8,
      pitchFluctuationHz: a.acousticMetrics?.pitchFluctuationHz || 24,
      vocalTensionScore: a.acousticMetrics?.vocalTensionScore || 45,
      tempoRhythm: a.acousticMetrics?.tempoRhythm || 'Moderate Steady',
      sentimentScore: a.sentimentMetrics?.sentimentScore || 0,
      anxietyLexiconScore: a.sentimentMetrics?.anxietyLexiconScore || 30,
      primaryEmotion: a.sentimentMetrics?.primaryEmotion || 'Neutral',
      breakdownJson: JSON.stringify(a.breakdown || []),
      locationJson: a.location ? JSON.stringify(a.location) : undefined,
      highRiskFlag: a.highRiskFlag,
      smsStatus: a.smsStatus || 'SKIPPED',
      smsSid: a.smsSid || null,
      smsRecipient: a.smsRecipient || null,
      smsDispatchedAt: a.smsDispatchedAt || null,
      emergencyAlertTriggered: a.emergencyAlertTriggered || false,
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    }));
  }
}

export async function getAssessmentsByUidFromDb(uid: string) {
  if (!isPostgresConfigured() || !db) {
    const list = store.getAllAssessments().filter(a => a.userId === uid);
    return list.map((a, idx) => ({
      id: a.id || `asm_${idx}`,
      userId: idx + 1,
      uid: a.userId,
      userEmail: a.userEmail || 'user@mindease.care',
      userName: a.userName || 'User',
      stressScore: a.stressScore,
      stressCategory: a.stressCategory,
      transcript: a.transcript,
      audioDuration: a.audioDuration || 6.5,
      speakingWpm: a.acousticMetrics?.speakingWpm || 120,
      pauseLengthSeconds: a.acousticMetrics?.pauseLengthSeconds || 0.8,
      pitchFluctuationHz: a.acousticMetrics?.pitchFluctuationHz || 24,
      vocalTensionScore: a.acousticMetrics?.vocalTensionScore || 45,
      tempoRhythm: a.acousticMetrics?.tempoRhythm || 'Moderate Steady',
      sentimentScore: a.sentimentMetrics?.sentimentScore || 0,
      anxietyLexiconScore: a.sentimentMetrics?.anxietyLexiconScore || 30,
      primaryEmotion: a.sentimentMetrics?.primaryEmotion || 'Neutral',
      breakdownJson: JSON.stringify(a.breakdown || []),
      locationJson: a.location ? JSON.stringify(a.location) : undefined,
      highRiskFlag: a.highRiskFlag,
      smsStatus: a.smsStatus || 'SKIPPED',
      smsSid: a.smsSid || null,
      smsRecipient: a.smsRecipient || null,
      smsDispatchedAt: a.smsDispatchedAt || null,
      emergencyAlertTriggered: a.emergencyAlertTriggered || false,
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    }));
  }

  try {
    return await db.select().from(assessments).where(eq(assessments.uid, uid)).orderBy(desc(assessments.createdAt));
  } catch (error) {
    console.warn('Database getAssessmentsByUid fallback to store:', error);
    const list = store.getAllAssessments().filter(a => a.userId === uid);
    return list.map((a, idx) => ({
      id: a.id || `asm_${idx}`,
      userId: idx + 1,
      uid: a.userId,
      userEmail: a.userEmail || 'user@mindease.care',
      userName: a.userName || 'User',
      stressScore: a.stressScore,
      stressCategory: a.stressCategory,
      transcript: a.transcript,
      audioDuration: a.audioDuration || 6.5,
      speakingWpm: a.acousticMetrics?.speakingWpm || 120,
      pauseLengthSeconds: a.acousticMetrics?.pauseLengthSeconds || 0.8,
      pitchFluctuationHz: a.acousticMetrics?.pitchFluctuationHz || 24,
      vocalTensionScore: a.acousticMetrics?.vocalTensionScore || 45,
      tempoRhythm: a.acousticMetrics?.tempoRhythm || 'Moderate Steady',
      sentimentScore: a.sentimentMetrics?.sentimentScore || 0,
      anxietyLexiconScore: a.sentimentMetrics?.anxietyLexiconScore || 30,
      primaryEmotion: a.sentimentMetrics?.primaryEmotion || 'Neutral',
      breakdownJson: JSON.stringify(a.breakdown || []),
      locationJson: a.location ? JSON.stringify(a.location) : undefined,
      highRiskFlag: a.highRiskFlag,
      smsStatus: a.smsStatus || 'SKIPPED',
      smsSid: a.smsSid || null,
      smsRecipient: a.smsRecipient || null,
      smsDispatchedAt: a.smsDispatchedAt || null,
      emergencyAlertTriggered: a.emergencyAlertTriggered || false,
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    }));
  }
}

export async function saveEmergencyAlertToDb(alert: {
  userId?: number;
  recipientPhone: string;
  recipientName: string;
  alertMessage: string;
  stressScore?: number;
  status?: string;
}) {
  if (!isPostgresConfigured() || !db) {
    return alert as any;
  }

  try {
    const inserted = await db.insert(emergencyAlerts)
      .values({
        userId: alert.userId,
        recipientPhone: alert.recipientPhone,
        recipientName: alert.recipientName,
        alertMessage: alert.alertMessage,
        stressScore: alert.stressScore,
        status: alert.status || 'SENT',
      })
      .returning();
    return inserted[0];
  } catch (error) {
    console.warn('Database saveEmergencyAlert fallback:', error);
    return alert as any;
  }
}

