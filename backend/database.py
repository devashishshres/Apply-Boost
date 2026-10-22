import os
from supermemory import Supermemory, APIConnectionError, RateLimitError, APIStatusError

# Initialize the Supermemory client
client = Supermemory(api_key=os.getenv("SUPERMEMORY_API_KEY"))

def save_memory(content, container_tag):
    """
    Saves a piece of content to Supermemory under a single container tag.
    """
    try:
        return client.add(content=content, container_tag=container_tag)
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

def search_memory(query, container_tag):
    """
    Searches memories within one container tag only, so callers never see
    other containers' content.
    """
    try:
        response = client.search.memories(
            q=query,
            container_tag=container_tag,
            limit=5
        )
        return response.results
    except Exception as e:
        print(f"An error occurred while searching memories: {e}")
        return None

if __name__ == "__main__":
    print("--- Testing save_memory ---")
    save_result = save_memory("This is a test", "apply-boost-test")
    if save_result:
        print(f"Save successful. Memory ID: {save_result.id}")
    else:
        print("Save failed.")

    print("\n--- Testing search_memory ---")
    search_result = search_memory("test", "apply-boost-test")
    if search_result:
        print("Search successful. Results:")
        print(search_result[0].memory)
    else:
        print("Search failed.")
