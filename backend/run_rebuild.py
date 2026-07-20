import logging
from ai.llm import init_embeddings
from ai.assistant import CollegeAIAssistant

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(name)s: %(message)s')
    print("Starting full knowledge base rebuild...")
    assistant = CollegeAIAssistant()
    assistant.rebuild()
    print("Rebuild complete. Datasets and Databases synced.")
