import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MonthDropdownOptions from './month_dropdown_options'
import onClickOutside from 'react-onclickoutside'
import moment from 'moment'

const WrappedMonthDropdownOptions = onClickOutside(MonthDropdownOptions)

class MonthDropdown extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dropdownVisible: false
    }
  }

  onChange (month) {
    this.toggleDropdown()

    if (month !== this.props.month) {
      this.props.onChange(month)
    }
  }

  renderDropdown (monthNames) {
    return (
      <WrappedMonthDropdownOptions key="dropdown"
        month={this.props.month}
        monthNames={monthNames}
        onCancel={this.toggleDropdown}
        onChange={this.onChange}
        ref="options" />
    )
  }

  renderReadView (visible, monthNames) {
    return (
      <div key="read"
        style={{visibility: visible ? 'visible' : 'hidden'}}
        className="react-datepicker__month-read-view"
        onClick={this.toggleDropdown}>
        <span className="react-datepicker__month-read-view--selected-month">
          {monthNames[this.props.month]}
        </span>
        <span className="react-datepicker__month-read-view--down-arrow" />
      </div>
    )
  }

  renderScrollMode (monthNames) {
    const { dropdownVisible } = this.state

    let result = [this.renderReadView(!dropdownVisible, monthNames)]

    if (dropdownVisible) {
      result.unshift(this.renderDropdown(monthNames))
    }

    return result
  }

  renderSelectMode (monthNames) {
    return (
      <select value={this.props.month} className="react-datepicker__month-select" onChange={e => this.onChange(e.target.value)}>
        {this.renderSelectOptions(monthNames)}
      </select>
    )
  }

  renderSelectOptions (monthNames) {
    return monthNames.map((M, i) => <option key={i} value={i}>{M}</option>)
  }

  toggleDropdown () {
    this.setState({ dropdownVisible: !this.state.dropdownVisible })
  }

  render () {
    const localeData = moment.localeData(this.props.locale)
    const monthNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(M => localeData.months(moment({M}), this.props.dateFormat))

    let renderedDropdown

    switch (this.props.dropdownMode) {
      case 'scroll':
        renderedDropdown = this.renderScrollMode(monthNames)
        break
      case 'select':
        renderedDropdown = this.renderSelectMode(monthNames)
        break
    }

    return (
      <div className={`react-datepicker__month-dropdown-container react-datepicker__month-dropdown-container--${this.props.dropdownMode}`}>
        {renderedDropdown}
      </div>
    )
  }
}

MonthDropdown.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  dropdownMode: PropTypes.oneOf(['scroll', 'select']).isRequired,
  locale: PropTypes.string,
  month: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default MonthDropdown
