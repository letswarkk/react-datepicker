import React, { Component } from 'react'
import Calendar from './calendar'
import PropTypes from 'prop-types'
import TetherComponent from './tether_component'
import classnames from 'classnames'
import {
  getEffectiveMaxDate,
  getEffectiveMinDate,
  isDayDisabled,
  isDayInRange,
  isSameDay,
  parseDate,
  safeDateFormat
} from './date_utils'
import moment from 'moment'
import onClickOutside from 'react-onclickoutside'

const outsideClickIgnoreClass = 'react-datepicker-ignore-onclickoutside'
const WrappedCalendar = onClickOutside(Calendar)

/**
 * General datepicker component.
 */
class DatePicker extends Component {
  constructor (props) {
    super(props)
    this.state = this.calcInitialState()
  }

  componentWillUnmount () {
    this.clearPreventFocusTimeout()
  }

  calcInitialState () {
    const defaultPreSelection =
      this.props.openToDate ? moment(this.props.openToDate)
      : this.props.selectsEnd && this.props.startDate ? moment(this.props.startDate)
      : this.props.selectsStart && this.props.endDate ? moment(this.props.endDate)
      : moment()
    const minDate = getEffectiveMinDate(this.props)
    const maxDate = getEffectiveMaxDate(this.props)
    const boundedPreSelection =
      minDate && defaultPreSelection.isBefore(minDate) ? minDate
      : maxDate && defaultPreSelection.isAfter(maxDate) ? maxDate
      : defaultPreSelection

    return {
      open: false,
      preSelection: this.props.selected ? moment(this.props.selected) : boundedPreSelection,
      preventFocus: false
    }
  }

  cancelFocusInput () {
    clearTimeout(this.inputFocusTimeout)
    this.inputFocusTimeout = null
  }

  clearPreventFocusTimeout () {
    if (this.preventFocusTimeout) {
      clearTimeout(this.preventFocusTimeout)
    }
  }

  deferFocusInput () {
    this.cancelFocusInput()
    this.inputFocusTimeout = window.setTimeout(_ => this.setFocus(), 1)
  }

  handleBlur (event) {
    if (this.state.open) {
      this.deferFocusInput()
    }
    else {
      this.props.onBlur(event)
    }
  }

  handleCalendarClickOutside (event) {
    this.setOpen(false)
    this.props.onClickOutside(event)

    if (this.props.withPortal) {
      event.preventDefault()
    }
  }

  handleChange (event) {
    if (this.props.onChangeRaw) {
      this.props.onChangeRaw(event)

      if (event.isDefaultPrevented()) {
        return
      }
    }

    this.setState({ inputValue: event.target.value })

    const date = parseDate(event.target.value, this.props)

    if (date || !event.target.value) {
      this.setSelected(date, event, true)
    }
  }

  handleDropdownFocus () {
    this.cancelFocusInput()
  }

  handleFocus (event) {
    if (!this.state.preventFocus) {
      this.props.onFocus(event)
      this.setOpen(true)
    }
  }

  handleSelect (date, event) {
    // Preventing onFocus event to fix issue
    // https://github.com/Hacker0x01/react-datepicker/issues/628
    this.setState({ preventFocus: true }, _ => {
      this.preventFocusTimeout = setTimeout(() => this.setState({ preventFocus: false }), 50)
      return this.preventFocusTimeout
    })

    this.setSelected(date, event)

    if (this.props.selectMultiple !== true) {
      this.setOpen(false)
    }
  }

  onClearClick (event) {
    event.preventDefault()
    this.props.onChange(null, event)
  }

  onInputClick () {
    if (!this.props.disabled) {
      this.setOpen(true)
    }
  }

  onInputKeyDown (event) {
    if (!this.state.open && !this.props.inline) {
      this.onInputClick()
      return
    }

    const copy = moment(this.state.preSelection)

    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleSelect(copy, event)
    }
    else if (event.key === 'Escape') {
      event.preventDefault()
      this.setOpen(false)
    }
    else if (event.key === 'Tab') {
      this.setOpen(false)
    }

