import React, { useEffect, useState } from "react";
import { Log, configureLogger } from "log-middleware";


configureLogger({
  baseUrl: "http://4.224.186.213",
  authToken: import.meta.env.VITE_API_AUTH_TOKEN as string | undefined,
});

interface Item {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Log("frontend", "info", "page", "App component mounted");
  }, []);

  const handleAddItem = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      await Log(
        "frontend",
        "warn",
        "component",
        "User attempted to add an item with an empty name"
      );
      return;
    }

    try {
      const newItem: Item = { id: Date.now(), name };
      setItems((prev) => [...prev, newItem]);
      setName("");
      setError(null);
      await Log(
        "frontend",
        "info",
        "state",
        `Item added to list successfully, id=${newItem.id}`
      );
    } catch (err) {
      setError("Failed to add item");
      await Log(
        "frontend",
        "error",
        "component",
        `Failed to add item: ${(err as Error).message}`
      );
    }
  };

  const handleRemoveItem = async (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await Log("frontend", "debug", "state", `Item removed, id=${id}`);
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Logging Middleware Demo</h1>
      <p>
        Every action below calls the reusable <code>Log()</code> function,
        which posts to the evaluation test server's Log API.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={name}
          placeholder="Item name"
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleAddItem} style={{ padding: "8px 16px" }}>
          Add
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 6 }}>
            {item.name}{" "}
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
