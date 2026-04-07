import express from 'express'

const router = express.Router();

router.post('/sign-up', (req, res) => {
 res.send('POST /api/auth/sign-up rseponse');
});


router.post('/sign-in', (req, res) => {
 res.send('POST /api/auth/sign-in rseponse');
});


router.post('/sign-out', (req, res) => {
 res.send('POST /api/auth/sign-out rseponse');
});


export default router;