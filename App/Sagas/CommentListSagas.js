import { call, put } from 'redux-saga/effects'
import CommentListActions from '../Redux/CommentListRedux'
import S3Api from '../Services/S3Api'
import { Actions as NavigationActions } from 'react-native-router-flux'

import * as mime from 'react-native-mime-types'

// attempts to login
export function * sendComment (api, { breakoutSessionId, comment }) {
  // yield put (CommentListActions.getComments(breakoutSessionId));
  console.log('SAGA: sending comment', breakoutSessionId, comment);
  if (comment === '') {

  } else {
    const response = yield call(api.sendComment, breakoutSessionId, comment);
    console.log(response);
    if (response.ok) {
      console.log('send comment success');
      yield put(CommentListActions.getComments(breakoutSessionId));
    } else {
      console.log('error');
      yield put(CommentListActions.sendCommentFailure('error'));
    }
  }
}

export function * getComments (api, { breakoutSessionId }) {
  console.log('SAGA: getComments', breakoutSessionId);

  const response = yield call(api.getComments, breakoutSessionId);
  if (response.ok) {
    yield put(CommentListActions.getCommentsSuccess(response.data.comments));
  } else {

  }
}

const getFilename = (path) => {
  let splitFilenameArray = path.split('/');
  return splitFilenameArray[splitFilenameArray.length - 1];
}

export function * sendCommentWithImage (api, { breakoutSessionId, imagePath }) {
  // get S3 credentials
  const contentType = mime.lookup(imagePath);
  const filename = getFilename(imagePath);

  let response = yield call(api.getAwsCredentials, filename, contentType);
  if (response.ok) {
    console.log('get credentials ok', response.data)
    const { credentials } = response.data;
    const s3api = S3Api.create(credentials.endpoint);
    response = yield call(s3api.storeImageToS3, credentials, filename, contentType, imagePath);

    if (response.ok) {
      console.log('store image success', response)
      response = yield call(api.createCommentWithImage, breakoutSessionId, credentials.key);
      if (response.ok) {
        NavigationActions.pop();
        yield put(CommentListActions.getComments(breakoutSessionId));
      }
    }
  }

  if (!response.ok) {
    yield put(CommentListActions.sendCommentFailure('error'));
  }
}

// export function * loginSuccess (api, { uid, client, accessToken, expiry }) {
//   yield call(api.saveCredentials, accessToken, uid, client, expiry);
// }
