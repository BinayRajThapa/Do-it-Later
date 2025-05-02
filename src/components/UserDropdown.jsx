import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import './UserDropdown.scss';
import toast from 'react-hot-toast';
import Modals from './Modals'; 

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    toast("You have been logged out 👋");
    setShowLogoutConfirm(false);
  };

  return (
    <div className="user-dropdown">
      <div className="profile-button" onClick={toggleDropdown}>
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="profile-name">{user.name}</span>
      </div>

      {isOpen && (
        <div className="dropdown-content">
          <div className="user-info">
            <div className="user-avatar large">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="dropdown-divider" />

          <div className="dropdown-actions">
            <button 
              className="logout-btn"
              onClick={() => setShowLogoutConfirm(true)} 
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      <Modals
        type="logout"
        show={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default UserDropdown;
