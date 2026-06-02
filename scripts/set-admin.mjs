import admin from "firebase-admin";
import fs from "node:fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const uid = process.argv[2];
const name = process.argv[3] || "Admin";
const role = process.argv[4] || "admin";

if (!uid) {
  console.error("Usage: node scripts/set-admin.mjs <USER_UID> [Name] [role]");
  process.exit(1);
}

// 1. Set Firebase Auth custom claim
await admin.auth().setCustomUserClaims(uid, { admin: true, role });

// 2. Create/update Firestore /agents/{uid} document
const db = admin.firestore();
await db.collection("agents").doc(uid).set({
  uid,
  name,
  role,
  active: true,
  createdAt: new Date().toISOString(),
}, { merge: true });

const user = await admin.auth().getUser(uid);

// Also update email on the agent doc
await db.collection("agents").doc(uid).set({ email: user.email }, { merge: true });

console.log(`✓ Custom claim set:   admin=true, role=${role}`);
console.log(`✓ Firestore /agents/${uid} created`);
console.log(`✓ Email: ${user.email}`);
console.log(`✓ Name:  ${name}`);
