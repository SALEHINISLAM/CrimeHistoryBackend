import {Server} from 'http'
import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

let server:Server;

async function main() {
    try {
        await mongoose.connect(config.db_url as string)
        server= app.listen(config.port,()=>{
            console.log(`server is listening on port ${config.port}`);
        })
    } catch (error) {
        console.log(error)
    }
}

main();

process.on('unhandledError',()=>{
    if (server) {
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1)
})
process.on('uncaughtException',()=>{
    if (server) {
        server.close(()=>{
            process.exit(1);
        })
    }
    process.exit(1)
})