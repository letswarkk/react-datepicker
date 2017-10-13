import React, { Component } from 'react'
import PropTypes from 'prop-types'

class WeekNumber extends Component {
  render() {
    return (
      <div aria-label={`week-${this.props.weekNumber}`}
        className="react-datepicker__week-number">
        {this.props.weekNumber}
      </div>
    )
  }
}

WeekNumber.propTypes = {
  weekNumber: PropTypes.number.isRequired
}

export default WeekNumber
