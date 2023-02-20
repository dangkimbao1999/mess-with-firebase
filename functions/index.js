// const functions = require("firebase-functions");
import functions, { https } from 'firebase-functions';
import express from 'express';
import { addUser, getUserTransactions, login } from './services/firestore.js';
import { userLoginRules, userValidationRules, validate, validateWithAuth, addTransactionRule, historyRule, editTransactionRule } from './validators/validator.js';
import { isAuthenticated } from './validators/authenticated.js';
import { editExpense, transfer } from './services/service.js';
import { ENUM_ACTION } from './enum/actionEnum.js';

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
    try {
        await addUser(user);
        res.send({status: 200})
    } catch(err) {
        res.status(400).json({errors: err.message});
    }
})
app.post('/login', userLoginRules(), validate, async(req, res) => {
    const user = req.body;
    try {
        const response = await login(user);
        res.send({response})
    } catch (err) {
        res.status(400).json({errors: err});
    }
})

//todo: add income/expense
app.post('/add-transaction', addTransactionRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.body;
    const userId = req.user_id.uid;
    if(tx.type !== ENUM_ACTION.TRANS) {
        try {
            await transfer(userId, undefined, tx.title, tx.amount, tx.type);
            res.send({status: 200})
        } catch(err) {
            res.status(400).json({errors: err.message});
        }
    }
    else {
        try{
            await transfer(userId, tx.to, tx.title, tx.amount, tx.type);
            res.send({status: 200});
        } catch(err) {
            res.status(400).json({errors: err.message});
        }
    }
})

//todo: edit transaction
app.put('/edit-transaction', editTransactionRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.body;
    try {
        await editExpense(tx.txid, tx.title);
        res.send({status: 200})
    } catch(err) {
        res.status(400).json({errors: err});
    }
})

//todo: show/filter history (pagination later) 
app.get('/history', historyRule(), validate, isAuthenticated, async(req, res) => {
    const tx = req.query;
    const userId = req.user_id.uid;
    try {
        const rs = await getUserTransactions(userId, tx.title, tx.type, tx.amount, tx.page, tx.limit);
        res.send({response: rs});
    } catch(err){
        res.status(400).json({errors: err});
    }
})
export default functions.https.onRequest(app);
// export functions.https.onRequest(app);
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
