from src.db.weaviate_vectorizer import Vectorizer
from src.db.S3_pipeline import S3
from src.logging import setup_logger
import logging

setup_logger()
logger = logging.getLogger(__name__)


if __name__=="__main__":
    logger.info("Downloading data from S3")
    downloader = S3()
    downloader.download("data/")

    logger.info("Vectorizing the downloaded data")
    vectorizer = Vectorizer()
    vectorizer.vectorize()
