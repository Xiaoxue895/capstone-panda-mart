import { useState } from "react";
import { FaMagic } from "react-icons/fa";
// import "./AiAssistant.css";

function AIAssistant() {
	const [query, setQuery] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async () => {
		if (!query.trim()) return;
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/ai/recommendations`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ query }),
			});

			if (!response.ok) {
				throw new Error(
					`Server error: ${response.status} ${response.statusText}`
				);
			}

			const data = await response.json();

			setChatHistory((prev) => [
				...prev,
				{ role: "user", content: query },
				{ role: "bot", content: data || "No valid response received." },
			]);
		} catch (err) {
			setError("Request failed, please try again later.");
		} finally {
			setLoading(false);
			setQuery("");
		}
	};

	return (
		<div className="ai-container">
			<h2>
				<FaMagic /> AI Assistant
			</h2>

			<div className="chat-window">
				{chatHistory.map((msg, idx) => (
					<div
						key={idx}
						className={msg.role === "user" ? "user-msg" : "bot-msg"}
					>
						{msg.content}
					</div>
				))}
				{loading && <p>Loading...</p>}
				{error && <p className="error-msg">{error}</p>}
			</div>

			<div className="input-section">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Enter your query..."
					disabled={loading}
				/>
				<button onClick={handleSubmit} disabled={loading || !query.trim()}>
					{loading ? "Sending..." : "Send"}
				</button>
			</div>
		</div>
	);
}

export default AIAssistant;