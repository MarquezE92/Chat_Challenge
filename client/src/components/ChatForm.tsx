import React, { useState } from 'react';  //* vamos a usar el hook para poder trabajar con estados en nuestro componente funcional
import axios from 'axios';                //* Vamos a usar esta librería para realizar las peticiones HTTP
import './ChatForm.css';

interface Message {           //* Definimos la estructura del mensaje que vamos a enviar
  content: string;
  sender: string;
  recipient: string;
}

//* Declaramos el componente funcional (sintáxis arrow function)
const ChatForm = () => {

 //* Agregamos el estado message al componente, inicializado con un objeto que representa un mensaje vacío.
  const [message, setMessage] = useState<Message>({  
    content: '',
    sender: '',
    recipient: '',
  });

  //* Función para actualizar el estado message
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>        //* Toma el evento de cambio
  ) => {
    setMessage({ ...message, [event.target.name]: event.target.value }); //* Con spread operator modifica el campo específico del obj. message
  };

  const handleSubmit = (event: React.FormEvent) => {          //* Función al enviar el formulario
    event.preventDefault();
                                                              //*Verificamos que todos los campos estés completos
    if(!message.content || !message.recipient || !message.sender) return;

    axios.post('http://localhost:3002/message', message)      //* Enviamos la solicitud post con axios
      .then(response => {
        console.log('Message sent successfully!', response.data);   //* Consologueamos la respuesta exitosa
        setMessage({                                                //* Reiniciamos el campo de contenido del mensaje
          ...message,
            content: ''
          })
      })
      .catch(error => {
        console.error('Error sending message:', error);           //* Consologueamos el error
        // Aquí puedes manejar el error de envío de mensaje
      });
  };

  //TODO Renderizado del componente
  return (
    <div className="message-form-container">
      <h2>Send message</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">              {//* Cada campo tiene un label y un input asociados
                                                  }
          <label htmlFor="content">Message:</label>
          <input
            type="text"
            name="content"
            id="content"
            value={message.content}
            onChange={event => handleChange(event)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sender">Sender:</label>
          <input
            type="text"
            name="sender"
            id="sender"
            value={message.sender}
            onChange={event => handleChange(event)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipient">Recipient:</label>
          <input
            type="text"
            name="recipient"
            id="recipient"
            value={message.recipient}
            onChange={event => handleChange(event)}
            required
          />
        </div>

        <button type="submit" className='sendBtn'>Send</button>     {//* Al poner un botón del tipo submit en el form, al hacer click se opera el evento submit.
                                                                    }
      </form>
    </div>
  );
};

export default ChatForm; //* Exportamos el componente
