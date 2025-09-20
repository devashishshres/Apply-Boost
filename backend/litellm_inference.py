import os
import json
import litellm
from pydantic import BaseModel, Field, ValidationError, field_validator
import re

# Note: Use os.getenv() for security in production environments
litellm.api_key = os.getenv("GEMINI_API_KEY") 

# Define the Pydantic model with a custom validator
class CityInfo(BaseModel):
    city: str = Field(..., description="The name of the city.")
    country: str = Field(..., description="The country the city is in.")
    population: int = Field(..., description="The population of the city.")

    # A custom validator for the 'population' field
    @field_validator('population', mode='before')
    @classmethod
    def clean_population_string(cls, v):
        """Removes commas from the population string before validation."""
        if isinstance(v, str):
            # Use regex to remove commas and then return the cleaned string
            return re.sub(r'[^\d]', '', v)
        return v

# Define the messages
messages = [
    {
        "role": "user",
        "content": "Tell me about the city of Tokyo, providing its country and population. Ensure the population is a number."
    }
]

print("Querying model for structured output using Pydantic.")

try:
    response = litellm.completion(
        model="gemini/gemini-1.5-flash-latest",
        messages=messages,
        response_format={"type": "json_object"}
    )
    
    # Extract and print the raw JSON string
    json_output_str = response.choices[0].message.content
    print(f"\nRaw JSON string from model:\n{json_output_str}")
    
    # Use Pydantic's model_validate_json to parse and validate
    # The custom validator will clean the population string
    structured_data = CityInfo.model_validate_json(json_output_str)

    print("\nSuccessfully parsed and validated Pydantic object:")
    print(structured_data)
    print(f"City Name: {structured_data.city}")
    print(f"Country: {structured_data.country}")
    print(f"Population: {structured_data.population}")

except ValidationError as e:
    print(f"Pydantic validation error: The output from the model did not match the Pydantic schema.")
    print(e)
except Exception as e:
    print(f"An error occurred: {e}")