import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Avatar from "../Avatar";
import { UserContext } from "../UserContext";

export default function MessagesPage() {
    const [ws, setWs] = useState(null);
    const [people, setPeople] = useState([]);
    const { user } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState('');
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);

        axios.get('/messages/users')
            .then(response => {
                setPeople(response.data);
            })
            .catch(error => {
                console.error("Error fetching user IDs:", error);
            });

        return () => {
            ws.removeEventListener('message', handleMessage);
            ws.close();
        };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            axios.post('/messages/conversation', { recipient: selectedUser })
                .then(response => {
                    setMessages(response.data);
                })
                .catch(error => {
                    console.error("Error fetching messages:", error);
                });
        }
    }, [selectedUser]);

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        setMessages(prev => ([...prev, { text: messageData.text, sender: messageData.sender }]));
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUser,
            text: messageText
        }));
        setMessages(prev => ([...prev, { text: messageText, sender: user._id }]));
        setMessageText('');
    }

    return (
        <div className="flex h-screen mt-5">
            <div className='bg-secondary text-tertiary w-1/3 p-2'>
                <div className="text-primary font-bold flex gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                    </svg>
                    Messages
                </div>
                {people.map((username, index) => (
                    <div key={index} onClick={() => username == selectedUser ? setSelectedUser('') : setSelectedUser(username)} className={"flex items-center gap-2 font-bold border-b border-primary px-2 py-2 mt-3 rounded-sm cursor-pointer transition duration-300 ease-in-out hover:bg-primary hover:text-black " + (username == selectedUser ? "bg-primary text-secondary" : '')}>
                        {selectedUser && (
                            <div className="w-1 h-12 bg-secondary rounded-r-md "></div>
                        )}
                        <Avatar name={username} />
                        {username}
                    </div>
                ))}
            </div>
            <div className="flex flex-col justify-end bg-gray-100 w-2/3 p-3">
                <div className="flex-grow overflow-y-scroll">
                    {selectedUser && (
                        messages.map((message, index) => (
                            <div key={index} className="mb-1 flex flex-col gap-2 px-2">
                                <div className={"px-2 -mb-1 text-gray-500 "+(message.sender == user._id ? "ml-auto" : "mr-auto")}>{message.sender == user._id ? user.name:selectedUser}</div>
                                 <div className={"inline-flex items-center px-4 py-2 rounded-full font-bold " + (message.sender == user._id ? "ml-auto bg-primary text-secondary" : "mr-auto bg-secondary text-tertiary")}>
                                    {message.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {selectedUser && (
                    <form onSubmit={sendMessage} className="flex gap-1 items-center">
                        <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="send a message..." className="flex-grow w-2/3 bg-secondary text-tertiary" />
                        <button type="submit" className='w-11 h-11 bg-secondary flex justify-center items-center text-primary p-2 rounded-full transition duration-300 ease-in-out hover:bg-primary hover:text-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
