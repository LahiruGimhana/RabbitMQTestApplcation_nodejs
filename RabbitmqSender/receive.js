
var express = require('express');
var app = express();
var amqp = require('amqp');


const port = 3001;

const connection = amqp.createConnection({ host: 'rabbitmq.uc.dev.tetherfi.cloud' });

connection.on('ready', () => {
    console.log('Connected to RabbitMQ');

    const queue = 'firstqueue';

    connection.queue(queue, { durable: false }, (q) => {
        q.subscribe((message) => {
            console.log('Received message:', message.data.toString());
        });
    });
});

connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err);
});

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})