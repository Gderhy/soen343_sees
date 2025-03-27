/**
 * Live Events page where live chat can be found
 */
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMessages, sendChatMessage } from '../../services/backend/all';

// Observer Pattern Implementation
interface Observer {
    update(message: ChatMessage): void;
}

interface Subject {
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notify(message: ChatMessage): void;
}

interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: string;
    isModerator?: boolean;
    isSubscriber?: boolean;
}

// Concrete Subject, handles messages
class ChatSubject implements Subject {
    private observers: Observer[] = [];

    getViewerCount(): Number {
        return this.observers.length;
    }

    subscribe(observer: Observer): void {
        this.observers.push(observer);
    }

    unsubscribe(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message: ChatMessage): void {
        this.observers.forEach(observer => observer.update(message));
    }

    receiveMessage(message: ChatMessage) {
        this.notify(message);
    }
}

// Live Chat, acts as an Observer
const LiveChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const { id } = useParams();

    const messageObserver = useMemo(() => ({
        update: (message: ChatMessage) => {
            setMessages(prev => [...prev, message]);
        }
    }), []);

    useEffect(() => {
        const chatSubject = ChatService.getInstance();
        chatSubject.subscribe(messageObserver);

        return () => {
            chatSubject.unsubscribe(messageObserver);
        };
    }, [messageObserver]);


    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage: ChatMessage = {
                id: Date.now().toString(),
                userId: id?.toString() || "no-id",
                username: "", //Temporarily using userId instead
                content: inputValue,
                timestamp: ""
            };

            ChatService.getInstance().receiveMessage(newMessage);
            setInputValue('');
        }
    };

    return (
        <div className="live-chat-container">
            <div className="chat-messages">
                {messages.map(message => (
                    <div key={message.id} className="chat-message">
                        <span className="userId">{message.userId}: </span>
                        <span className="content">{message.content}</span>
                        <span className="timestamp">
                            {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

// Singleton
class ChatService extends ChatSubject {
    private static instance: ChatService;
    private eventId: string | null = null;
    private loadedMsgIdSet = new Set<string>();

    private constructor() {
        super();
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    public initialize(eventId: string) {
        this.loadedMsgIdSet.clear();
        this.eventId = eventId;
        this.loadInitialMessages(eventId);
    }

    private async loadInitialMessages(eventId: string) {
        try {
            const messages = await fetchMessages(eventId);
            messages.post.messages.forEach((message: ChatMessage) => {
              if (!this.loadedMsgIdSet.has(message.id)) {
                this.loadedMsgIdSet.add(message.id);
                this.notify(message);
              }
            });
          } catch (error) {
            console.error('Failed to load initial messages', error);
          }


        // try {
        //     const messages = await fetchMessages(eventId);
        //     console.log(messages);
        //     messages.post.messages.forEach((message: any) => this.sendMessage(message.content, message.userId, message.username));
        // } catch (error) {
        //     console.error('Failed to load initial messages', error);
        // }
    }

    public async sendMessage(
        messageContent: string,
        userId: string,
        username: string,
        eventId?: string,
        isModerator?: boolean,
        isSubscriber?: boolean
    ): Promise<void> {
        const chatMessage: ChatMessage = {
            id: Date.now().toString(), // temp
            userId,
            username,
            content: messageContent,
            timestamp: "",
            isModerator,
            isSubscriber
        };

        try {
            await this.receiveMessage(chatMessage, eventId);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    public async receiveMessage(message: ChatMessage, eventId?: string) {
        try {
            if (!this.loadedMsgIdSet.has(message.id)) {
                await sendChatMessage(message, eventId);
                this.loadedMsgIdSet.add(message.id);
            }
            this.notify(message);
        } catch (error) {
            console.error('Failed to receive message from backend', error);
        }
    }
}

// Live Event
interface LiveEventProps {
    eventId?: string;
}

export default function LiveEvent(props: LiveEventProps) {
    const [viewerCount, setViewerCount] = useState(Number);
    const { id } = useParams();

    //get view count
    useEffect(() => {
        const interval = setInterval(() => {
            // setViewerCount(ChatService.getInstance().getViewerCount().valueOf || 0);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    ChatService.getInstance().initialize(id?.toString() ?? "");

    return (
        <div className="live-event-container">
            { }
            <div className="live-event-content">
                <h1>Live Event Streaming Now</h1>
                <div className="viewer-count">Viewers: {viewerCount}</div>

                <div className="video-stream">
                    <div className="video-placeholder">
                        Live Video Stream Would Appear Here
                    </div>
                </div>

                <div className="event-description">
                    <h2>About This Event</h2>
                    <p>
                        This is a live event with an interactive chat.
                        Join the conversation and be part of this events community!
                    </p>
                </div>
            </div>

            <div className="live-chat-section">
                <h2>Live Chat</h2>
                <LiveChat />
            </div>
        </div>
    );
}