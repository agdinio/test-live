import { observable, action } from 'mobx'
import { TimelineMax } from 'gsap'

class LowerPanelStore {
  @observable
  Panel = Object.freeze({
    first: 'first',
    second: 'second',
    third: 'third',
  })
  @observable
  Selector = Object.freeze({
    first: 'firstSelector',
    second: 'secondSelector',
    third: 'thirdSelector',
  })

  @observable
  active = this.Panel.second
  @observable
  activeSelector = this.Selector.second

  @observable
  ref

  @observable
  selection

  @observable
  isAnimation = false

  @action
  setRef(ref) {
    this.ref = ref
  }

  @action
  changeSlides(container, { target }) {
    let active = target.find({ name: this.active })
    let selection = target.find({ name: this.selection })

    let activeSelector = target.find({ name: this.activeSelector })
    let selectionSelector = target.find({ name: this.selectionSelector })
    return new TimelineMax({ repeat: 0 })
      .to(active, 0.5, { opacity: 0 })
      .to(activeSelector, 0, { 'background-color': 'grey' }, 0)
      .to(selection, 0.5, { opacity: 1 })
      .to(selectionSelector, 0, { 'background-color': 'white' }, 0)
      .add(() => {
        this.active = this.selection
        this.isAnimation = false
        this.activeSelector = this.selection + 'Selector'
      })
  }

  @action
  handleClick = param => {
    if (this.active !== param && !this.isAnimation && this.ref) {
      this.selection = param
      this.isAnimation = true
      this.selectionSelector = param + 'Selector'
      this.ref.addAnimation(this.changeSlides.bind(this, this.ref))
    }
  }
}

export default new LowerPanelStore()
