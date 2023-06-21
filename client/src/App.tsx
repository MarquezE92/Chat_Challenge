import ChatForm from './components/ChatForm'
import Chat from './components/Chat'
import './App.css'

function App() {


  return (
    <div className='container'>
      <div className='chatDiv'>
      <Chat/>
      </div>
      <div className='chatFormDiv'>
        <ChatForm/>
      </div>

    </div>
  )
}

export default App
