import React from 'react'
import UserName from './user-name'
import {Link} from 'react-router'
import {fromNowOrNow} from '../utils'

const renderRecentGroup = recentGroup => {
  const updatedAgo = fromNowOrNow(parseInt(recentGroup.updatedAt))
  return (
    <li className="p-my-groups-link">
      <Link to={`/${recentGroup.username}`}>{recentGroup.screenName}</Link>
      <div className="updated-ago">{updatedAgo}</div>
    </li>
  )
}

export default props => {
  const recentGroups = props.recentGroups.map(renderRecentGroup)

  return (
    <ul className="p-my-groups">
      {recentGroups}
    </ul>
  )
}
