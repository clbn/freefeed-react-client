import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import moment from 'moment'

import {fromNowOrNow} from '../utils'
import {showMoreComments} from '../redux/action-creators'
import PostComments from './post-comments'
import Linkify from'react-linkify'

const PostLikes = (props) => (<div/>)

const FeedPost = (props) => {
  const user = props.users[props.data.createdBy]
  const screenName = props.current_user.id === user.id ? 'You' : user.screenName

  const isDirect = false

  const createdAt = new Date(props.data.createdAt - 0)
  const createdAtISO = moment(createdAt).format()
  const createdAgo = fromNowOrNow(createdAt)

  const firstFeedName = user.username  // FIXME

  return (
    <div className='timeline-post-container'>
      <div className='avatar'>
        <Link to='timeline.index' params={{username: user.username}}>
          <img src={ user.profilePictureMediumUrl } />
        </Link>
      </div>
      <div className='post-body p-timeline-post'>
        <div className='title'>
          <Link to='timeline.index' params={{username: user.username}} className='post-author'>{screenName}</Link>
        </div>

        <div className='body'>
          <div className='text'>
            <Linkify>{props.data.body}</Linkify>
          </div>
        </div>

        <div className='info p-timeline-post-info'>
          {isDirect ? (<span>»</span>) : false}
          <span className='post-date'>
            <Link to='post' params={{username: firstFeedName, postId: props.data.id}} className='datetime'>
              <time dateTime={createdAtISO} title={createdAtISO}>{createdAgo}</time>
            </Link>
          </span>

          <span className='post-controls'>
          </span>

          <PostLikes/>
        </div>

        <PostComments post={props.data}
                      comments={props.comments}
                      showMoreComments={props.showMoreComments} />
      </div>
    </div>
  )
}


const HomeFeed = (props) => {
  const post_tags = props.home
  .map(id => props.posts[id])
  .map(post => {
    let comments = _.map(post.comments, commentId => {
      let comment = props.comments[commentId]
      comment.user = props.users[comment.createdBy]
      return comment
    })

    return (<FeedPost data={post}
                      key={post.id}
                      users={props.users}
                      comments={comments}
                      current_user={props.user}
                      authenticated={props.authenticated}
                      showMoreComments={props.showMoreComments}/>)
  })

  return (
    <div className='posts'>
      <p>submit-post</p>
      <p>pagination (if not first page)</p>
      <div className='posts'>
        {post_tags}
      </div>
      <p>hidden-posts</p>
      <p>pagination</p>
    </div>
  )
}

const HomeHandler = (props) => (
  <div className='box'>
    <div className='box-header-timeline'>
      Home
    </div>
    <div className='box-body'>
      {props.authenticated ? (<HomeFeed {...props}/>) : false}
    </div>
    <div className='box-footer'>
    </div>
  </div>
)

function selectState(state) {
  return state
}

function selectActions(dispatch) {
  return {
    showMoreComments: (postId) => dispatch(showMoreComments(postId))
  }
}

export default connect(selectState, selectActions)(HomeHandler)