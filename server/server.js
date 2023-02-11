import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
process.env.DEBUG = 'express:*';

const app = express();

// Add CORS middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Alspencer',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1024,
      topP: 1,
      n: 1,
      stop: '\n',
    });

    res.status(200).send({
      bot: response.data.choices[0].text.trim(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(process.env.PORT || 5000, () => console.log(`Server is running on port ${process.env.PORT || 5000}`));
