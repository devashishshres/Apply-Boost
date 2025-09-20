import os
from supermemory import Supermemory
from pathlib import Path

client = Supermemory(
    api_key="sm_e6JuGZgu9Asv5B2CwxhC3E_yYRxxIKZKvWNULBftWFspUCCEQaPxXuNzqbIgzYahJDzdtBAPTURBNCDOzXholqb"
)

def save_memory(content):
    try:
        client.memories.add(
            content = content,
            container_tags = ["apply-boost"],
        )
    except supermemory.APIConnectionError as e:
        print("The server could not be reached")
        print(e.__cause__)  # an underlying Exception, likely raised within httpx.
    except supermemory.RateLimitError as e:
        print("A 429 status code was received; we should back off a bit.")
    except supermemory.APIStatusError as e:
        print("Another non-200-range status code was received")
        print(e.status_code)
        print(e.response)
    return response.results

def save_file(path):
    response = client.memories.upload_file(
        file = Path(path)
    )
    return response

def search_memory(query):
     response = client.search.memories(
       q = query,
       limit = 5
     )
     return response.results

def search_file(query):
    response = client.search.documents(
      q = query,
      limit = 5
    )
    return response.results

# Tests
print(save_memory("This is just for test cases"))
print(search_memory("test"))
