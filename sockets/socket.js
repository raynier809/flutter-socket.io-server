const { io } = require('../index');
const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Hilsong'));
bands.addBand(new Band('Grupo Rojo'));
bands.addBand(new Band('Barack'));
bands.addBand(new Band('Vino Nuevo'));



//Mensajes de Sockets
io.on('connection', client =>{
    console.log('Cliente Conectado');
    client.emit('active-bands', bands.getBands());

    client.on('disconnect',()=>{
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload )=>{
        console.log('Mensaje', payload);
        io.emit('mensaje', {admin: "Nuevo Mensaje"})

    });
    client.on('add-band', (payload)=> {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload)=> {
        bands.delateBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

   
    client.on('vote-band', (payload)=> {
        bands.votesBans(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('nuevo-mensaje', ( payload )=>{
        console.log(payload);
        //io.emit('nuevo-mensaje', payload); //Emite a todos!!
        client.broadcast.emit('nuevo-mensaje', payload);//Emite a todos menos al que emitio!!
    });

});