require('dotenv').config()
const server = require('./setup/server')();
const os = require('os')
const cluster = require('cluster')
const pid = process.pid
if(cluster.isMaster){
    // master process
    const n_cpus = os.cpus().length
    console.log(`Forking ${n_cpus} CPUS`)
    console.log(`Master has ${process.pid} process running`)
    for(let i=0; i < n_cpus; i++){
        cluster.fork()
    }
}
else {
    //create the basic server setup 
    server.create(cluster);

    //start the server
    server.start(pid)
}
cluster.on('exit', (worker) => {
    console.log(`Alert: worker, ${worker.id} is no more`)
    cluster.fork()
})
