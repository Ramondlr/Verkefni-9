// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';
const domains = document.querySelector('.domains');

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  const container = domains.querySelector('.results');

  function elements(name, child) {
    const el = document.createElement(name);

    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object') {
      el.appendChild(child);
    }
    return el;
  }

  function displayLoading() {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const loading = elements('div');
    loading.classList.add('loading');

    const img = elements('img');
    img.setAttribute('src', 'loading.gif');

    loading.appendChild(img);
    loading.appendChild(document.createTextNode('Leita að léni...'));
    container.appendChild(loading);
  }

  function displayElement(element, text) {
    const dl = document.createElement('dl');

    const domainElement = document.createElement('dt');
    domainElement.appendChild(document.createTextNode(text));
    dl.appendChild(domainElement);

    const domainValue = document.createElement('dd');

    domainValue.appendChild(document.createTextNode(element));
    dl.appendChild(domainValue);

    return dl;
  }

  function displayOptionalElement(element, text) {
    if (element.length > 0) {
      const dl = document.createElement('dl');

      const domainElement = document.createElement('dt');
      domainElement.appendChild(document.createTextNode(text));
      dl.appendChild(domainElement);

      const domainValue = document.createElement('dd');

      domainValue.appendChild(document.createTextNode(element));
      dl.appendChild(domainValue);

      return dl;
    }
    return null;
  }

  function displayError(error) {
    const container = domains.querySelector('.results'); /* eslint-disable-line */

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }

  function displayDomain(thisDomain) {
    if (thisDomain.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }

    const [{
      domain, registrantname, address, city, postalCode, country,
      phone, email, registered, expires, lastChange,
    }] = thisDomain;

    const dayRegistered = new Date(registered);
    const ISORegistered = dayRegistered.toISOString().substring(0, 10);
    const dayLastChange = new Date(lastChange);
    const ISOLastChange = dayLastChange.toISOString().substring(0, 10);
    const dayExpires = new Date(expires);
    const ISOExpires = dayExpires.toISOString().substring(0, 10);

    const dlDomain = displayElement(domain, 'Lén');
    const dlRegistrantname = displayOptionalElement(registrantname, 'Skráningaraðili');
    const dlAddress = displayOptionalElement(address, 'Heimilisfang');
    const dlCity = displayOptionalElement(city, 'Borg'); /* eslint-disable-line */
    const dlPostalCode = displayOptionalElement(postalCode, 'Póstnúmer'); /* eslint-disable-line */
    const dlCountry = displayOptionalElement(country, 'Land');
    const dlPhone = displayOptionalElement(phone, 'Símanúmer'); /* eslint-disable-line */
    const dlEmail = displayOptionalElement(email, 'Netfang');
    const dlRegisterd = displayElement(ISORegistered, 'Skráð');
    const dlExpires = displayElement(ISOExpires, 'Rennur út');
    const dlLastChange = displayElement(ISOLastChange, 'Seinast breytt');

    const container = domains.querySelector('.results'); /* eslint-disable-line */

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dlDomain);

    container.appendChild(dlRegisterd);
    container.appendChild(dlLastChange);
    container.appendChild(dlExpires);

    if (dlRegistrantname != null) {
      container.appendChild(dlRegistrantname);
    }
    if (dlEmail != null) {
      container.appendChild(dlEmail);
    }
    if (dlAddress != null) {
      container.appendChild(dlAddress);
    }
    if (dlCountry != null) {
      container.appendChild(dlCountry);
    }
  }

  function fetchData(domain) {
    displayLoading();
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        if (!response.ok) {
          return displayError('Villa við að sækja gögn');
        }
        return response.json();
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const input = document.querySelector('input').value;
    if (input.trim() === '') {
      displayError('Lén verður að vera strengur');
      document.querySelector('input').value = '';
      return;
    }
    fetchData(input);
  }

  function init(_domains) {
    _domains.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  program.init(domains);
});
