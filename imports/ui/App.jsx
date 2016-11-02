import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
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

    // 작동 않함
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), // current time
    //   owner: Meteor.userId(),          //  id of logged in user <==
    //   username: Meteor.user().username //  username of logged in user <==
    // });

    // 여기 추가 서버 Method 호출 <==
    Meteor.call('tasks.insert', text);

    // DB instert 후 폼에 있는 값을 ''로 지위줌
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {

    let filteredTasks = this.props.tasks;
    // 체크박스 체크시 => 필터 적용
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    // return filteredTasks.map((task) => (
    //   <Task key={task._id} task={task} />
    // ));

    return filteredTasks.map((task) => {
     const currentUserId = this.props.currentUser && this.props.currentUser._id;
     const showPrivateButton = task.owner === currentUserId;

     return (
       <Task
         key={task._id}
         task={task}
         showPrivateButton={showPrivateButton}
       />
       );
     });    
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List:9.Add Methods. ({this.props.incompleteCount})</h1>

            <label className="hide-completed">
                <input
                  type="checkbox"
                  readOnly
                  checked={this.state.hideCompleted}
                  onClick={this.toggleHideCompleted.bind(this)}
                />
                Hide Completed Tasks
            </label>

          <AccountsUIWrapper />  {/* compo tag here  */}

          {/* 로그인 이후에 보임 */}
          { this.props.currentUser ?
              <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks"
                />
              </form> : ''
          }


        </header>

        <ul>   {this.renderTasks()}    </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,  // 데이터 형식이 object 임을 정의
};

export default createContainer(() => {

    // autopublish 패키지 삭제이후 추가
    Meteor.subscribe('tasks');
    //  여기까지

  return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),   // App compo 에서 사용하도록 등록
  };
}, App);