    if (!this.props.disabledKeyboardNavigation) {
      let newSelection

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          newSelection = copy.add(1, 'weeks')
          break

        case 'ArrowLeft':
          event.preventDefault()
          newSelection = copy.subtract(1, 'days')
          break

        case 'ArrowRight':
          event.preventDefault()
          newSelection = copy.add(1, 'days')
          break

        case 'ArrowUp':
          event.preventDefault()
          newSelection = copy.subtract(1, 'weeks')
          break

        case 'End':
          event.preventDefault()
          newSelection = copy.add(1, 'years')
          break

        case 'Home':
          event.preventDefault()
          newSelection = copy.subtract(1, 'years')
          break

        case 'PageDown':
          event.preventDefault()
          newSelection = copy.add(1, 'months')
          break

        case 'PageUp':
          event.preventDefault()
          newSelection = copy.subtract(1, 'months')
          break
      }

      this.setPreSelection(newSelection)
    }
  }

  renderCalendar () {
    if (!this.props.inline && (!this.state.open || this.props.disabled)) {
      return null
    }

    return (
      <WrappedCalendar className={this.props.calendarClassName}
        dateFormat={this.props.dateFormatCalendar}
        dropdownMode={this.props.dropdownMode}
        endDate={this.props.endDate}
        excludeDates={this.props.excludeDates}
        filterDate={this.props.filterDate}
        fixedHeight={this.props.fixedHeight}
        forceShowMonthNavigation={this.props.forceShowMonthNavigation}
        highlightDates={this.props.highlightDates}
        includeDates={this.props.includeDates}
        inline={this.props.inline}
        locale={this.props.locale}
        maxDate={this.props.maxDate}
        minDate={this.props.minDate}
        monthsShown={this.props.monthsShown}
        onClickOutside={this.handleCalendarClickOutside}
        onDropdownFocus={this.handleDropdownFocus}
        onMonthChange={this.props.onMonthChange}
        onSelect={this.handleSelect}
        openToDate={this.props.openToDate}
        outsideClickIgnoreClass={outsideClickIgnoreClass}
        peekNextMonth={this.props.peekNextMonth}
        preSelection={this.state.preSelection}
        ref="calendar"
        scrollableYearDropdown={this.props.scrollableYearDropdown}
        selected={this.props.selected}
        selectsEnd={this.props.selectsEnd}
        selectsStart={this.props.selectsStart}
        showMonthDropdown={this.props.showMonthDropdown}
        showWeekNumbers={this.props.showWeekNumbers}
        showYearDropdown={this.props.showYearDropdown}
        startDate={this.props.startDate}
        todayButton={this.props.todayButton}
        utcOffset={this.props.utcOffset}>
        {this.props.children}
      </WrappedCalendar>
    )
  }

  renderClearButton () {
    if (this.props.isClearable && this.props.selected != null) {
      return <a className="react-datepicker__close-icon" href="#" onClick={this.onClearClick} />
    }
    else {
      return null
    }
  }

  renderDateInput () {
    const className = classnames(this.props.className, {
      [outsideClickIgnoreClass]: this.state.open
    })

    const customInput = this.props.customInput || <input type="text" />
    const inputValue =
      typeof this.props.value === 'string' ? this.props.value
        : typeof this.state.inputValue === 'string' ? this.state.inputValue
        : safeDateFormat(this.props.selected, this.props)

    return React.cloneElement(customInput, {
      autoComplete: this.props.autoComplete,
      autoFocus: this.props.autoFocus,
      className,
      disabled: this.props.disabled,
      id: this.props.id,
      name: this.props.name,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onClick: this.onInputClick,
      onFocus: this.handleFocus,
      onKeyDown: this.onInputKeyDown,
      placeholder: this.props.placeholderText,
      readOnly: this.props.readOnly,
      ref: 'input',
      required: this.props.required,
      tabIndex: this.props.tabIndex,
      title: this.props.title,
      value: inputValue
    })
  }

  setFocus () {
    this.refs.input.focus()
  }

  setOpen (open) {
    this.setState({
      open: open,
      preSelection: open && this.state.open ? this.state.preSelection : this.calcInitialState().preSelection
    })
  }

  setPreSelection (date) {
    const isDateRangePresent = ((typeof this.props.minDate !== 'undefined') && (typeof this.props.maxDate !== 'undefined'))
    const isValidDateSelection = isDateRangePresent && date ? isDayInRange(date, this.props.minDate, this.props.maxDate) : true

    if (isValidDateSelection) {
      this.setState({ preSelection: date })
    }
  }

  setSelected (date, event, keepInput) {
    let changedDate = date

    if (changedDate !== null && isDayDisabled(changedDate, this.props)) {
      return
    }

    if (!isSameDay(this.props.selected, changedDate)) {
      if (changedDate !== null) {
        if (this.props.selected) {
          changedDate = moment(changedDate).set({
            hour: this.props.selected.hour(),
            minute: this.props.selected.minute(),
            second: this.props.selected.second()
          })
        }

        this.setState({ preSelection: changedDate })
      }

      this.props.onChange(changedDate, event)
    }

    this.props.onSelect(changedDate, event)

    if (!keepInput) {
      this.setState({ inputValue: null })
    }
  }

  render () {
    const calendar = this.renderCalendar()

    if (this.props.inline && !this.props.withPortal) {
      return calendar
    }

    if (this.props.withPortal) {
      return (
        <div>
          {
          !this.props.inline
          ? <div className="react-datepicker__input-container">
              {this.renderDateInput()}
              {this.renderClearButton()}
            </div>
          : null
          }

          {
          this.state.open || this.props.inline
          ? <div className="react-datepicker__portal">
              {calendar}
            </div>
          : null
          }
        </div>
      )
    }

    return (
      <TetherComponent attachment={this.props.popoverAttachment}
        classPrefix={'react-datepicker__tether'}
        constraints={this.props.tetherConstraints}
        renderElementTo={this.props.renderCalendarTo}
        targetAttachment={this.props.popoverTargetAttachment}
        targetOffset={this.props.popoverTargetOffset}>
        <div className="react-datepicker__input-container">
          {this.renderDateInput()}
          {this.renderClearButton()}
        </div>
        {calendar}
      </TetherComponent>
    )
  }
}

