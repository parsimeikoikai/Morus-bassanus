import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [resData, setResData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const apiUrl = 'http://52.3.250.51:9000/ask';
  
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
    setIsLoading(false);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    try {
      setIsLoading(true);
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));

      const requestData = {
        query: msg
      };

      const response = await axios.post(apiUrl, requestData);
      // Handle the successful response here

      const newMessage = {
        fromSelf: true,
        message: msg,
      };

      // Set the new message in the messages state
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Send the message to the server via socket
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });

      // Also send the message to the server via Axios POST
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
        resData: response.data
      });

      // Update the state with the response data
      setResData(response.data);
      console.log(response.data.answer);

      // Retrieve and update the messages from the server
      const serverResponse = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages((prevMessages) => [...prevMessages, ...serverResponse.data]);
      setIsLoading(false);
    } catch (error) {
      // Handle any errors here
      setIsLoading(false);
      console.error("Error in handleSendMsg:", error);
    }
  };


  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">

        </div>

        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <article className="msg-container msg-self" id="msg-0">
                <div className="msg-box">
                  <div className="flr">
                    <div className="messages">
                      <p className="msg" id="msg-1">
                        {message.question}
                      </p>
                    </div>

                  </div>

                </div>
              </article>
              <article className="msg-container msg-remote" id="msg-0">
                <div className="msg-box">
                  <img className="user-img" id="user-0" src="//gravatar.com/avatar/00034587632094500000000000000000?d=retro" />
                  <div className="flr">
                    <div className="messages">
                      <p className="answer-text msg" id="msg-0">
                        {message.answer}
                      </p>

                      {message.sources && message.sources.length > 0 && (
                        <div className="sources">
                          <h3>For futher information,you can check the following sources.</h3>
                          <br />
                          <ul>
                            {message.sources.map((source, index) => (
                              <li key={index}>{source}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
      {isLoading ? (
        <div className="loading">Generating response...please wait...</div>
      ) : (
        <ChatInput handleSendMsg={handleSendMsg} />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  font-weight : bolder;
  font-family: "Open Sans", "PT Sans", Calibri, Tahoma, sans-serif;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #dae1e7;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 80%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: blue;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: black;
      }
    }
  }
 
  .flr {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    width: calc(100% - 50px);
}
.msg-container {
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0 0 10px 0;
  padding: 0;
  background : #F9FAFB ;
}
.msg-box {
  display: flex;
  background: #ffff;
  padding: 10px 10px 0 10px;
  border-radius: 0 6px 6px 0;
  max-width: 80%;
  width: auto;
  float: left;
  box-shadow: 0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24);
}
.user-img {
  display: inline-block;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  background: #2671ff;
  margin: 0 10px 10px 0;
}
.flr {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: calc(100% - 50px);
}
.messages {
  flex: 1 0 auto;
}
.msg {
  display: inline-block;
  font-size: 11pt;
  line-height: 13pt;
  color: rgba(255,255,255,.7);
  margin: 0 0 4px 0;

}

.timestamp {
  color: rgba(0,0,0,.38);
  font-size: 8pt;
  margin-bottom: 10px;
}
.username {
  margin-right: 3px;
}
.posttime {
  margin-left: 3px;
}
.msg-self .msg-box {
  border-radius: 6px 0 0 6px;
  background: #2671ff;
  float: right;
}
.msg-self .user-img {
  margin: 0 0 10px 10px;
}
.msg-self .msg {
  text-align: right;
}
.msg-self .timestamp {
  text-align: right;
}

.loading {
  text-align: center;
  font-size: 1.8rem;
  color: #9a86f3; /* Change to your desired color */
  padding: 20px; /* Adjust padding as needed */
  animation: blink 1s infinite alternate; /* Add blinking animation */
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.sources {
  padding: 10px;
  border-radius: 5px;
}

.sources p {
  color: var(--gray-500, #667085);
/* Text lg/Regular */
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: 28px; /* 155.556% */
  margin-bottom: 5px;
}
.sources h3 {
  color: var(--gray-500, #667085);
  /* Text lg/Bold */
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 155.556% */
  }
.sources ul {
  list-style-type: disc;
  margin-left: 20px;
}

.sources li {
  margin-bottom: 5px;
  color: var(--gray-500, #667085);
  /* Text lg/Regular */
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 155.556% */
}
.answer-text{
color: var(--gray-500, #667085);
/* Text lg/Regular */
font-family: Inter;
font-size: 18px;
font-style: normal;
font-weight: 400;
line-height: 28px; /* 155.556% */
}
`;
