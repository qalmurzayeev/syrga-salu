(() => {
  const eventDate = document.querySelector('#event-date');
  const dateTime = eventDate?.dateTime;
  const eventTime = Date.parse(dateTime);
  if (!Number.isFinite(eventTime)) return;

  const formatNumber = (number) => String(number).padStart(2, '0');
  const [year, month, eventDay] = dateTime.slice(0, 10).split('-').map(Number);
  const monthNames = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
  const monthName = monthNames[month - 1];
  document.querySelector('#card-date').textContent = `${formatNumber(eventDay)}/${formatNumber(month)}/${year}`;
  document.querySelector('#event-day').textContent = `${eventDay} ${monthName} ${year} жыл`;
  document.querySelector('#event-clock').textContent = `Сағат ${dateTime.slice(11, 16)}`;

  const countdown = document.querySelector('#countdown');
  if (countdown) {
    const units = [
      { name: 'days', seconds: 86_400 },
      { name: 'hours', seconds: 3_600 },
      { name: 'minutes', seconds: 60 },
      { name: 'seconds', seconds: 1 },
    ].map((unit) => ({
      ...unit,
      element: countdown.querySelector(`[data-countdown="${unit.name}"]`),
    }));

    function updateCountdown() {
      let secondsRemaining = Math.max(0, Math.ceil((eventTime - Date.now()) / 1_000));
      const hasTimeRemaining = secondsRemaining > 0;

      for (const unit of units) {
        const amount = Math.floor(secondsRemaining / unit.seconds);
        if (unit.element) unit.element.textContent = formatNumber(amount);
        secondsRemaining %= unit.seconds;
      }

      return hasTimeRemaining;
    }

    if (updateCountdown()) {
      const interval = window.setInterval(() => {
        if (!updateCountdown()) window.clearInterval(interval);
      }, 1_000);
    }
  }

  const calendar = document.querySelector('#calendar-days');
  if (!calendar) return;

  calendar.parentElement.setAttribute('aria-label', `${monthName} ${year}`);
  const firstDayOfWeek = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const weekCount = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

  for (let week = 0; week < weekCount; week++) {
    const row = document.createElement('div');
    row.setAttribute('role', 'row');

    for (let weekday = 0; weekday < 7; weekday++) {
      const day = week * 7 + weekday + 1 - firstDayOfWeek;
      const cell = document.createElement('div');
      cell.setAttribute('role', 'cell');

      if (day >= 1 && day <= daysInMonth) {
        const label = `${day} ${monthName} ${year} жыл`;
        if (day === eventDay) {
          const marker = document.createElement('span');
          marker.className = 'calendar-mark';
          marker.textContent = formatNumber(day);
          cell.append(marker);
          cell.setAttribute('aria-label', `${label}, рәсім күні`);
        } else {
          cell.textContent = formatNumber(day);
          cell.setAttribute('aria-label', label);
        }
      }

      row.append(cell);
    }

    calendar.append(row);
  }
})();