DatePicker.defaultProps = {
  dateFormat: 'L',
  dateFormatCalendar: 'MMMM YYYY',
  disabled: false,
  disabledKeyboardNavigation: false,
  dropdownMode: 'scroll',
  monthsShown: 1,
  onBlur: _ => {},
  onChange: _ => {},
  onFocus: _ => {},
  onSelect: _ => {},
  onClickOutside: _ => {},
  onMonthChange: _ => {},
  popoverAttachment: 'top left',
  popoverTargetAttachment: 'bottom left',
  popoverTargetOffset: '10px 0',
  selectMultiple: false,
  tetherConstraints: [{
    attachment: 'together',
    to: 'window'
  }],
  utcOffset: moment().utcOffset(),
  withPortal: false
}

DatePicker.propTypes = {
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  calendarClassName: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  customInput: PropTypes.element,
  dateFormat: PropTypes.oneOfType([ // eslint-disable-line react/no-unused-prop-types
    PropTypes.string,
    PropTypes.array
  ]),
  dateFormatCalendar: PropTypes.string,
  disabled: PropTypes.bool,
  disabledKeyboardNavigation: PropTypes.bool,
  dropdownMode: PropTypes.oneOf(['scroll', 'select']).isRequired,
  endDate: PropTypes.object,
  excludeDates: PropTypes.array,
  filterDate: PropTypes.func,
  fixedHeight: PropTypes.bool,
  highlightDates: PropTypes.array,
  id: PropTypes.string,
  includeDates: PropTypes.array,
  inline: PropTypes.bool,
  isClearable: PropTypes.bool,
  locale: PropTypes.string,
  maxDate: PropTypes.object,
  minDate: PropTypes.object,
  monthsShown: PropTypes.number,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onClickOutside: PropTypes.func,
  onChangeRaw: PropTypes.func,
  onFocus: PropTypes.func,
  onMonthChange: PropTypes.func,
  openToDate: PropTypes.object,
  peekNextMonth: PropTypes.bool,
  placeholderText: PropTypes.string,
  popoverAttachment: PropTypes.string,
  popoverTargetAttachment: PropTypes.string,
  popoverTargetOffset: PropTypes.string,
  readOnly: PropTypes.bool,
  renderCalendarTo: PropTypes.any,
  required: PropTypes.bool,
  scrollableYearDropdown: PropTypes.bool,
  selected: PropTypes.object,
  selectMultiple: PropTypes.bool,
  selectsEnd: PropTypes.bool,
  selectsStart: PropTypes.bool,
  showMonthDropdown: PropTypes.bool,
  showWeekNumbers: PropTypes.bool,
  showYearDropdown: PropTypes.bool,
  forceShowMonthNavigation: PropTypes.bool,
  startDate: PropTypes.object,
  tabIndex: PropTypes.number,
  tetherConstraints: PropTypes.array,
  title: PropTypes.string,
  todayButton: PropTypes.string,
  utcOffset: PropTypes.number,
  value: PropTypes.string,
  withPortal: PropTypes.bool
}

export default DatePicker
