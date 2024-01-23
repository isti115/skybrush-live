import React, { Component, useMemo, memo } from 'react';

const restartPause = 5000;

class WebRTCCamView extends Component {
  constructor(props) {
    super(props);
    this.ws = null;
    this.pc = null;
    this.url = props.url;
    this.stopped = false;
    this.connected = false;
    this.refVideo = React.createRef();
    this.state = {
      srcObject: null,
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    this.stopped = true;
    this.stop();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.refVideo && this.refVideo.current) {
      this.refVideo.current.defaultMuted = true;
      this.refVideo.current.muted = true;
      this.refVideo.current.srcObject = this.state.srcObject;
    }
  }

  render() {
    return (
      <video
        style={{ width: '100%', height: '100%' }}
        ref={this.refVideo}
        muted={true}
        autoPlay
        playsInline
      ></video>
    );
  }

  start() {
    console.log('webrtc::connecting', this.url);
    if (!this.url) return;

    this.ws = new WebSocket(this.url);

    this.ws.onerror = () => {
      console.log('webrtc::ws error');
      if (this.ws === null) {
        return;
      }
      this.ws.close();
      this.ws = null;
    };

    this.ws.onclose = () => {
      console.log('webrtc::ws closed');
      this.ws = null;
      if (!this.stopped) {
        this.scheduleRestart();
      }
    };

    this.ws.onmessage = (msg) => this.onIceServers(msg);
  }
  async onIceServers(msg) {
    if (this.ws === null) {
      return;
    }

    const iceServers = JSON.parse(msg.data);

    this.pc = new RTCPeerConnection({
      iceServers,
    });

    this.ws.onmessage = (msg) => this.onRemoteDescription(msg);
    this.pc.onicecandidate = (evt) => this.onIceCandidate(evt);

    this.pc.oniceconnectionstatechange = (q) => {
      if (this.pc === null) {
        return;
      }

      console.log('webrtc::peer connection state:', this.pc.iceConnectionState);

      switch (this.pc.iceConnectionState) {
        case 'disconnected':
          !this.stopped && this.scheduleRestart();
      }
    };

    this.pc.ontrack = (evt) => {
      console.log('webrtc::new track ' + evt.track.kind);
      if (!this.stopped) {
        this.setState({
          srcObject: evt.streams[0],
        });
      }
    };

    const direction = 'sendrecv';
    this.pc.addTransceiver('video', { direction });

    this.pc.createOffer().then((desc) => {
      if (this.pc === null || this.ws === null) {
        return;
      }
      this.pc.setLocalDescription(desc);

      console.log('ws:: sending offer');
      if (this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(desc));
      } else {
        console.warn('ws::offer not possible, WS NOT READY');
      }
    });
  }

  onRemoteDescription(msg) {
    if (this.pc === null || this.ws === null) {
      return;
    }

    this.pc.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(msg.data))
    );
    this.ws.onmessage = (msg) => this.onRemoteCandidate(msg);
  }

  onIceCandidate(evt) {
    if (this.ws === null) {
      return;
    }

    if (evt.candidate !== null) {
      if (evt.candidate.candidate !== '') {
        if (this.ws.readyState === 1) {
          this.ws.send(JSON.stringify(evt.candidate));
        } else {
          console.warn('ws::Could not send candidate, ws NOT READY');
        }
      }
    }
  }

  onRemoteCandidate(msg) {
    if (this.pc === null) {
      return;
    }

    this.pc.addIceCandidate(JSON.parse(msg.data));
  }

  stop() {
    console.log('closing webrtc');
    if (this.ws !== null) {
      console.log('webrtc::closing ws');
      this.ws.close();
      this.ws = null;
    }

    if (this.pc !== null) {
      console.log('webrtc::closing PC');
      this.pc.close();
      this.pc = null;
    }
  }

  scheduleRestart() {
    console.log('webrtc::restarting');
    this.stop();

    window.setTimeout(() => {
      this.start();
    }, restartPause);
  }
}

const delay = (t) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};

export default memo(WebRTCCamView);
