const fs = require('fs');
const path = require('path');

// Створення нотатки
const createNote = (req, res) => {
    const cachePath = req.cachePath; 
    const { note_name, note } = req.body;

    if (!note_name || !note) {
        return res.status(400).send("Тобі з голови напевно вилетіло, треба вказати ім'я та текст нотатки");
    }

    const notePath = path.join(cachePath, `${note_name}.txt`);

    if (fs.existsSync(notePath)) {
        return res.status(400).send('Чоловіче, така нотатка вже створена');
    }

    try {
        fs.writeFileSync(notePath, note, 'utf-8');
        return res.status(201).send('Порядок, створив нотатку');

    } catch (error) {
        console.error(error);
        return res.status(500).send('Халепа! Не виходить створити нотатку');
    }
};

// Читання нотатки
const readNote = (req, res) => {
    const cachePath = req.cachePath; 
    const note_name = req.params.note_name; 

    try {
        const notePath = path.join(cachePath, `${note_name}.txt`);

        if (!fs.existsSync(notePath)) {
            return res.status(404).send('Чоловіче,такої нотатки немає');
        }

        const noteText = fs.readFileSync(notePath, 'utf8');
        res.json({ name: note_name, text: noteText }); 
    } catch (error) {
        console.error(error);
        return res.status(500).send('Халепа! Не виходить прочитати нотатку');
    }
};

const readAllNotes = (req, res) => {
    const cachePath = req.cachePath; 

    try {
      
        if (!fs.existsSync(cachePath)) {
            return res.status(404).send('Чоловіче, такої директорії немає');
        }

        const files = fs.readdirSync(cachePath);

        const notes = files
        .filter((file) => fs.statSync(path.join(cachePath, file)).isFile()) 
        .map((file) => {
            const filePath = path.join(cachePath, file);
            const noteText = fs.readFileSync(filePath, 'utf8');
            return {
                name: file.replace('.txt', ''), 
                text: noteText,
            };
        });

        res.json(notes);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Халепа! Не виходить переглянути список нотаток');
    }
};


const updateNote = (req, res) => {
    const cachePath = req.cachePath; 
    const note_name = req.params.note_name; 
    const { note }  = req.body;

    try {
        const notePath = path.join(cachePath, `${note_name}.txt`);
        
        if (!fs.existsSync(notePath)) {
            console.log(notePath);
            return res.status(404).send('Чоловіче, такої нотатки немає');
        }

        fs.writeFileSync(notePath, note, 'utf-8');
        return res.status(200).send('Порядок, оновив нотатку');

    } catch (error) {
        console.error(error);
        return res.status(500).send('Халепа! При оновленні нотатки');
    }
};

const deleteNote = (req, res) => {
    const cachePath = req.cachePath; 
    const note_name = req.params.note_name; 

    try{
        const notePath = path.join(cachePath, `${note_name}.txt`);

        // Перевіряємо, чи файл існує
        if (!fs.existsSync(notePath)) {
            console.log(notePath);
            return res.status(404).send('Чоловіче, такої нотатки немає');
        }

        fs.unlinkSync(notePath,'utf-8');
        return res.status(200).send('Порядок, нотатку видалив')

    } catch(error){
        console.error(error);
        return res.status(500).send('Халепа! При оновленні нотатки');
    }
}


const UploadForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/UploadForm.html'));
};

module.exports = {
    createNote,
    readNote,
    readAllNotes,
    updateNote,
    UploadForm,
    deleteNote
};
