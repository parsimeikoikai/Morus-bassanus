import logging


def setup_logger():
    log_format = "[%(levelname)s] [%(name)s]: %(message)s"
    logging.basicConfig(format=log_format, level=logging.INFO)