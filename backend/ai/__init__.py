import logging

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

from .assistant import CollegeAIAssistant

__all__ = ["CollegeAIAssistant"]
