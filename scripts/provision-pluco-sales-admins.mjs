import admin from 'firebase-admin';

const APPLY = process.argv.includes('--apply');
const ADMINS = [
  { email: 'techmazewebdesign@gmail.com', displayName: 'Techmaze Webdesign' },
  { email: 'rezaostad@googlemail.com', displayName: 'Reza Ostad' },
];

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
if (!projectId || !clientEmail || !privateKey) throw new Error('Firebase Admin credentials are not configured.');
admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });

const auth = admin.auth();
const db = admin.firestore();

async function run() {
  console.log(`Mode: ${APPLY ? 'APPLY' : 'READ-ONLY PREFLIGHT'}`);
  const users = [];
  for (const expected of ADMINS) {
    const user = await auth.getUserByEmail(expected.email);
    if (!user.emailVerified || user.disabled) throw new Error(`${expected.email} must be verified and active.`);
    users.push({ ...expected, uid: user.uid, claims: user.customClaims || {} });
    console.log(`${expected.email}: ${user.uid} verified`);
  }
  if (!APPLY) return;
  const now = admin.firestore.FieldValue.serverTimestamp();
  for (const user of users) {
    await auth.setCustomUserClaims(user.uid, { ...user.claims, admin: true, role: 'admin', plucoSalesRole: 'team_leader' });
    const adminProfile = { uid: user.uid, email: user.email, name: user.displayName, displayName: user.displayName, role: 'admin', isAdmin: true, is_admin: true, active: true, updatedAt: now };
    const member = { uid: user.uid, email: user.email, displayName: user.displayName, role: 'team_leader', status: 'active', joinedAt: now, updatedAt: now };
    const batch = db.batch();
    batch.set(db.collection('users').doc(user.uid), adminProfile, { merge: true });
    batch.set(db.collection('agents').doc(user.uid), adminProfile, { merge: true });
    batch.set(db.collection('plucoSalesTeamMembers').doc(user.uid), member, { merge: true });
    await batch.commit();
  }
  for (const user of users) {
    const [authUser, profile, member] = await Promise.all([auth.getUser(user.uid), db.collection('users').doc(user.uid).get(), db.collection('plucoSalesTeamMembers').doc(user.uid).get()]);
    if (authUser.customClaims?.role !== 'admin' || profile.data()?.role !== 'admin' || member.data()?.role !== 'team_leader' || member.data()?.status !== 'active') throw new Error(`Post-write verification failed for ${user.email}.`);
    console.log(`${user.email}: admin + active Sales Team leader verified`);
  }
}

run().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exit(1); });
