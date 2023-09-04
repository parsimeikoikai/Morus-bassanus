import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONFIG_PATH = os.path.join(ROOT_DIR, 'src/configs/config.yaml')
DATA_PATH = os.path.join(ROOT_DIR, 'data')
os.makedirs(DATA_PATH, exist_ok=True)