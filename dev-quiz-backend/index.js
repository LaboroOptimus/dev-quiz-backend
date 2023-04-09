const express = require('express');
const userRouter = require('./routes/user.routes')
const testsRouter = require('./routes/tests.routes')

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())

app.use('/api', userRouter)
app.use('/api', testsRouter)

app.get('/', (req, res) => {
    res.send('HELLO POSTGRES')
})

app.listen(PORT, () => console.log('Server started'))
