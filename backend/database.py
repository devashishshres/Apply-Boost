import os
from supermemory import Supermemory, APIConnectionError, RateLimitError, APIStatusError
from pathlib import Path

# Initialize the Supermemory client
client = Supermemory(
    api_key="sm_e6JuGZgu9Asv5B2CwxhC3E_yYRxxIKZKvWNULBftWFspUCCEQaPxXuNzqbIgzYahJDzdtBAPTURBNCDOzXholqb"
)

def save_memory(content):
    """
    Saves a piece of content to Supermemory and returns the memory ID.
    """
    try:
        response = client.memories.add(
            content=content,
            container_tags=["apply-boost"],
        )
        # Corrected: MemoryAddResponse returns an object with a 'memory_id'
        # or 'embedding_id', not a 'results' attribute.
        return response
    except APIConnectionError as e:
        print("The server could not be reached")
        print(e.__cause__)
        return None
    except RateLimitError as e:
        print("A 429 status code was received; we should back off a bit.")
        return None
    except APIStatusError as e:
        print("Another non-200-range status code was received")
        print(e.status_code)
        print(e.response)
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def save_file(path):
    """
    Uploads a file to Supermemory.
    """
    try:
        response = client.memories.upload_file(
            file=Path(path)
        )
        return response.document_id
    except Exception as e:
        print(f"An error occurred while uploading the file: {e}")
        return None

def search_memory(query):
    """
    Searches for memories based on a query and returns the results.
    """
    try:
        response = client.search.memories(
            q=query,
            limit=5
        )
        return response.results
    except Exception as e:
        print(f"An error occurred while searching memories: {e}")
        return None

def search_file(query):
    """
    Searches for documents based on a query and returns the results.
    """
    try:
        response = client.search.documents(
            q=query,
            limit=5
        )
        return response.results
    except Exception as e:
        print(f"An error occurred while searching documents: {e}")
        return None

# Test the corrected functions
print("--- Testing save_memory ---")
save_result = save_memory("This is a test case.")
if save_result:
    print(f"Save successful. Memory ID: {save_result}")
else:
    print("Save failed.")

print("\n--- Testing search_memory ---")
search_result = search_memory("test")
if search_result:
    print("Search successful. Results:")
    print(search_result)
else:
    print("Search failed.")