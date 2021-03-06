import {home, discussions, direct, getUserFeed, getUserComments, getUserLikes, getSinglePost} from './action-creators'

//query params are strings, so + hack to convert to number
const getOffset = nextRoute => +nextRoute.location.query.offset || 0

export const routeActions = {
  'home': next => home(getOffset(next)),
  'discussions': next => discussions(getOffset(next)),
  'userFeed': next => getUserFeed(next.params.userName, getOffset(next)),
  'userComments': next => getUserComments(next.params.userName, getOffset(next)),
  'userLikes': next => getUserLikes(next.params.userName, getOffset(next)),
  'post': next => getSinglePost(next.params.postId),
  'direct': next => direct(getOffset(next)),
}

export const bindRouteActions = dispatch => route => next => {
  return dispatch(routeActions[route](next))
}
