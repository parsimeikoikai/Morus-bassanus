import os
import yaml
import boto3
import logging
from pathlib import Path

from ..configs.definitions import CONFIG_PATH, DATA_PATH
from ..settings import get_settings
from ..logging import setup_logger

setup_logger()
logger = logging.getLogger(__name__)

class S3:
    def __init__(self):

        self.s3 = boto3.Session(
        aws_access_key_id=get_settings().aws_key_id,
        aws_secret_access_key=get_settings().aws_secret_key,
        aws_session_token=get_settings().aws_session_token
        )

        with open(CONFIG_PATH, 'r') as stream:
            try:
                self.configs = yaml.safe_load(stream)["S3"]
            except yaml.YAMLError:
                logger.exception("couldn't load model config file")
                raise yaml.YAMLError
    
    def download(self, key):
        """
        download files from s3 bucket
        :param key: folder path in s3
        :return:
        """
        try:
            
            bucket = self.s3.resource('s3').Bucket(self.configs["BUCKET"])
            objs = list(bucket.objects.filter(Prefix=key))

            for obj in objs:
                path, filename = os.path.split(obj.key)
                if filename:
                    # save file with full path locally
                    bucket.download_file(obj.key, os.path.join(DATA_PATH, filename))
        except Exception as e:
            logger.exception("error while reading file %s to S3 bucket: %s", key, str(e))


