import React, { useState } from 'react';
import axios from 'axios';
import './ChatForm.css';

interface Message {
  content: string;
  sender: string;
  recipient: string;
}

const ChatForm: React.FC = () => {
  const [message, setMessage] = useState<Message>({
    content: '',
    sender: '',
    recipient: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof Message
  ) => {
    setMessage({ ...message, [field]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    axios.post('http://localhost:3002/message', message)
      .then(response => {
        console.log('Message sent successfully!', response.data);
        setMessage({
            content: '',
            sender: '',
            recipient: '',
          })
      })
      .catch(error => {
        console.error('Error sending message:', error);
        // Aquí puedes manejar el error de envío de mensaje
      });
  };

  return (
    <div className="message-form-container">
      <h2>Send message</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Message:</label>
          <input
            type="text"
            id="content"
            value={message.content}
            onChange={event => handleChange(event, 'content')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sender">Sender:</label>
          <input
            type="text"
            id="sender"
            value={message.sender}
            onChange={event => handleChange(event, 'sender')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipient">Recipient:</label>
          <input
            type="text"
            id="recipient"
            value={message.recipient}
            onChange={event => handleChange(event, 'recipient')}
            required
          />
        </div>

        <button type="submit" className='sendBtn'>Send</button>
      </form>
    </div>
  );
};

export default ChatForm;
