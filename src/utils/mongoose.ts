import mongoose from 'mongoose';
import { env } from './env';

// Get conn str from env
const connStr: string = env.MONGO_URI;

export function mongoConnect() {
    mongoose.connect(connStr)
        .then(() => console.log("Connected to mongo"))
        .catch((e) => console.log(e))
        ;
}