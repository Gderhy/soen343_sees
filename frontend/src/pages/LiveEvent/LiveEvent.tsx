/**
 * Live Events page where live chat can be found
 */
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { fetchMessages, sendChatMessage } from '../../services/backend/all';
import "./LiveEvent.css";
import { socket } from "../../services/backend/socket";
import { useAuth } from "../../contexts/AuthContext";

// Live Event
interface LiveEventProps {
    eventId?: string;
}

interface ChatMessage {
    id: string,
    user: string,
    message: string,
}

export default function LiveEvent(props: LiveEventProps) {

    const { session } = useAuth();
    const [viewerCount, setViewerCount] = useState(Number);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [messages, setMessages] = useState<Array<ChatMessage>>(new Array<ChatMessage>());
    const [input, setInput] = useState("");
    const { id } = useParams();
    const userName = session?.user.user_metadata?.fullName || id;//TODO change to actual username

    // Observe if connected to socket
    useEffect(() => {

        // Connect to socket if not already connected on load
        if (socket.disconnected) {

            const connMessage: ChatMessage = {
                id: id ?? "",
                user: userName,
                message: `connection of ${userName}`,
            }

            socket.connect();
            setConnectionStatus(socket.connected);
            socket.emit('userConn', connMessage);
            setInput("");
        }

    }, []);

    // Observe messages
    useEffect(() => {
        socket.on("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => { socket.off("receiveMessage"); }

    }, []);

    // Send input to server
    const sendMessage = () => {
        if (input.trim()) {
            const message = {
                id,
                user: userName,
                message: input,
            };
            socket.emit("sendMessage", message);
            setInput("");
        }
    };

    // Disconnect to socket
    function disconnect() {
        const message = {
            id,
            user: userName,
            message: "",
        }
        socket.emit('disc', message);
        socket.disconnect();
    }

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    return (
        <>
            <div className="live-event-container">

                <Link
                    to="/"
                    onClick={disconnect}>
                    Disconnect
                </Link>


                <br />
                Socket is connected: {connectionStatus.toString()}
            </div>
            <div className="live-event-chat">
                <div
                    className="chat-box"
                >
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: '5px' }}>
                            <strong>{msg.user}:</strong> {msg.message}
                        </div>
                    ))}
                </div>

                <div className="chat-input-box">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="chat-input"
                        style={{

                        }}
                    />
                </div>
                <button
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>

        </>
    );
}