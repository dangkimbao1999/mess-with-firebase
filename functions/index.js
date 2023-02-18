// const functions = require("firebase-functions");
import functions, { https } from 'firebase-functions';
import express from 'express';
import { addUser, getUserTransactions, login } from './services/firestore.js';
import { userLoginRules, userValidationRules, validate, validateWithAuth, addTransactionRule, historyRule } from './validators/validator.js';
import { isAuthenticated } from './validators/authenticated.js';
import { addExpense } from './services/service.js';

const app = express();
app.use(express.json()) // for parsing application/json

app.get('/', (req, res) => res.status(200).send({key: 'hey there'}));
// app.post('/add-user', userValidationRules(), validate, async (req, res) => {
//     const user = req.body;
//     await addUser(user);
//     res.send({status: 200})
// } )

app.post('/register', userValidationRules(), validate, async(req, res) => {
    const user = req.body;
    await addUser(user);
    res.send({status: 200})
})
app.post('/login', userLoginRules(), validate, async(req, res) => {
    const user = req.body;
    const response = await login(user);
    res.send({response})
})

//todo: add income/expense
app.post('/add-transaction', addTransactionRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.body;
    const userId = req.user_id.uid;
    await addExpense(userId, tx.title, tx.amount, tx.type);
    res.send({status: 200})
})

//todo: edit transaction
app.put('/edit-transaction', addTransactionRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.body;
    await editExpense(tx.txid, tx.title);
    res.send({status: 200})
})

app.get('/history', historyRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.query;
    const userId = req.user_id.uid;
    console.log(userId);
    const rs = await getUserTransactions(userId, tx.title, tx.type, tx.amount);
    res.send({response: rs});
})
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
