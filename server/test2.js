const { EnglishTokenizer, KeywordExtractor } = require("@agtabesh/keyword-extractor")
const documents = [
  "Today was my school picnic day. Last night I was so excited that I didn\\'t sleep well. The weather was bad this morning. It was rainy. Although it was not raining too hard, it made\n",
  " me feel sad. We travelled by coach to Wu Kwai Sha Youth Village. On the coach many students talked about what they would do when they arrived there. Some students listened to music and r\n",
  "ead books. They all wanted to arrive there quickly!"];

const tokenizer = new EnglishTokenizer()
const keywordExtractor = new KeywordExtractor()
keywordExtractor.setTokenizer(tokenizer)

documents.forEach((text, i) => {
  keywordExtractor.addDocument(i, text)
});

const randomDocument = documents[Math.floor(Math.random() * documents.length)]
const keywords = keywordExtractor.extractKeywords(randomDocument, {
  sortByScore: true,
  limit: 10
})

console.log(keywords)
