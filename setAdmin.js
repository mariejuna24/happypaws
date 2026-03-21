const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Paste the UID you copied from Firebase Auth
admin.auth().setCustomUserClaims("Z05xC5Oga6SKydLTPX4y2W0y25v2", { admin: true })
  .then(() => {
    console.log("✅ Admin claim set successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });