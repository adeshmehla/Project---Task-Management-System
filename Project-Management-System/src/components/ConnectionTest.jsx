import { useState } from "react";

export const ConnectionTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5001/api/test");
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md max-w-sm mx-auto mt-10">
      <button
        onClick={checkConnection}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        {loading ? "Checking..." : "Test Backend Connection"}
      </button>

      {status && (
        <p className="mt-3 text-green-600 text-sm">{status.message}</p>
      )}
      {error && (
        <p className="mt-3 text-red-600 text-sm">Error: {error}</p>
      )}
    </div>
  );
};