import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import UserContext from '../../contexts/UserContext'

import './SidenavModal.css'

const SidenavModal = ({ showSidenav, setShowSidenav }) => {
  const { loggedInUser, setLoggedInUser} = React.useContext(UserContext)
  const history = useHistory()
  const categories = ['TECH', 'LIFE', 'SPORTS', 'ART', 'FOOD', 'DIY', 'HEALTH', 'FITNESS']

  const handleBubblingDownClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="modalContainer" onClick={() => setShowSidenav(!showSidenav)}>
      <aside className="modalSidebar" onClick={handleBubblingDownClick}>
        <div className="modalContentContainer">
          <div className="modalContent">
            <div>
              {categories.map((category) => 
                <div>
                  <Link to={`/posts?category=${category}`} onClick={() => setShowSidenav(false)}>{category}</Link>
                </div>
              )}
            </div>

            <div className="sidenavUserOptions">
              <div>
                <Link to={`/author/${loggedInUser._id}`} onClick={() => setShowSidenav(false)}>My Profile</Link>
              </div>
              
              <div>
                <Link to="/settings" onClick={() => setShowSidenav(false)}>Settings</Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default SidenavModal
