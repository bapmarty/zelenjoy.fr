import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom'
import Modal from "react-responsive-modal"
import CookieConsent from "react-cookie-consent"
import Cookie from 'js-cookie'

//PAGES
import Stream from './components/Stream'
import Planning from './components/Planning'
import Leaderboard from './components/Leaderboard'
import Informations from './components/Informations'
import Rediffusions from './components/Rediffusions'
import NotFound from './components/NotFound'

//stylesheets
import './assets/scss/App.scss'
import './assets/scss/Navbar.scss'
import './assets/scss/Chat.scss'
import SnapCode from './assets/images/snapcodeBitmoji.svg'
import CrossImg from './assets/images/letter-x.svg'
import LogoUnreachable from './assets/images/logoUnreachable.png';

const CLIENT_ID   = 't4qakhaphd58pb093qth3rh0r4fz40';
const OAUTH_LINK  = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:3001/api/callback&scope=user_follows_edit+user_subscriptions`;

class App extends Component {
  constructor() {
    super();
    if (!localStorage.getItem("night_mode")) localStorage.setItem("night_mode", "false")
    if (!localStorage.getItem("chat_mode")) localStorage.setItem("chat_mode", "false")
   
    this.state = {
      twitchRefresh: false,
      stream_data: {online: false},
      user_data: {
        id: "",
        name: "",
        logo: "",
        follow: false,
        follow_since: "",
        sub: false,
        sub_since: ""
      },
      accountOver: false,
      openSnap: false,
      openCredits: false,
      toggleSettings: false,
      toggleNightMode: localStorage.getItem("night_mode"),
      toggleChatMode: localStorage.getItem("chat_mode"),
      togglemPlayerMode: false,
      nightMode: "fas fa-toggle-off",
      chatMode: "fas fa-toggle-off",
      mPlayerMode: "fas fa-toggle-off",
      chat: localStorage.getItem("chat_theme"),
    } 
  }

  componentDidMount() {
    if (Cookie.get('twitch_access_token'))
    fetch('/api/profile', {mode: 'no-cors'})
    .then(response => { return response.json() })
    .then(user_data => {
      //if (user_data.name !== "Undefined" && user_data.name !== "")
        this.setState({ user_data: user_data });
    });
  }

  componentWillMount() {
    fetch('/api/stream')
    .then(response => { return response.json() })
    .then(data => this.setState({ isOnline: (data.online ? 'on' : 'off') }));

    var d = document.getElementById('settings')
    if (localStorage.getItem("chat_mode") === "true"){
      d.classList.add('chat-left')
      this.setState({ toggleChatMode: localStorage.getItem('chat_mode'), chatMode: "fas fa-toggle-on"})
    }
    if (localStorage.getItem("night_mode") === "true") {
      this.setState({
        toggleNightMode: localStorage.getItem('night_mode'),
        nightMode: "fas fa-toggle-on",
        chat: "https://www.twitch.tv/embed/zelenjoy/chat?darkpopout"
      })
      d.classList.add('night-mode')
    } else {
      this.setState({
        toggleNightMode: localStorage.getItem('night_mode'),
        nightMode: "fas fa-toggle-off",
        chat: "https://www.twitch.tv/embed/zelenjoy/chat"
      })
    }
  }

  ModalSnap = () => {this.setState({openSnap: !this.state.openSnap})}
  ModalCredits = () => {this.setState({openCredits: !this.state.openCredits})}
  settingsToggler = () => {this.setState({ toggleSettings: !this.state.toggleSettings })}

  nightMode() {
    let d = document.getElementById('settings')
    if (this.state.toggleNightMode === "false") {
      localStorage.setItem('night_mode', 'true')
      this.setState({
        toggleNightMode: localStorage.getItem('night_mode'),
        nightMode: "fas fa-toggle-on",
        chat: "https://www.twitch.tv/embed/zelenjoy/chat?darkpopout"
      })
      d.classList.add('night-mode')
    } else {
      localStorage.setItem('night_mode', 'false')
      this.setState({
        toggleNightMode: localStorage.getItem('night_mode'),
        nightMode: "fas fa-toggle-off",
        chat: "https://www.twitch.tv/embed/zelenjoy/chat"
      })
      d.classList.remove('night-mode')
    }
  }

  chatMode() {
    let d = document.getElementById('settings')
    if (this.state.toggleChatMode === 'false') {
      localStorage.setItem('chat_mode', 'true')
      this.setState({ toggleChatMode: localStorage.getItem('chat_mode'), chatMode: "fas fa-toggle-on"})
      d.classList.add('chat-left')
    } else {
      localStorage.setItem('chat_mode', 'false')
      this.setState({ toggleChatMode: localStorage.getItem('chat_mode'), chatMode: "fas fa-toggle-off"})
      d.classList.remove('chat-left')
    }
  }

  mPlayerMode() {
    if (this.state.togglemPlayerMode === false) {
      this.setState({
        togglemPlayerMode: !this.state.togglemPlayerMode,
        mPlayerMode: "fas fa-toggle-off"
      })
    }
    else {
      this.setState({
        togglemPlayerMode: !this.state.togglemPlayerMode,
        mPlayerMode: "fas fa-toggle-on"
      })
    }
  }

  twitchLogout() {
    Cookie.remove('twitch_access_token');
    Cookie.remove('twitch_refresh_token');
    this.setState({
      user_data: {
        id: "",
        name: "",
        logo: "",
        follow: false,
        follow_since: "",
        sub: false,
        sub_since: ""
      }
    });
  }

  accountHoverOn = () => this.setState({ accountOver: true })
  accountHoverOff = () => this.setState({ accountOver: false })

  userAccount() {
    if (this.state.user_data.id !== "") {
      return (
        <div className="app-account-login-settings-buttons">
          <div className="app-login-settings-buttons">
            <div className="app-stream-connected" onMouseEnter={this.accountHoverOn} onMouseLeave={this.accountHoverOff}>
              <div className="app-stream-stats">
                {this.state.user_data.name}
                <i className="fas fa-cookie-bite"></i>
              </div>
              <div className="app-stream-connected-logo">
                <img src={this.state.user_data.logo} width="48px" alt="user-logo" />
              </div>
            </div>
            <div onClick={this.settingsToggler.bind(this)}>
              <div className="app-settings-website">
                <div className="app-settings-website-icon">
                  <i className="fas fa-sliders-h"></i>
                </div>
              </div>
            </div>
          </div>
          <div className={`account-settings-${this.state.accountOver === true ? "show" : "hide"}`} onMouseEnter={this.accountHoverOn.bind(this)} onMouseLeave={this.accountHoverOff.bind(this)}>
            <div className="account-setting" onClick={this.twitchLogout.bind(this)}>
              <div><i className="fas fa-power-off"></i></div>
              <div>Déconnexion</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="app-account-login-settings-buttons">
          <div className="app-login-settings-buttons">
            <a className="oauth-twitch-block" href={OAUTH_LINK}>
              <div className="oauth-twitch-text">
                <h2>Connexion</h2>
                <h3>avec twitch</h3>
              </div>
              <div className="oauth-twitch-icon">
                <i className="fab fa-twitch"></i>
              </div>
            </a>
            <div onClick={this.settingsToggler.bind(this)}>
              <div className="app-settings-website">
                <div className="app-settings-website-icon">
                  <i className="fas fa-sliders-h"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    let classSettings = `settings ${this.state.toggleSettings === true ? 'show' : 'hide'}-settings`
    return (
      <div className="App">
        <Router>
          <nav className="app-navbar">
            <div className="app-navbar-title">
              <NavLink to="/"><span className="app-navbar-title-text">ZelEnjoy</span></NavLink>
            </div>
            <div className="app-nav-list">
              <NavLink exact to="/" activeClassName="link-is-active">Stream <i className={'fas fa-circle ' + this.state.isOnline + 'line-mode'}></i></NavLink>
              <NavLink to="/Programmation" activeClassName="link-is-active">Programmation</NavLink>
              <NavLink to="/informations" activeClassName="link-is-active">Informations</NavLink>
              <NavLink to="/leaderboard" activeClassName="link-is-active">Leaderboard</NavLink>
              <NavLink to="/rediffusions" activeClassName="link-is-active">Rediffusions</NavLink>
            </div>
            <div className="app-other-links">
              <ul>
                <li><a href="http://discord.zelenjoy.fr" target="blank" rel="noopener noreferrer" id="discord-color"><i className="fab fa-discord"></i></a></li>
                <li><a href="https://twitch.tv/zelenjoy" target="blank" rel="noopener" id="twitch-color"><i className="fab fa-twitch"></i></a></li>
                <li><a href="https://twitter.com/enjoyzel" target="blank" rel="noopener noreferrer" id="twitter-color"><i className="fab fa-twitter"></i></a></li>
                <li><div onClick={this.ModalSnap} id="snap-color"><i className="fab fa-snapchat-ghost"></i></div></li>
                <li><a href="https://instagram.com/zelenjoy" target="blank" rel="noopener noreferrer" id="instagram-color"><i className="fab fa-instagram"></i></a></li>
              </ul>
            </div>

            {this.userAccount()}
          </nav>
          <div className="app-container">
            <Switch>
              <Route exact path="/" render={(props) => <Stream {...this.props} user_data={this.state.user_data} />} />
              <Route exact path="/Programmation" render={(props) => <Planning {...this.props} />}/>
              <Route exact path="/informations" render={(props) => <Informations {...this.props} />}/>
              <Route exact path="/leaderboard" render={(props) => <Leaderboard {...this.props} />}/>
              <Route exact path="/rediffusions" render={(props) => <Rediffusions {...this.props} />}/>
              <Route exact path="*" component={(props) => <NotFound {...props} />} />
            </Switch>

            <div className="app-chat-settings">
              <div className="app-chat">
                <iframe frameBorder="0"
                  title="twitch_chat"
                  scrolling="no"
                  id="chat_embed"
                  src={this.state.chat}
                  height="100%"
                  width="100%">
                </iframe>
              </div>
              <div className={classSettings}>
                <div className="settings-panel">
                  <div className="settings-panel-header">
                    <div>
                      <h2>Paramètres</h2>
                    </div>
                    <div className="settings-panel-img" onClick={this.settingsToggler.bind(this)}>
                      <img src={CrossImg} alt="Fermer"/>
                    </div>
                  </div>
                  <div className="settings-panel-list">
                    <div className="settings-panel-block">
                      <div className="settings-panel-desc">
                        <h3>Mode nuit</h3>
                        <p>Pour ceux qui reste toute la nuit.</p>
                      </div>
                      <div onClick={this.nightMode.bind(this)} className="settings-panel-icon">
                        <i className={this.state.nightMode}></i>
                      </div>
                    </div>
                    <div className="settings-panel-block">
                      <div className="settings-panel-desc">
                        <h3>Mode chat gauche</h3>
                        <p>Changer entre le chat à gauche ou à droite</p>
                      </div>
                      <div onClick={this.chatMode.bind(this)} className="settings-panel-icon">
                        <i className={this.state.chatMode}></i>
                      </div>
                    </div>
                    <div className="settings-panel-block">
                      <div className="settings-panel-desc">
                        <h3>Mini player</h3>
                        <p>Activer ou désactiver le mini-player.</p>
                      </div>
                      <div onClick={this.mPlayerMode.bind(this)} className="settings-panel-icon">
                        <i className={this.state.mPlayerMode}></i>
                      </div>
                    </div>
                  </div>
                  <div className="settings-panel-footer">
                    <p className="settings-panel-footer-text">
                      <NavLink to="/contact">Contact</NavLink> <i className="fas fa-circle"></i>
                      <NavLink to="/cgu">Mentions légales</NavLink> <i className="fas fa-circle"></i>
                      <span onClick={this.ModalCredits}>Crédits</span>
                    </p>
                    <p className="settings-panel-footer-text">©<NavLink to="/">zelenjoy.fr</NavLink> 2019. tous droits réservés.</p>
                  </div>
                </div>
                <div className="dark-background-settings-panel" onClick={this.settingsToggler.bind(this)}></div>
              </div>
            </div>
            <Modal open={this.state.openSnap} onClose={this.ModalSnap} showCloseIcon={false}>
              <img src={SnapCode} alt="@ZelEnjoy"/>
              <p className="app-modal-snap-code-title">ZelEnjoy</p>
            </Modal>

            <Modal open={this.state.openCredits} onClose={this.ModalCredits} showCloseIcon={false}>
              <div className="container-modal-credits">
                <div className="modal-credits-logo">
                  <img src={LogoUnreachable} alt="Unreachable-Studios.fr"/>
                </div>
                <div className="modal-credits-title">
                  <a href="https://unreachable-studios.fr/" target="blank" rel="noopener noreferrer">Unreachable-studios.fr</a>
                </div>
              </div>
            </Modal>
            <CookieConsent
              location="bottom"
              buttonText="Accepter"
              cookieName="cookie-consent"
              style={{padding: "30px 0", background: "rgba(188, 66, 222, 0.8)", zIndex: "10000", fontSize: "22px"}}
              buttonStyle={{ background: "rgba(153, 53, 180, 1)", color: "#EEE", fontSize: "18px", padding: "15px 30px", borderRadius: "5px"}}
              expires={365}
            >
              Ce site nécéssite l'utilisation de cookies pour fonctionner pleinement.
            </CookieConsent>
          </div>
        </Router>
      </div>
    )
  }
}

export default App