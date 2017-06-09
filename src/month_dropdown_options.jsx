import React, { Component } from 'react'
import PropTypes from 'prop-types'

class MonthDropdownOptions extends Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  handleClickOutside () {
    return this.props.onCancel()
  }

  onChange (month) {
    return this.props.onChange(month)
  }

  renderOptions () {
    return this.props.monthNames.map((month, i) =>
      <div className="react-datepicker__month-option"
        key={month}
        onClick={_ => this.onChange(i)}
        ref={month}>
        {this.props.month === i ? <span className="react-datepicker__month-option--selected">✓</span> : ''}
        {month}
      </div>
    )
  }

  render () {
    return (
      <div className="react-datepicker__month-dropdown">
        {this.renderOptions()}
      </div>
    )
  }
}

MonthDropdownOptions.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  month: PropTypes.number.isRequired,
  monthNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}

export default MonthDropdownOptions
