import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Week from './week'

const FIXED_HEIGHT_STANDARD_WEEK_COUNT = 6

class Month extends Component {
  getClassNames() {
    const {
      selectingDate,
      selectsStart,
      selectsEnd
    } = this.props

    return classnames('react-datepicker__month', {
      'react-datepicker__month--selecting-range': selectingDate && (selectsStart || selectsEnd)
    })
  }

  handleDayClick(day, event) {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event)
    }
  }

  handleDayMouseEnter(day) {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day)
    }
  }

  handleMouseLeave() {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave()
    }
  }

  isWeekInMonth(startOfWeek) {
    const day = this.props.day
    const endOfWeek = startOfWeek.clone().add(6, 'days')
    return startOfWeek.isSame(day, 'month') || endOfWeek.isSame(day, 'month')
  }

  render() {
    return(
      <div className={this.getClassNames()} onMouseLeave={this.handleMouseLeave} role="listbox">
        {this.renderWeeks()}
      </div>
    )
  }

  renderWeeks() {
    const isFixedHeight = this.props.fixedHeight

    let breakAfterNextPush = false
    let currentWeekStart = this.props.day.clone().startOf('month').startOf('week')
    let i = 0
    let weeks = []

    while (true) {
      weeks.push(<Week day={currentWeekStart}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        filterDate={this.props.filterDate}
        highlightDates={this.props.highlightDates}
        includeDates={this.props.includeDates}
        inline={this.props.inline}
        key={i}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        month={this.props.day.month()}
        onDayClick={this.handleDayClick}
        onDayMouseEnter={this.handleDayMouseEnter}
        preSelection={this.props.preSelection}
        selectingDate={this.props.selectingDate}
        selected={this.props.selected}
        selectsEnd={this.props.selectsEnd}
        selectsStart={this.props.selectsStart}
        showWeekNumber={this.props.showWeekNumbers}
        startDate={this.props.startDate}
        utcOffset={this.props.utcOffset} />)

      if (breakAfterNextPush) break

      i += 1
      currentWeekStart = currentWeekStart.clone().add(1, 'weeks')

      // If one of these conditions is true, we will either break on this week
      // or break on the next week
      const isFixedAndFinalWeek = isFixedHeight && i >= FIXED_HEIGHT_STANDARD_WEEK_COUNT
      const isNonFixedAndOutOfMonth = !isFixedHeight && !this.isWeekInMonth(currentWeekStart)

      if (isFixedAndFinalWeek || isNonFixedAndOutOfMonth) {
        if (this.props.peekNextMonth) {
          breakAfterNextPush = true
        }
        else {
          break
        }
      }
    }

    return weeks
  }
}

Month.propTypes = {
  day: PropTypes.object.isRequired,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  fixedHeight: PropTypes.bool,
  highlightDates: PropTypes.array,
  includeDates: PropTypes.array,
  inline: PropTypes.bool,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  peekNextMonth: PropTypes.bool,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
}

export default Month