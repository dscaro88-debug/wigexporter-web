const studio = document.querySelector('[data-colour-packaging-studio]');

if (studio) {
  const selections = {
    colour: '',
    packaging: '',
    logo_treatment: ''
  };
  const enquiry = studio.querySelector('[data-studio-enquiry]');
  const liveColour = studio.querySelector('[data-live-colour]');
  const status = studio.querySelector('[data-brief-status]');

  const updateBrief = () => {
    Object.entries(selections).forEach(([key, value]) => {
      const summary = studio.querySelector(`[data-summary="${key}"]`);
      if (summary) summary.textContent = value || 'Not selected';
    });

    if (liveColour) liveColour.textContent = selections.colour || 'None yet';
    const selectedCount = Object.values(selections).filter(Boolean).length;
    if (status) {
      status.textContent =
        selectedCount === 3
          ? 'Your colour and packaging directions are ready to carry into the enquiry.'
          : `${selectedCount} of 3 directions selected. You can still send a general project brief.`;
    }

    const params = new URLSearchParams({ project: 'Colour and Packaging Studio' });
    Object.entries(selections).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (enquiry) enquiry.href = `contact.html?${params.toString()}`;
  };

  const selectButton = (button, key, value) => {
    studio.querySelectorAll(`[data-choice-group="${key}"]`).forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    selections[key] = value;
    updateBrief();
  };

  studio.querySelectorAll('.studio-colour-card').forEach((card) => {
    card.addEventListener('click', () => {
      studio.querySelectorAll('.studio-colour-card').forEach((item) => {
        const selected = item === card;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      selections.colour = `${card.dataset.colourCode} · ${card.dataset.colourName}`;
      updateBrief();
    });
  });

  studio.querySelectorAll('[data-choice-group]').forEach((button) => {
    button.addEventListener('click', () => {
      selectButton(button, button.dataset.choiceGroup, button.dataset.choiceValue);
    });
  });

  studio.querySelectorAll('[data-colour-filter]').forEach((filter) => {
    filter.addEventListener('click', () => {
      const group = filter.dataset.colourFilter;
      studio.querySelectorAll('[data-colour-filter]').forEach((item) => {
        const selected = item === filter;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      studio.querySelectorAll('.studio-colour-card').forEach((card) => {
        card.hidden = group !== 'all' && card.dataset.colourGroup !== group;
      });
    });
  });

  studio.querySelector('[data-clear-brief]')?.addEventListener('click', () => {
    Object.keys(selections).forEach((key) => {
      selections[key] = '';
    });
    studio.querySelectorAll('.studio-colour-card, [data-choice-group]').forEach((item) => {
      item.classList.remove('is-selected');
      item.setAttribute('aria-pressed', 'false');
    });
    updateBrief();
  });

  updateBrief();
}
