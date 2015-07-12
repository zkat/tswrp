import React from 'react'
import ReactFireMixin from 'reactfire'
import {Button, Input} from 'react-bootstrap'
import Select from 'react-select'
import _ from 'lodash'
import db from 'js/db'

export default React.createClass({
  mixins: [ReactFireMixin],
  getDefaultProps () {
    return {
      types: [
        'Relationship',
        'Relative',
        'Friend',
        'Rival',
        'Crush',
        'Professional',
        'Acquaintance'
      ]
    }
  },
  getInitialState () {
    return {connection: null}
  },
  componentDidMount () {
    this.bindAsArray(db.child('elements'), 'elements')
    this.setConnection(this.props.connId)
  },
  componentWillReceiveProps (props) {
    this.setConnection(props.connId)
  },
  setConnection (connId) {
    if (this.firebaseRefs.connection) { this.unbind('connection') }
    if (connId) {
      let ref = db.child('connections').child(connId)
      this.bindAsObject(ref, 'connection')
    } else {
      this.setState({connection: null})
    }
  },
  removeConn () {
    let conn = this.state.connection
    db.child('connections').child(conn.id).remove()
    db.child('elements')
      .child(conn.from)
      .child('connections')
      .child(conn.id)
      .remove()
  },
  possibleTags (type) {
    switch (type) {
      case 'relationship':
        return [
          'baby mama/papa',
          'beard/merkin',
          'dating',
          'fwb',
          'engaged',
          'ex',
          'intermittent',
          'open',
          'semi-open',
          'poly',
          'primary',
          'secondary',
          'satellite',
          'it\'s complicated'
        ]
      case 'professional':
        return [
          'employer/employee',
          'colleagues',
          'coerced service'
        ]
      case 'relative':
        return ['parent/child', 'siblings', 'cousins']
      case 'rival':
        return ['enemy', 'romantic', 'professional']
      case 'crush':
      case 'friend':
      case 'acquaintance':
      default:
        return []
    }
  },
  possibleDirections (type) {
    switch (type) {
      case 'relationship':
      case 'relative':
        return ['---']
      case 'rival':
        return ['-->']
      case 'professional':
        return ['---', '-->']
      case 'crush':
        return ['-->']
      case 'friend':
      case 'acquaintance':
      default:
        return ['---']
    }
  },
  render () {
    let {connection: conn, elements} = this.state
    if (!conn) { return <div>Pending...</div> }
    let typeOptions = _.map(this.props.types || [], t => ({
      value: t.toLowerCase(),
      label: t
    }))
    let directionOptions = _.map(this.possibleDirections(conn.type), d => ({
      value: d, label: d
    }))
    let toOptions = _.reduce(elements || [], (acc, el) => {
      if (el.id !== conn.from) {
        acc.push({
          value: el.id,
          label: `${el.displayName} @${el.username}`
        })
      }
      return acc
    }, [])
    let tagOptions = _.map(this.possibleTags(conn.type) || [], t => ({
      value: t, label: t
    }))
    let connRef = this.firebaseRefs.connection
    return (
      <div>
        <Select options={typeOptions}
                onChange={val => connRef.child('type').set(val)}
                value={conn.type} />
        <Select options={directionOptions}
                onChange={val => connRef.child('direction').set(val)}
                value={conn.direction} />
        <Select options={toOptions}
                onChange={val => connRef.child('to').set(val)}
                value={conn.to} />
        <Input type='textarea'
               label='Description'
               onChange={ev => connRef.child('description').set(ev.target.value)}
               value={conn.description} />
        <div className='form-group'>
          <label>Tags</label>
          <Select
            multi
            onChange={(val, tags) => connRef.child('tags').set(tags)}
            options={tagOptions}
            value={conn.tags || []} />
        </div>
        <Button bsStyle='danger'
                onClick={() => this.removeConn()}>
          Delete
        </Button>
      </div>
    )
  }
})
