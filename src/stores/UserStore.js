import { observable, action } from 'mobx'
import agent from '@/Agent'

class UserStore {
  @observable
  currentUser = null
  @observable
  loadingUser = false
  @observable
  updatingUser = false
  @observable
  updatingUserErrors = null

  @action
  pullUser() {
    this.loadingUser = true
    //return agent.Auth.current()
    return Promise.resolve({ name: 'Consolidate me with the Profile Store' })
      .then(
        action(({ user }) => {
          this.currentUser = { username: 'AUserName' }
          this.loadingUser = false
        })
      )
      .finally(
        action(() => {
          this.loadingUser = false
        })
      )
  }

  @action
  updateUser(newUser) {
    this.updatingUser = true
    return agent.Auth.save(newUser)
      .then(
        action(({ user }) => {
          this.currentUser = user
          this.updatingUser = false
        })
      )
      .finally(
        action(() => {
          this.updatingUser = false
        })
      )
  }

  @action
  forgetUser() {
    this.currentUser = null
    this.updatingUserErrors = null
  }
}

export default new UserStore()
