// server/utils/modifyTextWithGroq.js
const Groq = require('groq-sdk');
const { getPrompt } = require('./prompts');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const modifyTextWithGroq = async (text) => {
  console.log('Отправляем текст в Groq API для модификации с кастомным промптом');

  const prompt = getPrompt('custom', text);

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that modifies text based on user instructions. Always respond in English, unless explicitly asked to provide a translation.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });

    const modifiedText = response.choices[0].message.content;
    console.log('Текст успешно изменён:', modifiedText);
    return modifiedText; // Возвращаем структурированный текст (в виде строки)
  } catch (error) {
    console.error('Ошибка при изменении текста через Groq API:', error.message, error.response?.data);
    throw new Error('Не удалось изменить текст');
  }
};

module.exports = { modifyTextWithGroq };
