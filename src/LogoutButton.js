import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoutButton.css';

function LogoutButton(props) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    props.setLoggedIn(false);
    navigate('/');
  };

  return (
    <button className='logout' onClick={handleLogoutClick}>Log Out</button>
  );
}

export default LogoutButton;
