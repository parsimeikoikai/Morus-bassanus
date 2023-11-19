import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/morus.png";
import Plus from "../assets/plus.svg";
import {  deleteMessage } from "../utils/APIRoutes";
import axios from "axios";


export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentEmail, setEmail] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setEmail(data.email);
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = async (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  const removeCurrentChat= async(index, contact) =>{
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(deleteMessage, {
      sender: data._id,
    });
    setCurrentSelected(index);
    changeChat(contact);
  }
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="DFS" />
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <buttton className="sidebarButton">
                    <img src={Plus} alt="DFS" /> &nbsp;New Chat
                  </buttton>
                </div>
              );
            })}
            <br />

            <div className="sidebarText">
            Your humanitarian companion: providing instant support and facilitating informed decision-making.
            </div>
            <div className="disclaimer">
              <h4><b>Disclaimer</b></h4>
              The existing database is designed exclusively for demonstration purposes and encompasses data solely pertaining to floods and droughts in South Sudan. Feel free to pose any questions relevant to this subject matter.


            </div>

          </div>

          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
            <h4>{currentUserName && `${currentUserName.charAt(0).toUpperCase()}${currentUserName.slice(1)}`}</h4>
            <h4>{currentEmail}</h4>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background: var(--gray-100, #F2F4F7);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 3rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background: var(--gray-100, #F2F4F7);
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background: var(--gray-100, #F2F4F7);
    }
  }

  .current-user {
    background: var(--gray-100, #F2F4F7);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 2.5rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h4 {
        color:#525E70;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
  .sidebarText
  {
    color: var(--gray-600, #475467);
    text-align: center;
    
    /* Text xs/Regular */
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
  }
  .sidebarButton {
    display: flex;
    margin : auto;
    padding: 8px 70px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid var(--primary-600, #7F56D9);
    background: var(--primary-600, #7F56D9);
    color : #ffff
    /* Shadow/xs */
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    color: var(--base-white, #FFF);

    /* Text sm/Semibold */
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
  }
  .disclaimer
  {
    color: var(--gray-600, #475467);
    text-align: center;
    /* Text xs/Regular */
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
    margin-top : 11vh
  }
`;
