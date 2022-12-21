class Client
{
  url = '';
  connection = null;
  ready = false;
  id = '';

  constructor(url) {
    this.url = url;
  }


  async connect() {
    this.connection = new WebSocket(this.url);
    this.connection.addEventListener('open', (event) => {this.handleOpen(event)});
    this.connection.addEventListener('message', (event) => {this.handleMessage(event)});
  }

  handleOpen(event) {
    this.ready = true;
  }

  handleMessage(event) {
    const response = JSON.parse(event.data);
    const messageType = response.type;

    if(messageType === 'message') {
      let element = document.createElement('div');
      element.innerHTML = response.data.message;
      document.querySelector('.debug').append(element);
    }
    else if(messageType === 'connection') {
      console.log('%c Connected with ID : ' + response.data.id, 'color: #f00; font-size: 1rem');
      this.id = response.data.id;
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