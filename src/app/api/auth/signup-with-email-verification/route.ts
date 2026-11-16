import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, deleteUser, updateProfile, type User } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, type DocumentReference } from 'firebase/firestore';
import app from '@/lib/firebase';

export async function POST(request: NextRequest) {
  let isolatedApp: ReturnType<typeof initializeApp> | undefined;
  let createdUser: User | undefined;
  let profile: DocumentReference | undefined;
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') return NextResponse.json({error:'Invalid request.'}, {status:400});
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (name.length < 2 || name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Enter your full name and a valid email address.' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Use a password between 8 and 128 characters.' }, { status: 400 });
    }
    if (body.role !== undefined && !['user', 'consultant'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid account type.' }, { status: 400 });
    }
    // Authentication state must never be shared by concurrent server requests.
    isolatedApp = initializeApp(app.options, `signup-${randomUUID()}`);
    const auth = getAuth(isolatedApp);
    const database = getFirestore(isolatedApp);
    createdUser = (await createUserWithEmailAndPassword(auth, email, password)).user;
    await updateProfile(createdUser, { displayName: name });
    profile = doc(database, 'users', createdUser.uid);
    await setDoc(profile, {
      uid: createdUser.uid, firebaseUid: createdUser.uid, email, displayName: name,
      role: 'user', requestedRole: body.role === 'consultant' ? 'consultant' : 'user',
      status: 'pending_verification', emailVerified: false, preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    });
    await sendEmailVerification(createdUser);
    return NextResponse.json({ success: true, message: 'Account created. Verification email sent.', email, role: 'user' });
  } catch (error) {
    // Only the account and profile created by this request may be rolled back.
    if (createdUser) {
      if (profile) await deleteDoc(profile).catch(() => undefined);
      await deleteUser(createdUser).catch(() => undefined);
    }
    const code = (error as {code?: string})?.code;
    if (code === 'auth/email-already-in-use') return NextResponse.json({error:'Email already in use. Sign in instead.'}, {status:400});
    if (code === 'auth/invalid-email' || code === 'auth/weak-password') return NextResponse.json({error:'Enter a valid email and a password of at least 8 characters.'}, {status:400});
    if (code === 'auth/too-many-requests') return NextResponse.json({error:'Too many attempts. Please try again later.'}, {status:429});
    if (error instanceof SyntaxError) return NextResponse.json({error:'Invalid request.'}, {status:400});
    console.error('Signup failed', code || 'unknown');
    return NextResponse.json({error:'Registration could not be completed. Please try again or contact PLUCO GROUP.'}, {status:500});
  } finally {
    if (isolatedApp) await deleteApp(isolatedApp).catch(() => undefined);
  }
}
