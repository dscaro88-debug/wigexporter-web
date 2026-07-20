const builder = document.querySelector('[data-spec-builder]');

if (builder) {
  const selections = {};
  const productCode = builder.dataset.productCode;
  const enquiryLink = builder.querySelector('[data-spec-enquiry]');

  const updateEnquiry = () => {
    const params = new URLSearchParams({ product: productCode, ...selections });
    enquiryLink.href = `contact.html?${params.toString()}`;
  };

  builder.querySelectorAll('[data-spec-field]').forEach((field) => {
    const key = field.dataset.specField;
    const summary = builder.querySelector(`[data-summary="${key}"]`);
    const selected = field.querySelector('.spec-option.is-selected');
    if (selected) selections[key] = selected.dataset.value;

    field.querySelectorAll('.spec-option').forEach((option) => {
      option.addEventListener('click', () => {
        field.querySelectorAll('.spec-option').forEach((item) => {
          item.classList.remove('is-selected');
          item.setAttribute('aria-pressed', 'false');
        });
        option.classList.add('is-selected');
        option.setAttribute('aria-pressed', 'true');
        selections[key] = option.dataset.value;
        summary.textContent = option.dataset.value;
        summary.dataset.status = option.dataset.status;
        updateEnquiry();
      });
    });
  });

  const colourSummary = builder.querySelector('[data-summary="colour"]');
  builder.querySelectorAll('.colour-card').forEach((card) => {
    card.addEventListener('click', () => {
      builder.querySelectorAll('.colour-card').forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('is-selected');
      card.setAttribute('aria-pressed', 'true');
      selections.colour = `${card.dataset.colourCode} · ${card.dataset.colourName}`;
      colourSummary.textContent = selections.colour;
      updateEnquiry();
    });
  });

  builder.querySelectorAll('[data-colour-filter]').forEach((filter) => {
    filter.addEventListener('click', () => {
      const group = filter.dataset.colourFilter;
      builder.querySelectorAll('[data-colour-filter]').forEach((item) => {
        item.classList.toggle('is-active', item === filter);
        item.setAttribute('aria-pressed', String(item === filter));
      });
      builder.querySelectorAll('.colour-card').forEach((card) => {
        card.hidden = group !== 'all' && card.dataset.colourGroup !== group;
      });
    });
  });

  updateEnquiry();
}
