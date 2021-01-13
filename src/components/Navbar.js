import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { Auth } from 'aws-amplify';
import { NavLink } from "react-router-dom";
import {
    AmplifyAuthenticator,
    AmplifySignOut,
    AmplifyGreetings,
  } from "@aws-amplify/ui-react";
import account from "../Assets/account_balance.svg";

const Navbar = (props) => {
  const { user} = props;


  const signOut = async() => {
      try {
          await Auth.signOut()
      } catch (error) {
          console.error('auth sign out error ')
          
      }
  }

  return (
    <Nav mode='horizontal' theme='dark' defaultActive='1'>
      <div className='nav-container'>
        <Nav.Item index='1'>
          <NavLink to='/' className='nav-link'>
            <span className='app-title'>
              <img src={account} alt='App Icon' className='app-icon'></img>
              AmplifyAgora
            </span>
          </NavLink>
        </Nav.Item>
        {/* navbar Items */}
        <div className='nav-items'>
          <Nav.Item index='2'>
            <span className='app-user'>Hello, {user.username}</span>
          </Nav.Item>
          <Nav.Item index='3'>
              <NavLink to='/profile' className='nav-link'>
                  <Icon name="setting"/>
                  Profile
              </NavLink>
            
          </Nav.Item>
          <Nav.Item index='4'>
              <div className='signout'>
                   <AmplifySignOut type="warning"  >Sign Out </AmplifySignOut>
              </div>
           
          </Nav.Item>
        </div>


      </div>
    </Nav>
  );
};

export default Navbar;
