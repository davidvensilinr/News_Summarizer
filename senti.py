from textblob import TextBlob
import nltk 
from newspaper import Article, Config
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.download('punkt')
except Exception as e:
    logger.error(f"Error downloading NLTK data: {e}")

# Configure newspaper3k
user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
config = Config()
config.browser_user_agent = user_agent
config.request_timeout = 10

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class InputData(BaseModel):
    url : str = None

@app.post('/analyse')
async def analyse(input: InputData):
    if not input.url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    try:
        # Initialize article with config
        article = Article(input.url, config=config)
        
        # Download and parse article with error handling
        try:
            article.download()
            article.parse()
            article.nlp()
        except Exception as e:
            logger.error(f"Error processing article: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Could not process the article. The website might be blocking our requests. Error: {str(e)}"
            )
        
        if not article.text:
            raise HTTPException(status_code=400, detail="Could not extract text from the article")
        
        # Analyze sentiment
        blob = TextBlob(article.text)
        polarity = blob.sentiment.polarity
        
        # Determine sentiment label with thresholds
        if -0.1 < polarity < 0.1:
            sentiment = "Neutral"
        elif polarity <= -0.1:
            sentiment = "Negative"
        else:
            sentiment = "Positive"
            
        return {
            'summary': article.summary,
            'sentiment': sentiment,
            'polarity': round(polarity, 2)
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")