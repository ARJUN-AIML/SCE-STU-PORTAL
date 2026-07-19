import os
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class CSVLoader:
    def __init__(self):
        self.data = {}
        # Path is relative to backend directory or use config
        self.dataset_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Dataset_for_chatbot")

    def load_all(self):
        """Recursively loads all CSV files in the Dataset_for_chatbot directory."""
        if not os.path.exists(self.dataset_dir):
            logger.error(f"Dataset directory not found: {self.dataset_dir}")
            return
            
        for root, _, files in os.walk(self.dataset_dir):
            for file in files:
                if file.endswith('.csv'):
                    file_path = os.path.join(root, file)
                    try:
                        # Use file name without extension as key
                        key = os.path.splitext(file)[0]
                        df = pd.read_csv(file_path)
                        df = df.fillna("") # Replace NaNs with empty string
                        self.data[key] = df.to_dict(orient="records")
                        logger.info(f"Loaded {len(self.data[key])} records from {file}")
                    except Exception as e:
                        logger.error(f"Error loading {file}: {e}")

    def get_data(self, key: str) -> list[dict]:
        return self.data.get(key, [])

# Singleton instance
csv_db = CSVLoader()
