import React from 'react'

export default React.createClass({
  displayName: 'KumuEmbed',
  getDefaultProps () {
    return {
      selection: '',
      focus: '',
      footer: true
    }
  },
  render () {
    let url = `http://kumu.io/embed/${this.props.embedId}` +
      `?footer=${this.props.footer ? '1' : '0' }` +
      `&focus=${this.props.focus}`
    return <iframe {...this.props} src={url}></iframe>
  }
})
