import moment from 'moment'

export function isSameDay (moment1, moment2) {
  if (moment1 && moment2) {
    return moment1.isSame(moment2, 'day')
  }
  else {
    return !moment1 && !moment2
  }
}

export function isSameUtcOffset (moment1, moment2) {
  if (moment1 && moment2) {
    return moment1.utcOffset() === moment2.utcOffset()
  }
  else {
    return !moment1 && !moment2
  }
}

export function isDayInRange (day, startDate, endDate) {
  const before = startDate.clone().startOf('day').subtract(1, 'seconds')
  const after = endDate.clone().startOf('day').add(1, 'seconds')
  return day.clone().startOf('day').isBetween(before, after)
}

export function isDayDisabled (day, { canUnselectOutOfRangeDates, minDate, maxDate, excludeDates,
  includeDates, filterDate, selected } = {}) {
  if (canUnselectOutOfRangeDates) {
    if (Array.isArray(selected)) {
      for (let i = 0; i < selected.length; i++) {
        if (isSameDay(day, selected[i])) {
          return false
        }
      }
      return true
    }
    else if (typeof selected === 'object' && isSameDay(day, selected)) {
      return false
    }
  }

  return (minDate && day.isBefore(minDate, 'day')) ||
    (maxDate && day.isAfter(maxDate, 'day')) ||
    (excludeDates && excludeDates.some(excludeDate => isSameDay(day, excludeDate))) ||
    (includeDates && !includeDates.some(includeDate => isSameDay(day, includeDate))) ||
    (filterDate && !filterDate(day.clone())) ||
    false
}

export function allDaysDisabledBefore (day, unit, { canUnselectOutOfRangeDates, minDate, includeDates } = {}) {
  if (canUnselectOutOfRangeDates) return false
  const dateBefore = day.clone().subtract(1, unit)
  return (minDate && dateBefore.isBefore(minDate, unit)) ||
    (includeDates && includeDates.every(includeDate => dateBefore.isBefore(includeDate, unit))) ||
    false
}

export function allDaysDisabledAfter (day, unit, { canUnselectOutOfRangeDates, maxDate, includeDates } = {}) {
  if (canUnselectOutOfRangeDates) return false
  const dateAfter = day.clone().add(1, unit)
  return (maxDate && dateAfter.isAfter(maxDate, unit)) ||
    (includeDates && includeDates.every(includeDate => dateAfter.isAfter(includeDate, unit))) ||
    false
}

export function getEffectiveMinDate ({ minDate, includeDates }) {
  if (includeDates && minDate) {
    return moment.min(includeDates.filter(includeDate => minDate.isSameOrBefore(includeDate, 'day')))
  }
  else if (includeDates) {
    return moment.min(includeDates)
  }
  else {
    return minDate
  }
}

export function getEffectiveMaxDate ({ maxDate, includeDates }) {
  if (includeDates && maxDate) {
    return moment.max(includeDates.filter(includeDate => maxDate.isSameOrAfter(includeDate, 'day')))
  }
  else if (includeDates) {
    return moment.max(includeDates)
  }
  else {
    return maxDate
  }
}

export function parseDate (value, { dateFormat, locale }) {
  const m = moment(value, dateFormat, locale || moment.locale(), true)
  return m.isValid() ? m : null
}

export function safeDateFormat (date, { dateFormat, locale }) {
  return date && date.clone()
    .locale(locale || moment.locale())
    .format(Array.isArray(dateFormat) ? dateFormat[0] : dateFormat) || ''
}
