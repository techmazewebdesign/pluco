import admin from 'firebase-admin';

const APPLY = process.argv.includes('--apply');
const TARGET_EMAIL = 'sara.rezai9031@gmail.com';
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase Admin credentials are not configured.');
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

async function run() {
  let user;
  try { user = await admin.auth().getUserByEmail(TARGET_EMAIL); }
  catch (error) {
    if (error?.code === 'auth/user-not-found') {
      console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'preflight', email: TARGET_EMAIL, authUserExists: false, applied: false, next: 'Sara must sign in once with Google on PLUCO before native Firebase admin claims can be assigned.' }));
      return;
    }
    throw error;
  }
  const profile = await admin.firestore().collection('users').doc(user.uid).get();
  console.log(JSON.stringify({ mode: APPLY ? 'apply' : 'preflight', email: TARGET_EMAIL, uid: user.uid, authUserExists: true, currentClaimRole: user.customClaims?.role ?? null, profileRole: profile.data()?.role ?? null }));
  if (!APPLY) return;
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims ?? {}), role: 'admin', siteAdmin: true });
  await admin.firestore().collection('users').doc(user.uid).set({ uid: user.uid, email: TARGET_EMAIL, role: 'admin', isAdmin: true, is_admin: true, active: true, siteAdmin: true, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: 'desivo-site-admin-grant' }, { merge: true });
  const verified = await admin.auth().getUser(user.uid);
  const verifiedProfile = await admin.firestore().collection('users').doc(user.uid).get();
  if (verified.customClaims?.role !== 'admin' || verifiedProfile.data()?.role !== 'admin') throw new Error('PLUCO admin verification failed.');
  console.log(JSON.stringify({ verified: true, email: TARGET_EMAIL, uid: user.uid, role: 'admin' }));
}

run().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exit(1); });
