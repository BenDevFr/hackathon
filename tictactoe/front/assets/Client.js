class Client
{
  url = '';
  connection = null;
  ready = false;
  id = '';

  eventListeners = {};

  constructor(url) {
    this.url = url;
  }


  async connect() {
    this.connection = new WebSocket(this.url);
    this.connection.addEventListener('open', (event) => {this.handleOpen(event)});
    this.connection.addEventListener('message', (event) => {this.handleMessage(event)});
  }

  addEventListener(eventName, callback) {
    this.eventListeners[eventName] = callback;
  }

  handleOpen(event) {
    this.ready = true;
  }

  handleMessage(event) {
    const response = JSON.parse(event.data);
    const messageType = response.type;

    if(messageType === 'connection') {
      console.log('%c Connected with ID : ' + response.data.id, 'color: #f00; font-size: 1rem');
      this.id = response.data.id;
    }

    if(this.eventListeners[messageType]) {
      this.eventListeners[messageType](response);
    }
  }

  sendMessage(data) {
    if(this.ready) {
      this.connection.send(JSON.stringify(data));
    }
    else {
      setTimeout(() => {
        this.sendMessage(data)
      }, 100);
    }
  }
}