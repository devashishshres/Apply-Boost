"""Offline check that chatbot memory is scoped per session. Run: python test_chat_isolation.py"""
import os
from types import SimpleNamespace

os.environ.setdefault("GEMINI_API_KEY", "dummy")
os.environ.setdefault("SUPERMEMORY_API_KEY", "dummy")

import app
import database

calls = []
database.client.search.memories = lambda **kw: calls.append(("search", kw)) or SimpleNamespace(results=[])
database.client.add = lambda **kw: calls.append(("add", kw))
app.call_llm = lambda prompt, pydantic_model=None: "ok"

client = app.app.test_client()
sid = "123e4567-e89b-12d3-a456-426614174000"

assert client.post("/api/chatbot-response", json={"message": "hi"}).status_code == 400
assert client.post("/api/chatbot-response", json={"message": "hi", "sessionId": "x"}).status_code == 400

res = client.post("/api/chatbot-response", json={"message": "hi", "sessionId": sid})
assert res.status_code == 200, res.get_json()
tag = f"apply-boost-chat-{sid}"
assert [c[1]["container_tag"] for c in calls] == [tag, tag], calls

assert client.post("/api/memory/search", json={"query": "x"}).status_code == 404
print("chat isolation OK")
