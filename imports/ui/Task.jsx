import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';   // meteor npm install --save classnames


// Task compo - single todo item을 여기에 정의
export default class Task extends Component {
  toggleChecked() {

    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
   }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  //  아래 3출 추가 버튼 토글
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }


  render() {
    // CSS class 는 React에서 className 으로 사용한다.
    // 그래서 CSS style 을 쉽게 변경할 수 있다. 목적) className='checked'
    // 여기 삭제 const taskClassName = this.props.task.checked ? 'checked' : '';

    // 여기 추가
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private,
      });

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input type="checkbox" readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        {/* 아래 코드 추가 = 버튼 기능  */}
        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
        {/* 여기까지  */}

        {/* text 앞에 username을 보여준다 */}
        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>


      </li>
    );
  }
}

Task.propTypes = {
  // Task compo 는 App 에서 상속 받은 task 를 사용한다.
  // propTypes 는 Data type(자료형)을 정의하는 용도로 사용한다.
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,  // 버튼 기능
};
