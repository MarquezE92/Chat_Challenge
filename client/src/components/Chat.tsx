import { useEffect, useState } from 'react';
import axios from 'axios';
import './Chat.css';
//* librería que proporciona la funcionalidad de WebSockets para establecer una conexión en tiempo real con el servidor.
import io from 'socket.io-client'; 

interface Message {
  content: string;
  sender: string;
  recipient: string;
  fecha: Date;
}

//TODO Este componente va a encargarse de mostrar la lista de mensajes.
const Chat = () => {
  const [chatMessages, setChatMessages] = useState<Message[]>([])

  function callMessages() {
    axios.get('http://localhost:3002/messages')
      .then((response) => {
        console.log('Message loaded successfully!', response.data);
        setChatMessages(response.data)
      })
      .catch(error => {
        console.error('Error loading message:', error);
        // Aquí puedes manejar el error de envío de mensaje
      })
  }

  function formatDate(date: Date): string {
  
    const dateString = date?.toString();
    const day = `${new Date(date).getDate()}/${new Date(date).getMonth()+1}`
    const hour = `${new Date(date).getHours()}:${dateString.substring(14, 16)}`

    return ` ${day} at ${hour}`;
  }

const socket = io('http://localhost:3002');   //* Se crea una instancia de Socket.io utilizando la URL del servidor

socket.on('connect', ()=> console.log('Tenemos comunicación bidireccional en tiempo real'))

  socket.on('update', (data: Message) => {      //* Este evento se activa cuando se recibe una actualización de mensajes en tiempo real desde el server
    callMessages() //* Llamamos a la nueva lista de mensajes
     

  });

  useEffect(() => {
    callMessages()
  }, []);




  return (
    <div className='messagesContainer'>
      {
        chatMessages?.map(message => (
          <div className='chatBubble' key={message.fecha.toString()}>
            <p className='date'>{formatDate(message.fecha)}</p>
            <p className='interlocutors'><span>From:</span> {message.sender}</p>
            <p className='interlocutors'><span>To:</span> {message.recipient}</p>
            <br />
            <p className='message'>{message.content}</p>




          </div>
        ))
      }
    </div>
  );
};

export default Chat

