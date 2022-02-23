import { observable, action, computed } from 'mobx'
import agent from '@/Agent'

class ShareStatusStore {
  @observable
  shares = []
  @observable
  isLoading = false
  @observable
  invitees = []

  @action
  pullInvitees() {
    this.isLoading = true
    agent.Server.getInvitees()
      .then(
        action(data => {
          console.log(JSON.stringify(data))
          this.invitees = data
        })
      )
      .catch(err => {
        console.log('PLAYALONG ERROR pullInvitees() =>', err)
      })
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @action
  shareViaEmail(params) {
    agent.Server.shareViaEmail(params)
  }

  @action
  pullData() {
    this.isLoading = true
    return new Promise(function(resolve, reject) {
      resolve({
        data: {
          shares: [
            {
              id: 1,
              name: 'NAME one',
              email: 'e-mail@offriend.com',
              played: true,
              shared: true,
              reminderSent: true,
            },
            {
              id: 2,
              name: 'NAME two',
              email: 'email@offriend.com',
              played: true,
              shared: false,
              reminderSent: true,
            },
            {
              id: 3,
              name: 'NAME three',
              email: 'e-mail@offriend.com',
              played: true,
              shared: true,
              reminderSent: true,
            },
            {
              id: 4,
              name: 'NAME four',
              email: 'e-mail@offriend.com',
              played: false,
              shared: false,
              reminderSent: true,
            },
            {
              id: 5,
              name: 'name five',
              email: 'e-mail@offriend.com',
              played: false,
              shared: false,
              reminderSent: false,
            },
          ],
        },
      })
    })
      .then(
        action(({ data }) => {
          this.shares = data.shares
        })
      )
      .finally(
        action(() => {
          this.isLoading = false
        })
      )
  }

  @computed
  get sharesList() {
    return this.shares
  }
}

export default new ShareStatusStore()
