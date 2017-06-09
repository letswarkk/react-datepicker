import React, { Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {
  isDayDisabled,
  isDayInRange,
  isSameDay
} from './date_utils'

class Day extends Component {
  constructor (props) {
    super(props)

    this.getClassNames = this.getClassNames.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.isDisabled = this.isDisabled.bind(this)
    this.isHighlighted = this.isHighlighted.bind(this)
    this.isInRange = this.isInRange.bind(this)
    this.isInSelectingRange = this.isInSelectingRange.bind(this)
    this.isKeyboardSelected = this.isKeyboardSelected.bind(this)
    this.isOutsideMonth = this.isOutsideMonth.bind(this)
    this.isRangeEnd = this.isRangeEnd.bind(this)
    this.isRangeStart = this.isRangeStart.bind(this)
    this.isSameDay = this.isSameDay.bind(this)
    this.isSelectingRangeEnd = this.isSelectingRangeEnd.bind(this)
    this.isSelectingRangeStart = this.isSelectingRangeStart.bind(this)
    this.isWeekend = this.isWeekend.bind(this)
  }

  getClassNames () {
    return classnames('react-datepicker__day', {
      'react-datepicker__day--disabled': this.isDisabled(),
      'react-datepicker__day--selected': this.isSameDay(this.props.selected),
      'react-datepicker__day--keyboard-selected': this.isKeyboardSelected(),
      'react-datepicker__day--highlighted': this.isHighlighted(),
      'react-datepicker__day--range-start': this.isRangeStart(),
      'react-datepicker__day--range-end': this.isRangeEnd(),
      'react-datepicker__day--in-range': this.isInRange(),
      'react-datepicker__day--in-selecting-range': this.isInSelectingRange(),
      'react-datepicker__day--selecting-range-start': this.isSelectingRangeStart(),
      'react-datepicker__day--selecting-range-end': this.isSelectingRangeEnd(),
      'react-datepicker__day--today': this.isSameDay(moment.utc().utcOffset(this.props.utcOffset)),
      'react-datepicker__day--weekend': this.isWeekend(),
      'react-datepicker__day--outside-month': this.isOutsideMonth()
    })
  }

  handleClick (event) {
    if (!this.isDisabled() && this.props.onClick) {
      this.props.onClick(event)
    }
  }

  handleMouseEnter (event) {
    if (!this.isDisabled() && this.props.onMouseEnter) {
      this.props.onMouseEnter(event)
    }
  }

  isDisabled () {
    return isDayDisabled(this.props.day, this.props)
  }

  isHighlighted () {
    const {
      day,
      highlightDates
    } = this.props

    if (!highlightDates) {
      return false
    }

    return highlightDates.some(testDay => isSameDay(day, testDay))
  }

  isInRange () {
    const {
      day,
      endDate,
      startDate
    } = this.props

    if (!startDate || !endDate) {
      return false
    }

    return isDayInRange(day, startDate, endDate)
  }

  isInSelectingRange () {
    const {
      day,
      endDate,
      selectingDate,
      selectsEnd,
      selectsStart,
      startDate
    } = this.props

    if (!(selectsStart || selectsEnd) || !selectingDate || this.isDisabled()) {
      return false
    }

    if (selectsStart && endDate && selectingDate.isSameOrBefore(endDate)) {
      return isDayInRange(day, selectingDate, endDate)
    }

    if (selectsEnd && startDate && selectingDate.isSameOrAfter(startDate)) {
      return isDayInRange(day, startDate, selectingDate)
    }

    return false
  }

  isKeyboardSelected () {
    return !this.props.inline && !this.isSameDay(this.props.selected) && this.isSameDay(this.props.preSelection)
  }

  isOutsideMonth () {
    return this.props.month !== undefined && this.props.month !== this.props.day.month()
  }

  isRangeEnd () {
    const {
      day,
      endDate,
      startDate
    } = this.props

    if (!startDate || !endDate) {
      return false
    }

    return isSameDay(endDate, day)
  }

  isRangeStart () {
    const {
      day,
      endDate,
      startDate
    } = this.props

    if (!startDate || !endDate) {
      return false
    }

    return isSameDay(startDate, day)
  }

  isSameDay (other) {
    return isSameDay(this.props.day, other)
  }

  isSelectingRangeEnd () {
    if (!this.isInSelectingRange()) {
      return false
    }

    const {
      day,
      endDate,
      selectingDate,
      selectsEnd
    } = this.props

    return isSameDay(day, selectsEnd ? selectingDate : endDate)
  }

  isSelectingRangeStart () {
    if (!this.isInSelectingRange()) {
      return false
    }

    const {
      day,
      selectingDate,
      selectsStart,
      startDate
    } = this.props

    return isSameDay(day, selectsStart ? selectingDate : startDate)
  }

  isWeekend () {
    const weekday = this.props.day.day()
    return weekday === 0 || weekday === 6
  }

  render () {
    return (
      <div aria-label={`day-${this.props.day.date()}`}
        className={this.getClassNames()}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        role="option">
        {this.props.day.date()}
      </div>
    )
  }
}

Day.defaultProps = {
  utcOffset: moment.utc().utcOffset()
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  endDate: PropTypes.object,
  highlightDates: PropTypes.array,
  inline: PropTypes.bool,
  month: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
}

export default Day
