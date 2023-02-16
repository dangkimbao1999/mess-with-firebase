// const functions = require("firebase-functions");
import functions, { https } from 'firebase-functions';
import express from 'express';
import { addUser, login } from './services/firestore.js';
import { userLoginRules, userValidationRules, validate, validateWithAuth } from './validators/validator.js';
import { isAuthenticated } from './validators/authenticated.js';

const app = express();
app.use(express.json()) // for parsing application/json

app.get('/', (req, res) => res.status(200).send({key: 'hey there'}));
// app.post('/add-user', userValidationRules(), validate, async (req, res) => {
//     const user = req.body;
//     await addUser(user);
//     res.send({status: 200})
// } )

app.post('/register', userValidationRules(), validate, isAuthenticated, async(req, res) => {
    console.log('id: ',req.user_id);
    const user = req.body;
    await addUser(user);
    res.send({status: 200})
})
app.post('/login', userLoginRules(), validate, async(req, res) => {
    const user = req.body;
    const response = await login(user);
    console.log(response);
    res.send({response})
})

//todo: add income/expense
//todo: edit transaction
//todo: show/filter history (pagination later) 
export default functions.https.onRequest(app);
// export functions.https.onRequest(app);
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
