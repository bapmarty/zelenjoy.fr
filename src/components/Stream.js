import React, { Component } from 'react';
import Cookie from 'js-cookie'

import '../assets/scss/Stream.scss'

const CLIENT_ID = "t4qakhaphd58pb093qth3rh0r4fz40";

export default class Stream extends Component {

  constructor() {
    super()

    if (!sessionStorage.getItem('theater_mode')) sessionStorage.setItem('theater_mode', 'false')
    this.state = {
      stream_data: {
        online: false,
        title: "[FR] - Une bambie sur Fortnite",
        game: "rien",
        display_count: "0",
        display_text: "Followers",
        theaterMode: sessionStorage.getItem('theater_mode')
      }
    }
  }

  componentWillMount() {
    fetch('/api/stream')
    .then(response => { return response.json() })
    .then(data => this.setState({ stream_data: data }));
  }

  componentDidMount() {
    this.updateViewers = setInterval(() => {
      fetch('/api/stream')
      .then(response => { return response.json() })
      .then(data => this.setState({ stream_data: data}));
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.updateViewers)
  }

  twitchFollow() {
    if (Cookie.get('twitch_access_token')) {
      fetch(`https://api.twitch.tv/kraken/users/159982473/follows/channels/146285949`, { //TODO: Update to New API (endpoint not found yet)
        method: 'PUT',
        headers: {
            'Client-ID': CLIENT_ID,
            'Authorization': 'OAuth ' + Cookie.get('twitch_access_token'),
            'Accept': 'application/vnd.twitchtv.v5+json'
        }
      })
      .catch(() => console.log('Error while following channel') );
    } else {
      console.log('login toi fdp')
    }
  }

  setTheaterMode() {
    let d = document.querySelector('#settings')
    if (this.state.theaterMode === 'false') {
      sessionStorage.setItem('theater_mode', 'true')
      this.setState({ theaterMode: sessionStorage.getItem('theater_mode')})
      d.classList.add('theater-mode')
    } else {
      sessionStorage.setItem('theater_mode', 'false')
      this.setState({ theaterMode: sessionStorage.getItem('theater_mode')})
      d.classList.remove('theater-mode')
    }
  }

  render() {
    document.title = "ZelEnjoy - Stream"
    return (
      <div>
        <div className="stream-app-navbar-theater">
          <div className="stream-title-viewers">
            <div className="stream-title">
              <h3>{this.state.stream_data.title.slice(0, 150) + (this.state.stream_data.title.length > 150 ? '...' : '')}</h3>
              <h4><span className="pink">Zelenjoy</span> joue à {this.state.stream_data.game}</h4>
            </div>
            <div className="stream-viewers">
              <h3>{this.state.stream_data.display_count}</h3>
              <h4 className="pink">{this.state.stream_data.display_text}</h4>
            </div>
            <div className="leave-theater-button">
            <button onClick={this.setTheaterMode.bind(this)}> <span className="display-name">Mode théâtre</span> <i className="fas fa-expand stream-fsdt-buttons-icon"></i></button>
            </div>
          </div>
        </div>
        <div className="Stream">
          <div className="stream-block">
            <div className="stream-title-viewers">
              <div className="stream-title">
                <h3>{this.state.stream_data.title.slice(0, 150) + (this.state.stream_data.title.length > 150 ? '...' : '')}</h3>
                <h4><span className="pink">Zelenjoy</span> joue à {this.state.stream_data.game}</h4>
              </div>
              <div className="stream-viewers">
                <h3>{this.state.stream_data.display_count}</h3>
                <h4 className="pink">{this.state.stream_data.display_text}</h4>
              </div>
            </div>
            <div className="stream-iframe">
              <iframe src="https://player.twitch.tv/?channel=zelenjoy"
                      title="twitch_player"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      frameBorder="0">
              </iframe>
            </div>
            <div className="stream-fsdt-buttons">
              <div className="stream-fsd-buttons">
                <button onClick={this.twitchFollow.bind(this)}> <span className="display-name">{this.props.user_data.follow_since ? 'Suivi' : 'Suivre'}</span> <span className=""><i className="fas fa-heart stream-fsdt-buttons-icon"></i></span></button>
                <a href="https://www.twitch.tv/products/zelenjoy" target="_blank" rel="noopener noreferrer"> <span className="display-name">{ this.props.user_data.sub_since ? "Abonné" : "S'abonner"}</span> <span className=""><i className="fas fa-star stream-fsdt-buttons-icon"></i></span></a>
                <a href="https://streamlabs.com/zelenjoy" target="_blank" rel="noopener noreferrer"> <span className="display-name">Soutenir</span> <span className=""><i className="fas fa-coins stream-fsdt-buttons-icon"></i></span></a>
              </div>
              <div className="stream-theater-mode-button">
                <button onClick={this.setTheaterMode.bind(this)}> <span className="display-name">Mode théâtre</span> <i className="fas fa-expand stream-fsdt-buttons-icon"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}