import { observable, action } from 'mobx'
import agent from '@/Agent'

class IntroScreenStore {
  @observable
  content = {}
  @observable
  secondaryContent = {}
  @observable
  introScreenIsLoading = false

  @action
  loadData() {
    this.introScreenIsLoading = true
    return agent.IntroScreen.get()
      .then(
        action(({ data }) => {
          this.content = data.content
          this.secondaryContent = data.secondaryContent
          this.introScreenIsLoading = false
        })
      )
      .finally(
        action(() => {
          this.introScreenIsLoading = false
        })
      )
  }
}

export default new IntroScreenStore()
