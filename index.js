import express from "express"
import mongoose from "mongoose";
import {
    loginValidation,
    postCreateValidation,
    registrationValidation
} from "./validations/validations.js";
import {PostControllers, UserControllers} from "./controllers/index.js"

import multer from "multer";
import {authValidation, handleValidationsErrors} from "./utils/index.js"
import cors from "cors";

//'mongodb+srv://admin:12345qwerty@cluster0.zkcmcwn.mongodb.net/blog?retryWrites=true&w=majority'
mongoose.connect(
    process.env.MongoDb_Uri)
    .then(() => {
        console.log("Db ok")
    })
    .catch((err) => {
        console.log("Db error", err)
    })

//
// const uri = "mongodb+srv://admin:12345qwerty@cluster0.zkcmcwn.mongodb.net/?retryWrites=true&w=majority";
//
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
//
//
// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname)
    }
})
const upload = multer({storage: storage})
app.use(express.json())
app.use('/uploads', express.static('./uploads'))
app.use(cors())

app.post('/auth/login', loginValidation, handleValidationsErrors, UserControllers.login)
app.post('/auth/registration', registrationValidation, handleValidationsErrors, UserControllers.register)
app.get('/auth/me', authValidation, UserControllers.authMe)

app.post('/upload', authValidation, handleValidationsErrors, upload.single('image'), PostControllers.upload)


app.post('/posts', authValidation, postCreateValidation, handleValidationsErrors, PostControllers.create)
app.get('/posts', PostControllers.getAll)
app.get('/tags', PostControllers.getLastTags)
app.get('/posts/:id', PostControllers.getOne)
app.delete('/posts/:id', authValidation, PostControllers.remove)
app.patch('/posts/:id', authValidation, postCreateValidation, handleValidationsErrors, PostControllers.update)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log("Server ok")
})
