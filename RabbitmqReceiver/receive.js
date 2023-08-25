require('dotenv').config();
var express = require('express');
var app = express();
var amqp = require('amqp');

const port = process.env.PORT || 3002;
const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const queueName = process.env.QUEUE_NAME || 'firstqueue';

const connection = amqp.createConnection({ host: rabbitmqHost });

connection.on('ready', () => {
    console.log('Connected to RabbitMQ');

    connection.queue(queueName, { durable: false }, (q) => {
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