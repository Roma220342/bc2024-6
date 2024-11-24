const { Command } = require('commander');
const express = require('express');
const noteRoute = require('./route/noteRoute');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const program = new Command();

program
    .requiredOption('-h, --host <type>', 'Адреса сервера')
    .requiredOption('-p, --port <number>', 'Порт сервера')
    .requiredOption('-c, --cache <path>', 'Шлях до директорії, де будуть закешовані файли');

program.configureOutput({
    writeErr: (str) => {
        console.error("Йосип босий! То ти щось пропустив '-h (--host), -p (--port), -c (--cache <path>)'");
        process.exit(1);
    }
});

program.parse(process.argv);

const options = program.opts();
const host = options.host;
const port = options.port;
const cachePath = options.cache;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Створювач нотаток',
            version: '1.0.0',
            description: 'API для створення, читання, оновлення та видалення нотаток',
        },
    },
    apis: ['./route/*.js'], // Шлях до файлів маршрутів
};

const openapiSpecification = swaggerJsDoc(swaggerOptions);

app.use(express.text());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use((req, res, next) => {
    req.cachePath = cachePath;
    next();
});

app.use('/notes', noteRoute);

app.listen(port, host, (err) => {
    if (err) {
        console.error('Помилка запуску сервера:', err);
        process.exit(1);
    }
    console.log(`Сервер стартанув: http://${host}:${port}/`);
    console.log(`Swagger-документація доступна на: http://${host}:${port}/docs`);
});
