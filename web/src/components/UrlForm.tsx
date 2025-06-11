import { useState } from "react";
import { http } from "../api/http";
import type { Link } from "../types/link";

// Define props interface
interface UrlFormProps {
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

export function UrlForm({ setLinks }: UrlFormProps) {
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !code) {
      alert("URL and short code are required");
      return;
    }
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(link)) {
      alert("Invalid URL");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      alert("Short code must be alphanumeric with _ or -");
      return;
    }
    try {
      const newLink = await http.shortLink.create({ link, code });
      setLinks((prev) => [newLink, ...prev]);
      alert("Link created!");
      setLink("");
      setCode("");
    } catch (error) {
      console.error("Error creating link:", error);
      alert("Failed to create link");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter URL"
        required
      />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Short code"
        required
      />
      <button type="submit">Create Link</button>
    </form>
  );
}