// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let domains;

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
    const container = domains.querySelector('.results');

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
    const container = domains.querySelector('.results');

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
    const dlCity = displayOptionalElement(city, 'Borg');
    const dlPostalCode = displayOptionalElement(postalCode, 'Póstnúmer');
    const dlCountry = displayOptionalElement(country, 'Land');
    const dlPhone = displayOptionalElement(phone, 'Símanúmer');
    const dlEmail = displayOptionalElement(email, 'Netfang');
    const dlRegisterd = displayElement(ISORegistered, 'Skráð');
    const dlExpires = displayElement(ISOExpires, 'Rennur út');
    const dlLastChange = displayElement(ISOLastChange, 'Seinast breytt');

    const container = domains.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(dlDomain);

    if (dlRegistrantname != null) {
      container.appendChild(dlRegistrantname);
    }
    if (dlAddress != null) {
      container.appendChild(dlAddress);
    }
    if (dlCity != null) {
      container.appendChild(dlCity);
    }
    if (dlPostalCode != null) {
      container.appendChild(dlPostalCode);
    }
    if (dlCountry != null) {
      container.appendChild(dlCountry);
    }
    if (dlPhone != null) {
      container.appendChild(dlPhone);
    }
    if (dlEmail != null) {
      container.appendChild(dlEmail);
    }
    container.appendChild(dlRegisterd);
    container.appendChild(dlExpires);
    container.appendChild(dlLastChange);
  }

  function fetchData(domain) {
    displayLoading();
    fetch(`${API_URL}${domain}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa við að sækja gögn');
      })
      .then((data) => {
        displayDomain(data.results);
      })
      .catch((error) => {
        if (domain.length === 0) {
          displayError('Lén verður að vera strengur');
          console.error(error);
        }
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const input = e.target.querySelector('input');

    fetchData(input.value);
  }

  function init(_domains) {
    domains = _domains;

    const form = domains.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
