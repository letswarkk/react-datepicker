import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const generateYears = (year, noOfYear) => {
  let list = []
  for (let i = 0; i < (2 * noOfYear); i++) {
    list.push(year + noOfYear - i)
  }
  return list
}

class YearDropdownOptions extends Component {
  constructor(props) {
    super(props)

    this.state = {
      yearsList: this.props.scrollableYearDropdown ? generateYears(this.props.year, 10) : generateYears(this.props.year, 5)
    }

    this.decrementYears = this.decrementYears.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
    this.incrementYears = this.incrementYears.bind(this)
    this.onChange = this.onChange.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.shiftYears = this.shiftYears.bind(this)
  }

  decrementYears() {
    return this.shiftYears(-1)
  }

  handleClickOutside() {
    this.props.onCancel()
  }

  incrementYears() {
    return this.shiftYears(1)
  }

  onChange(year) {
    this.props.onChange(year)
  }

  renderOptions() {
    const selectedYear = this.props.year

    let options = this.state.yearsList.map(year =>
      <div className="react-datepicker__year-option"
        key={year}
        ref={year}
        onClick={() => this.onChange(year)}>
        {selectedYear === year ? <span className="react-datepicker__year-option--selected">✓</span> : ''}
        {year}
      </div>
    )

    options.unshift(
      <div className="react-datepicker__year-option"
          ref={'upcoming'}
          key={'upcoming'}
          onClick={this.incrementYears}>
        <a className="react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-upcoming" />
      </div>
    )

    options.push(
      <div className="react-datepicker__year-option"
          ref={'previous'}
          key={'previous'}
          onClick={this.decrementYears}>
        <a className="react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-previous" />
      </div>
    )

    return options
  }

  shiftYears(amount) {
    const yearsList = this.state.yearsList.map(year => year + amount)
    this.setState({ yearsList })
  }

  render() {
    let dropdownClass = classNames({
      'react-datepicker__year-dropdown': true,
      'react-datepicker__year-dropdown--scrollable': this.props.scrollableYearDropdown
    })

    return (
      <div className={dropdownClass}>
        {this.renderOptions()}
      </div>
    )
  }
}

YearDropdownOptions.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  scrollableYearDropdown: PropTypes.bool,
  year: PropTypes.number.isRequired
}

export default YearDropdownOptions
