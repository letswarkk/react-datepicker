import React, { Component } from 'react'
import PropTypes from 'prop-types'
import YearDropdownOptions from './year_dropdown_options'
import onClickOutside from 'react-onclickoutside'

const WrappedYearDropdownOptions = onClickOutside(YearDropdownOptions)

class YearDropdown extends Component {
  constructor (props) {
    super(props)

    this.state = {
      dropdownVisible: false
    }
  }

  onChange (year) {
    this.toggleDropdown()
    if (year === this.props.year) return
    this.props.onChange(year)
  }

  onSelectChange (event) {
    this.onChange(event.target.value)
  }

  renderDropdown () {
    return (
      <WrappedYearDropdownOptions key="dropdown"
        onCancel={this.toggleDropdown}
        onChange={this.onChange}
        ref="options"
        scrollableYearDropdown={this.props.scrollableYearDropdown}
        year={this.props.year} />
    )
  }

  renderReadView (visible) {
    return (
      <div key="read" style={{visibility: visible ? 'visible' : 'hidden'}} className="react-datepicker__year-read-view" onClick={this.toggleDropdown}>
        <span className="react-datepicker__year-read-view--down-arrow" />
        <span className="react-datepicker__year-read-view--selected-year">{this.props.year}</span>
      </div>
    )
  }

  renderScrollMode () {
    const { dropdownVisible } = this.state
    let result = [this.renderReadView(!dropdownVisible)]
    if (dropdownVisible) {
      result.unshift(this.renderDropdown())
    }
    return result
  }

  renderSelectMode () {
    return (
      <select className="react-datepicker__year-select"
        onChange={this.onSelectChange}
        value={this.props.year}>
        {this.renderSelectOptions()}
      </select>
    )
  }

  renderSelectOptions () {
    const minYear = this.props.minDate ? this.props.minDate.year() : 1900
    const maxYear = this.props.maxDate ? this.props.maxDate.year() : 2100

    let options = []
    for (let i = minYear; i <= maxYear; i++) {
      options.push(<option key={i} value={i}>{i}</option>)
    }
    return options
  }

  toggleDropdown () {
    this.setState({ dropdownVisible: !this.state.dropdownVisible })
  }

  render () {
    let renderedDropdown

    switch (this.props.dropdownMode) {
      case 'scroll':
        renderedDropdown = this.renderScrollMode()
        break

      case 'select':
        renderedDropdown = this.renderSelectMode()
        break
    }

    return (
      <div className={`react-datepicker__year-dropdown-container react-datepicker__year-dropdown-container--${this.props.dropdownMode}`}>
        {renderedDropdown}
      </div>
    )
  }
}

YearDropdown.propTypes = {
  dropdownMode: PropTypes.oneOf(['scroll', 'select']).isRequired,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  scrollableYearDropdown: PropTypes.bool,
  year: PropTypes.number.isRequired
}

export default YearDropdown
