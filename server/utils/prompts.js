// server/utils/prompts.js
const prompts = {
  custom: `You are tasked with creating a summary of the following article for a YouTube Shorts video targeting casual people interested in earning money through cryptocurrency. Simplify, shorten, and informalize the text, making it engaging and digestible. The article: {text}

**Key Requirements:**
- **Title**: Must be in English, catchy, and grab attention. Must be between 30 and 45 characters (including spaces and punctuation). Tailored to a crypto-curious, money-motivated audience. Example: "Ethereum Whales Drop Millions on ETH!" Avoid bland titles like "Crypto Summary."
- **Text**: Summarize and simplify the article. Use a casual, conversational tone. Must be in English, strictly 320–350 characters (including spaces and punctuation), aiming for closer to 350 characters to maximize detail. Focus on key facts from the article that inform about crypto market trends, such as big investor moves, price changes, specific transactions, platform usage, or expert predictions. Include as many specific details as possible (e.g., exact amounts, platforms, price ranges). Avoid jargon unless simplified (e.g., "blockchain" → "crypto magic"). Use short sentences and hype words (e.g., "boom," "huge," "drop"), but keep the tone informative and news-like, not motivational. Do not include greetings (e.g., "Hey, crypto fans!"). Avoid calls to action (e.g., "Jump in now!"). Example tone: "Ethereum whales just dropped $500M on ETH—here’s the scoop!" Avoid overly technical or boring summaries.
- **Output Format**: Present as a list with three sections:
  - English version (title + text).
  - Russian translation (заголовок + текст).
  - #tags for YouTube and TikTok (in English, 5–10 relevant tags).
- **Target Audience**: Casual people, not experts, interested in crypto market updates. Keep it relatable, hype-driven, and easy to grasp.
- **Constraints**: Title must be 30–45 characters. Text must be 320–350 characters. Use only the provided article as the source. Do not assume prior knowledge beyond what’s in the article.
- **Instructions**: Analyze the article for key news-related facts, such as big investor moves, price trends, specific transactions, platform usage, or expert predictions. Use short sentences and hype words (e.g., "boom," "huge," "drop"). Ensure the tone is casual and news-like, focusing on facts without greetings or motivational calls to action. Include specific details like exact amounts, platforms, and price ranges to maximize informativeness. Ensure the Russian translation mirrors the informal tone. For tags, prioritize trending crypto and news-related keywords.
- **Example Output** (for an article about Bitcoin price surge):
  - English version
    - Title: Bitcoin Whales Make Huge Moves!
    - Text: Bitcoin whales dropped $500M to buy BTC this week as prices hit $65K after a 10% surge. They used platforms like Binance and Kraken for trades. Experts at CryptoInsight predict BTC might climb to $80K by year-end. The market’s buzzing with excitement. Small traders are watching as big players keep stacking coins. It’s a wild ride in the crypto world!
  - Russian translation
    - Заголовок: Киты Bitcoin делают большие ставки!
    - Текст: Киты Bitcoin вбухали $500M, скупив BTC на этой неделе, пока цена достигла $65K после роста на 10%. Они использовали платформы Binance и Kraken для торгов. Эксперты из CryptoInsight говорят, что BTC может дойти до $80K к концу года. Рынок гудит от ажиотажа. Мелкие трейдеры следят, как большие игроки запасются. Вот это движ в крипто-мире!
  - #tags
    - #CryptoNews
    - #BitcoinUpdate
    - #CryptoWhales
    - #MarketBuzz
    - #CryptoTrends
    - #BTCPrice
    - #CryptoHype
    - #InvestingNews`,
};

const getPrompt = (modificationType, text) => {
  const promptTemplate = prompts[modificationType];
  if (!promptTemplate) {
    throw new Error('Неизвестный тип модификации');
  }
  return promptTemplate.replace('{text}', text);
};

module.exports = { getPrompt };
