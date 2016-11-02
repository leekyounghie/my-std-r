import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

// App compo => 예제 앱 전체를 여기에 정의
class App extends Component {
  handleSubmit(event) {
    event.preventDefault();

    // ref="textInput" 를 찾아서 value 를 text 에 대입
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // DB instert 후 폼에 있는 값을 ''로 지위줌
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input  type="text"  ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>

        </header>

        <ul>   {this.renderTasks()}    </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);
