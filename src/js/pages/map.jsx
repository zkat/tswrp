import React from 'react'
import ReactFireMixin from 'reactfire'

export default React.createClass({
  mixins: [ReactFireMixin],
  componentDidMount () {
    this.setMapUrl(this.props.element)
  },
  componentWillReceiveProps (props) {
    this.setMapUrl(props.element)
  },
  setMapUrl (element) {
    let baseUrl = '5b1507cf5922f6b03de3d00d41394a81'
    let path = element ? '#tswrp/${element.id}' : ''
    this.props.mapIdBus.push(`${baseUrl}${path}`)
  },
  render () {
    return <div/>
  }
})
