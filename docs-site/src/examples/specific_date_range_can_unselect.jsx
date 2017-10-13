import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

export default class SpecificDateRangeCanUnselect extends React.Component {
  state = {
    dates: []
  }

  render () {
    return <div className="row">
      <pre className="column example__code">
        <code className="jsx">
        {'<DatePicker'}<br />
<strong>{'  canUnselectOutOfRangeDates'}</strong><br />
        {'  selectMultiple'}<br />
        {'  selected={this.state.dates}'}<br />
        {'  onChange={this.handleChange}'}<br />
<strong>{'  minDate={moment()}'}</strong><br />
<strong>{'  maxDate={moment().add(5, "days")}'}</strong><br />
        {'  placeholderText="Select a date between today and 5 days in the future"'}<br />
        {'/>'}
        </code>
      </pre>
      <div className="column">
        <DatePicker
          canUnselectOutOfRangeDates
          maxDate={moment().add(5, 'days')}
          minDate={moment()}
          onChange={this.handleChange}
          placeholderText="Select a date between today and 5 days in the future"
          selected={this.state.dates}
          selectMultiple />
      </div>
    </div>
  }
}
