const express = require('express');
const userRouter = require('./routes/user.routes')
const testsRouter = require('./routes/tests.routes')
const trainRouter = require('./routes/train.routes')

const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use('./images', express.static(path.join(__dirname, 'images')))
app.use(express.json( { extended: true }))


app.use('/api', userRouter)
app.use('/api', testsRouter)
app.use('/api', trainRouter)

app.get('/', (req, res) => {
    res.send('HELLO POSTGRES')
})

app.listen(PORT, () => console.log('Server started'))
