import { db, isPostgresConfigured } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import { UserProfile } from '../types';
import { store } from '../lib/store';

export async function getOrCreateUser(profile: Partial<UserProfile> & { id: string; email: string }) {
  // Always update in-memory store
  const storedUser = store.upsertUser({
    id: profile.id,
    name: profile.name || 'Anonymous User',
    email: profile.email,
    role: profile.role || 'USER',
    phone: profile.phone,
    gender: profile.gender,
    age: profile.age,
    emergencyPhone: profile.emergencyPhone || '14566',
    emergencyContactName: profile.emergencyContactName,
    emergencyContactRelationship: profile.emergencyContactRelationship,
    passportCountry: profile.passportCountry,
    city: profile.city || profile.location?.city,
    region: profile.region || profile.location?.region,
    country: profile.country || profile.location?.country,
    location: profile.location,
    deviceInfo: profile.deviceInfo,
    ipAddress: profile.ipAddress,
    status: profile.status || 'ACTIVE',
    isOriginalUser: profile.isOriginalUser || profile.email === 'velayutham7286@gmail.com',
    notes: profile.notes,
  });

  if (!isPostgresConfigured() || !db) {
    return storedUser as any;
  }

  try {
    const result = await db.insert(users)
      .values({
        uid: profile.id,
        name: profile.name || 'Anonymous User',
        email: profile.email,
        role: profile.role || 'USER',
        phone: profile.phone,
        gender: profile.gender,
        age: profile.age,
        emergencyPhone: profile.emergencyPhone || '14566',
        emergencyContactName: profile.emergencyContactName,
        emergencyContactRelationship: profile.emergencyContactRelationship,
        passportCountry: profile.passportCountry,
        city: profile.city || profile.location?.city,
        region: profile.region || profile.location?.region,
        country: profile.country || profile.location?.country,
        address: profile.location?.address,
        latitude: profile.location?.lat,
        longitude: profile.location?.lng,
        deviceInfo: profile.deviceInfo,
        ipAddress: profile.ipAddress,
        status: profile.status || 'ACTIVE',
        isOriginalUser: profile.isOriginalUser || profile.email === 'velayutham7286@gmail.com',
        notes: profile.notes,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name: profile.name || undefined,
          email: profile.email,
          phone: profile.phone || undefined,
          gender: profile.gender || undefined,
          age: profile.age || undefined,
          emergencyPhone: profile.emergencyPhone || undefined,
          emergencyContactName: profile.emergencyContactName || undefined,
          emergencyContactRelationship: profile.emergencyContactRelationship || undefined,
          city: profile.city || profile.location?.city || undefined,
          region: profile.region || profile.location?.region || undefined,
          country: profile.country || profile.location?.country || undefined,
          address: profile.location?.address || undefined,
          latitude: profile.location?.lat || undefined,
          longitude: profile.location?.lng || undefined,
          deviceInfo: profile.deviceInfo || undefined,
          ipAddress: profile.ipAddress || undefined,
          status: profile.status || undefined,
          isOriginalUser: profile.isOriginalUser !== undefined ? profile.isOriginalUser : undefined,
          notes: profile.notes || undefined,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.warn('Database getOrCreateUser fallback to store:', error);
    return storedUser as any;
  }
}

export async function getAllUsersFromDb() {
  if (!isPostgresConfigured() || !db) {
    const storeUsers = store.getAllUsers();
    return storeUsers.map((u, idx) => ({
      id: idx + 1,
      uid: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'USER',
      phone: u.phone || null,
      gender: u.gender || null,
      age: u.age || null,
      emergencyPhone: u.emergencyPhone || '14566',
      emergencyContactName: u.emergencyContactName || null,
      emergencyContactRelationship: u.emergencyContactRelationship || null,
      passportCountry: u.passportCountry || null,
      city: u.city || u.location?.city || null,
      region: u.region || u.location?.region || null,
      country: u.country || u.location?.country || null,
      address: u.location?.address || null,
      latitude: u.location?.lat || null,
      longitude: u.location?.lng || null,
      deviceInfo: u.deviceInfo || null,
      ipAddress: u.ipAddress || null,
      status: u.status || 'ACTIVE',
      isOriginalUser: u.isOriginalUser ?? false,
      notes: u.notes || null,
      createdAt: u.registeredAt ? new Date(u.registeredAt) : new Date(),
    }));
  }

  try {
    return await db.select().from(users);
  } catch (error) {
    console.warn('Database getAllUsers fallback to store:', error);
    const storeUsers = store.getAllUsers();
    return storeUsers.map((u, idx) => ({
      id: idx + 1,
      uid: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'USER',
      phone: u.phone || null,
      gender: u.gender || null,
      age: u.age || null,
      emergencyPhone: u.emergencyPhone || '14566',
      emergencyContactName: u.emergencyContactName || null,
      emergencyContactRelationship: u.emergencyContactRelationship || null,
      passportCountry: u.passportCountry || null,
      city: u.city || u.location?.city || null,
      region: u.region || u.location?.region || null,
      country: u.country || u.location?.country || null,
      address: u.location?.address || null,
      latitude: u.location?.lat || null,
      longitude: u.location?.lng || null,
      deviceInfo: u.deviceInfo || null,
      ipAddress: u.ipAddress || null,
      status: u.status || 'ACTIVE',
      isOriginalUser: u.isOriginalUser ?? false,
      notes: u.notes || null,
      createdAt: u.registeredAt ? new Date(u.registeredAt) : new Date(),
    }));
  }
}

export async function getUserByUidFromDb(uid: string) {
  if (!isPostgresConfigured() || !db) {
    const u = store.getUserById(uid);
    if (!u) return null;
    return {
      id: 1,
      uid: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'USER',
      phone: u.phone || null,
      gender: u.gender || null,
      age: u.age || null,
      emergencyPhone: u.emergencyPhone || '14566',
      emergencyContactName: u.emergencyContactName || null,
      emergencyContactRelationship: u.emergencyContactRelationship || null,
      passportCountry: u.passportCountry || null,
      city: u.city || u.location?.city || null,
      region: u.region || u.location?.region || null,
      country: u.country || u.location?.country || null,
      address: u.location?.address || null,
      latitude: u.location?.lat || null,
      longitude: u.location?.lng || null,
      deviceInfo: u.deviceInfo || null,
      ipAddress: u.ipAddress || null,
      status: u.status || 'ACTIVE',
      isOriginalUser: u.isOriginalUser ?? false,
      notes: u.notes || null,
      createdAt: u.registeredAt ? new Date(u.registeredAt) : new Date(),
    };
  }

  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.warn('Database getUserByUid fallback to store:', error);
    const u = store.getUserById(uid);
    if (!u) return null;
    return {
      id: 1,
      uid: u.id,
      name: u.name,
      email: u.email,
      role: u.role || 'USER',
      phone: u.phone || null,
      gender: u.gender || null,
      age: u.age || null,
      emergencyPhone: u.emergencyPhone || '14566',
      emergencyContactName: u.emergencyContactName || null,
      emergencyContactRelationship: u.emergencyContactRelationship || null,
      passportCountry: u.passportCountry || null,
      city: u.city || u.location?.city || null,
      region: u.region || u.location?.region || null,
      country: u.country || u.location?.country || null,
      address: u.location?.address || null,
      latitude: u.location?.lat || null,
      longitude: u.location?.lng || null,
      deviceInfo: u.deviceInfo || null,
      ipAddress: u.ipAddress || null,
      status: u.status || 'ACTIVE',
      isOriginalUser: u.isOriginalUser ?? false,
      notes: u.notes || null,
      createdAt: u.registeredAt ? new Date(u.registeredAt) : new Date(),
    };
  }
}

