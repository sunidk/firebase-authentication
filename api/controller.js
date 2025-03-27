const { STATUS_CODE } = require("../utils/constant");
const admin = require('firebase-admin');
const firebase = require('firebase/app');
require('firebase/auth');
const serviceAccount = require('../serviceAccountKey.json');
const firebaseConfig = require('../firebaseConfig');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

exports.userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required!" });
    }

    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).send({ error: "User with this email already exists!" });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    return res.send({
      status: STATUS_CODE.SUCCESS,
      message: "User Registered Successfully",
      userId: userRecord.uid,
    });
  } catch (error) {
    if (error.code === 'auth/invalid-email') {
      return res.status(400).send({ error: "Invalid email!" });
    } else {
      console.error("Error registering user:", error);
      return res.status(500).send({ error: "Error registering user" });
    }
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required!" });
    }

    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    return res.send({
      status: STATUS_CODE.SUCCESS,
      message: "User Login Success",
      id_token: idToken,
    });
  } catch (error) {
    if (error.code === 'auth/internal-error') {
      return res.status(400).send({ error: 'Invalid login credentials!' });
    } else {
      console.error("Error logging in user:", error);
      return res.status(500).send({ error: 'Error logging in user' });
    }
  }
};

exports.healthcheck = async (req, res) => {
  try {
    return res.send({
      status: STATUS_CODE.SUCCESS,
      message: "Health check completed successfully",
    });
  } catch (error) {
    console.error("Error during health check:", error);
    return res.status(500).send({ error: "Error during health check" });
  }
};
