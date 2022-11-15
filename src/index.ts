import express from 'express';

const app = express();

app.listen(1234, () => {
    console.log('Running on 1234');
})