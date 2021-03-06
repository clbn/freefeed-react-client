import React from 'react'
import {connect} from 'react-redux'
import {updateUser, userSettingsChange, updatePassword, updateUserPhoto} from '../redux/action-creators'
import UserSettingsForm from './user-settings-form'
import ChangePasswordForm from './change-password-form'
import UserPhotoForm from './user-photo-form'

const Settings = (props) => (
  <div className='content'>
    <div className='box'>
      <div className='box-header-timeline'>
        Settings
      </div>
      <div className='box-body'>
        <UserSettingsForm user={props.user} updateUser={props.updateUser} userSettingsChange={props.userSettingsChange} {...props.userSettingsForm}/>
        <hr/>
        <ChangePasswordForm {...props.passwordForm} updatePassword={props.updatePassword} />
        <hr/>
        <UserPhotoForm {...props.userPhotoForm} updateUserPhoto={props.updateUserPhoto}/>
        </div>
      </div>
  </div>
)

function mapStateToProps(state){
  return {
    user: state.user,
    userSettingsForm: state.userSettingsForm,
    passwordForm: state.passwordForm,
    userPhotoForm: state.userPhotoForm,
  }
}

function mapDispatchToProps(dispatch){
  return {
    updateUser: (...args) => dispatch(updateUser(...args)),
    userSettingsChange: (...args) => dispatch(userSettingsChange(...args)),
    updatePassword: (...args) => dispatch(updatePassword(...args)),
    updateUserPhoto: (...args) => dispatch(updateUserPhoto(...args)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
