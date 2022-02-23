
class SponsorStore {

  sponsors = [
    {
      id: 1,
      name: 'sponsor platinum',
      initial: 'p',
      initialColor: '#383644',
      backgroundColor: '#b2cbce',
      circleBorderColor: '#91a5c1',
      circleFill: '#a3c2cc',
      count: 10,
      length: 5,
    },
    {
      id: 2,
      name: 'sponsor bronze',
      initial: 'b',
      initialColor: '#3f2919',
      backgroundColor: '#e2a069',
      circleBorderColor: '#7c4724',
      circleFill: '#af643e',
      count: 2,
      length: 7,
    },
    {
      id: 3,
      name: 'sponsor silver',
      initial: 's',
      initialColor: '#4c4c4c',
      backgroundColor: '#bababa',
      circleBorderColor: '#999999',
      circleFill: '#cecece',
      count: 5,
      length: 5,
    },
    {
      id: 4,
      name: 'sponsor gold',
      initial: 'g',
      initialColor: '#754b00',
      backgroundColor: '#ffde9c',
      circleBorderColor: '#f4a300',
      circleFill: '#ffda3e',
      count: 4,
      length: 5,
    },
  ]

}

module.exports = new SponsorStore()
