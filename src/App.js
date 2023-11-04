import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import { HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import Login from "./Components/Login";
import Chat from "./Components/Chat";
import AdminUI from "./Components/AdminUI";

const App = () => {

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [infoIncorrect, setInfoIncorect] = useState(false);
  const [ownerusername, setOwnerUsername] = useState("")
  const [senderusername, setSenderUsername] = useState("")

  const login = async (user, password) => {
    try {
      const response = await axios.post('https://localhost:7039/api/UserLogin', {
        username: user,
        password: password,
      });
      setToken(response.data.token);
      // Faites quelque chose avec le token (par exemple, le stocker dans le localStorage)
      localStorage.setItem('token', response.data.token);

      let role = response.data.role;
      if(role === "admin"){
        setIsAdmin(true)
      }

      const connection = new HubConnectionBuilder()
          .withUrl("https://localhost:7039/chat")
          .configureLogging(LogLevel.Information)
          .build();
      setMessages([])
      connection.on("ReceiveMessage", (user, message) =>{
        setMessages(messages => [...messages, {user, message, time: "just now" }]);
      });

      await connection.start();
      await connection.invoke("JoinRoom", user) //la methode .NET
      setConnection(connection);
      setOwnerUsername(user)
    }catch (e){
      setInfoIncorect(true);
      console.log(e)
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAdmin(false);
  }




  const getMessageHistory = (usernameDest) => {
    const data = { username: `${usernameDest}` };
    axios
        .post(`https://localhost:7039/api/conversation`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const mess = response.data.$values
              .flatMap((value) => [
                {
                  user: value.ownerUsername,
                  message: value.mess,
                  time: value.timeago,
                },
                ...(value.conversation?.messages?.$values.map((message) => ({
                  user: message.ownerUsername,
                  message: message.mess,
                  time: message.timeago,
                })) ?? []),
              ])
              .filter((message) => message.user && message.message);
          setMessages([])
          setMessages(mess);
        })
        .catch((error) => {
          setMessages([])
          console.error("Aucune conversation avec ce user :", usernameDest);
        });
  };



  const sendMessage = async (message, destination) => {
    try {
      await connection?.invoke("SendMessage", message, destination)
    }catch (e){
      console.log(e)
    }
  };

  return (
      <div className='app'>
            {!token ? <Login login={login} erreur={infoIncorrect} /> : isAdmin ? <AdminUI messages={messages} sendMessage={sendMessage} getMessage={getMessageHistory} ownerUsername={ownerusername} logout={logout} /> : <Chat messages={messages} sendMessage={sendMessage} getMessage={getMessageHistory} ownerUsername={ownerusername} logout={logout} />
            }
          </div>

  );

}
export default App;
