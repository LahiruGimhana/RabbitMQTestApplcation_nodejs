require('dotenv').config();
var express = require('express');
var app = express();
var amqp = require('amqp');
const readline = require('readline');

const port = process.env.PORT || 3001;
const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const queueName = process.env.QUEUE_NAME || 'firstqueue';
const user = process.env.SENDER_NAME || 'user1';

const connection = amqp.createConnection({ host: rabbitmqHost });

connection.on('ready', () => {
    console.log('Connected to RabbitMQ');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.setPrompt('Enter the message (or type "exit" to quit): ');

    rl.on('line', (input) => {
        if (input.trim().toLowerCase() === 'exit')
        {
            rl.close();
            connection.end();
            process.exit(0);
        }

        const message = { user: user, content: input };

        connection.queue(queueName, { durable: false }, (q) => {
            connection.publish(queueName, JSON.stringify(message));
            console.log('Message sent to queue');

            rl.prompt();
        });
    });

    rl.prompt();
});

connection.on('error', (err) => {
    console.error('RabbitMQ connection error:', err);
});

app.listen(port, () => {
    console.log(`app running on port ${port}`);
});
