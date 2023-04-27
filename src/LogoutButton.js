import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

function LogoutButton(props) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    props.setLoggedIn(false);
    navigate('/');
    //Remove user from local storage
    localStorage.removeItem('user');
  };

  return (
    <button className='logout' onClick={handleLogoutClick}>Log Out</button>
  );
}

export default LogoutButton;
