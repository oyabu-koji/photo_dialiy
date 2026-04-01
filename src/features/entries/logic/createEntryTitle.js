function formatDatePart(value) {
  return String(value).padStart(2, '0');
}

export function formatEntryDateLabel(eventDate) {
  const date = new Date(eventDate);

  return [
    date.getFullYear(),
    formatDatePart(date.getMonth() + 1),
    formatDatePart(date.getDate()),
  ].join('/');
}

export function createEntryTitle({ placeName, eventDate }) {
  const dateLabel = formatEntryDateLabel(eventDate);

  if (placeName) {
    return `${placeName} ${dateLabel}`;
  }

  return dateLabel;
}
