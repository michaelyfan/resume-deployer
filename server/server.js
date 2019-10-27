const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const path = require('path');
const { runAll } = require('./src/index.js');

const PORT = 5000;
const UPLOAD_PATH = path.join(__dirname, '/uploads');
const app = express();
const upload = multer({ dest: UPLOAD_PATH });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/runAll', upload.array('files', 10), (req, res) => {
  const resume = req.files[0];
  const config = JSON.parse(JSON.stringify(req.body));

  runAll(resume, config).then((errors) => {
    // // delete multer file
    // fs.removeSync(UPLOAD_PATH);
    
    res.status(200).send(errors);
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
