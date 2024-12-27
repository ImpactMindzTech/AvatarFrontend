// Example: PollingComponent.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Your server URL

const PollingComponent = ({ roomId }) => {
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([""]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    // Listen for newly created polls
    socket.on("poll-createda", (poll) => {
      setPolls((prev) => [...prev, poll]);
    });

    // Listen for updated poll (after voting)
    socket.on("poll-updateda", (updatedPoll) => {
      setPolls((prevPolls) =>
        prevPolls.map((p) => (p.id === updatedPoll.id ? updatedPoll : p))
      );
    });

    // Cleanup on unmount
    return () => {
      socket.off("poll-createda");
      socket.off("poll-updateda");
    };
  }, []);

  // Create a poll
  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) return;

    // Build new poll object
    const newPoll = {
      id: Date.now(), // Unique ID
      question: pollQuestion,
      options: pollOptions.map((text) => ({ text, votes: 0 })),
    };

    // Emit 'create-polla' to server
    socket.emit("create-polla", { roomId, poll: newPoll });
    
    // Reset local input states
    setPollQuestion("");
    setPollOptions([""]);
  };

  // Add another empty option
  const handleAddOption = () => {
    setPollOptions((prev) => [...prev, ""]);
  };

  // Update option text
  const handleOptionChange = (value, idx) => {
    setPollOptions((prev) =>
      prev.map((opt, i) => (i === idx ? value : opt))
    );
  };

  // Vote on a poll option
  const handleVote = (pollId, optionIndex) => {
    socket.emit("vote-polla", { roomId, pollId, optionIndex });
  };

  return (
    <div>
      <h2>Create a Poll</h2>
      <input
        value={pollQuestion}
        onChange={(e) => setPollQuestion(e.target.value)}
        placeholder="Question"
      />
      {pollOptions.map((opt, idx) => (
        <div key={idx}>
          <input
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, idx)}
            placeholder={`Option ${idx + 1}`}
          />
        </div>
      ))}
      <button onClick={handleAddOption}>+ Add Option</button>
      <button onClick={handleCreatePoll}>Create Poll</button>

      <hr />

      <h2>Active Polls</h2>
      {polls.map((poll) => (
        <div key={poll.id} style={{ marginBottom: 20 }}>
          <h4>{poll.question}</h4>
          {poll.options.map((opt, idx) => (
            <div key={idx}>
              <button onClick={() => handleVote(poll.id, idx)}>Vote</button>{" "}
              {opt.text} - {opt.votes} votes
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PollingComponent;
