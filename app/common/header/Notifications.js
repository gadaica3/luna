/**
* Notifications list component
**/

'use strict';

import React from 'react';
import NotificationItem from './NotificationItem';

export default class Notifications extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let notifications = this.props.notifications;
    if(!notifications.length) {
      return null;
    }
    return (
      <ul className="dropdown-list">
        {notifications.map((notification, idx) => {
          return <NotificationItem key={idx} notification={notification}/>
        })}
      </ul>
    )
  }
}
