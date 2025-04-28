from dotenv import load_dotenv
from os import getenv

load_dotenv()

BOT_TOKEN = getenv("BOT_TOKEN")

DB_CONNECTION_STRING = getenv("DB_CONNECTION_STRING")

DB_NAME = getenv("test")

WEB_APP_URL = getenv("WEB_APP_URL")

BACKEND_URL = getenv('BACKEND_URL')
