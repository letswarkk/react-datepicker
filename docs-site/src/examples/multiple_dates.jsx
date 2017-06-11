import React from 'react'
import DatePicker from 'react-datepicker'

export default class Default extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      dates: []
    }
  }

  render () {
    return (
      <div className="row">
        <pre className="column example__code">
          <code className="jsx">{`
<DatePicker
  selected={this.state.datesArray}
  selectMultiple={true}
  onChange={this.handleChange}
/>
`}
          </code>
        </pre>
        <div className="column">
          <DatePicker
            selected={this.state.dates}
            selectMultiple />
        </div>
      </div>
    )
  }
}
