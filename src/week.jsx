import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Day from './day'
import WeekNumber from './week_number'

class Week extends Component {
  constructor (props) {
    super(props)

    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this)
  }

  handleDayClick (day, event) {
    if (this.props.onDayClick) {
      this.props.onDayClick(day, event)
    }
  }

  handleDayMouseEnter (day) {
    if (this.props.onDayMouseEnter) {
      this.props.onDayMouseEnter(day)
    }
  }

  renderDays () {
    const startOfWeek = this.props.day.clone().startOf('week')
    let days = []

    if (this.props.showWeekNumber) {
      days.push(<WeekNumber key="W" weekNumber={parseInt(startOfWeek.format('w'), 10)} />)
    }

    return days.concat([0, 1, 2, 3, 4, 5, 6].map(offset => {
      const day = startOfWeek.clone().add(offset, 'days')
      return (
        <Day day={day}
          endDate={this.props.endDate}
          excludeDates={this.props.excludeDates}
          filterDate={this.props.filterDate}
          highlightDates={this.props.highlightDates}
          includeDates={this.props.includeDates}
          inline={this.props.inline}
          key={offset}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          month={this.props.month}
          onClick={e => this.handleDayClick(day, e)}
          onMouseEnter={e => this.handleDayMouseEnter(day, e)}
          preSelection={this.props.preSelection}
          selected={this.props.selected}
          selectingDate={this.props.selectingDate}
          selectsEnd={this.props.selectsEnd}
          selectsStart={this.props.selectsStart}
          startDate={this.props.startDate}
          utcOffset={this.props.utcOffset} />
      )
    }))
  }

  render () {
    return (
      <div className="react-datepicker__week">
        {this.renderDays()}
      </div>
    )
  }
}

Week.propTypes = {
  day: PropTypes.object.isRequired,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  highlightDates: PropTypes.array,
  includeDates: PropTypes.array,
  inline: PropTypes.bool,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  month: PropTypes.number,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  preSelection: PropTypes.object,
  selected: PropTypes.object,
  selectingDate: PropTypes.object,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showWeekNumber: PropTypes.bool,
  startDate: PropTypes.object,
  utcOffset: PropTypes.number
}

export default Week
