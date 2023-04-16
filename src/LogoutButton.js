import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton(props) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    props.setLoggedIn(false);
    navigate('/');
  };

  return (
    <button onClick={handleLogoutClick}>Log Out</button>
  );
}

export default LogoutButton;
