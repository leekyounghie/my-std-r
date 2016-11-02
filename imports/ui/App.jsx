import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';   // 여기 추가
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App compo => 예제 앱 전체를 여기에 정의
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  // 클릭할 때마다 실행 = 상태값을 반대로
  toggleHideCompleted() {
   this.setState({
     hideCompleted: !this.state.hideCompleted,
   });
  }

  handleSubmit(event) {
    event.preventDefault();

    // ref="textInput" 를 찾아서 value 를 text 에 대입
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),          // 여기 추가  id of logged in user <==
      username: Meteor.user().username // 여기 추가  username of logged in user <==
    });

    // DB instert 후 폼에 있는 값을 ''로 지위줌
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {

    let filteredTasks = this.props.tasks;
    // 체크박스 체크시 => 필터 적용
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List:8.User Acc. ({this.props.incompleteCount})</h1>

            <label className="hide-completed">
                <input
                  type="checkbox"
                  readOnly
                  checked={this.state.hideCompleted}
                  onClick={this.toggleHideCompleted.bind(this)}
                />
                Hide Completed Tasks
            </label>

          <AccountsUIWrapper />  {/* 여기 추가 compo tag here  */}

    {/* 아래 코드 추가 = 로그인 이후에 보임 */}
          { this.props.currentUser ?
              <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks"
                />
              </form> : ''
          }
    {/* 여기까지 = 로그인 이후에 보임  */}

        </header>

        <ul>   {this.renderTasks()}    </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,  // 여기 추가. 데이터 형식이 object 임을 정의 <==
};

export default createContainer(() => {
  return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),  // 여기 추가. App compo 에서 사용하도록 등록 <==
  };
}, App);
