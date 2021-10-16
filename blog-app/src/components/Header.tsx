import './Header.css'

const Header = () => {

  return (
    <div>
      <div className="headerContainerTop">
        <div className="searchButton">
          <i className="fas fa-search"></i>
        </div>

        <div className="mainTitle">
          The Blog
        </div>

        <div className="userButtons">
          <button>Login</button>
          <button>Register</button>
        </div>
      </div>

      <div className="headerContainerBottom">
        <span>TECH</span>
        <span>LIFE</span>
        <span>SPORTS</span>
        <span>ART</span>
        <span>FOOD</span>
        <span>DIY</span>
        <span>HEALTH</span>
        <span>FITNESS</span>
      </div>
    </div>
  )
}

export default Header;