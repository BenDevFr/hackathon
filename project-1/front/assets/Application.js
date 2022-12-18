class Application
{

  endpointList = '../back/public/api/tasks';
  endpointSave = '../back/public/api/tasks';

  constructor() {
    this.initializeForm();
  }


  async loadTasks() {
    const tasks = await fetch(this.endpointList)
      .then(response => response.json())
    ;
    console.log(tasks)

    tasks.forEach(task => {this.renderTask(task)})
  }

  initializeForm() {
    document.querySelector('#new-task').addEventListener('submit', (event) => this.newTask(event));
  }

  async newTask(event) {
    event.preventDefault();
    console.log('%cApplication.js :: 26 =============================', 'color: #f00; font-size: 1rem');
    console.log(event);
    const taskTitle = document.querySelector('#new-task-name').value;
    const taskDescription = document.querySelector('#new-task-description').value;

    document.querySelector('#new-task-name').value = '';
    document.querySelector('#new-task-description').value = '';

    const newTask = await this.postData(this.endpointSave, {
      title: taskTitle,
      description: taskDescription
    });
    console.log('%cApplication.js :: 39 =============================', 'color: #f00; font-size: 1rem');
    console.log(newTask);
    this.renderTask(newTask.data);
  }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  
  renderTask(task) {
    const element = document.createElement('div');
    element.classList.add('col');
    element.innerHTML = `

      <div class="card" style="width: 18rem;">
        <img src="https://picsum.photos/seed/picsum/200/100" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
        </div>
      </div>
    `;

    document.querySelector('main').append(element);
  }


}