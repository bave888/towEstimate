// Roadside Estimator Widget JavaScript

const PRICING = {
  jumpStart: 110,
  fuelDelivery: 110,
  lockout: 145,
  tireChange: 145,
  tireChangeSuv: 175,
  towingBase: 225,
  towingBaseMiles: 5,
  towingPerMile: 7,
  winchingPerHour: 280,
  afterHoursFee: 75,
  afterHoursStart: 20, // 8 PM in 24-hour format
};

const DOM = {
  form: document.getElementById('estimateForm'),
  serviceType: document.getElementById('serviceType'),
  vehicleType: document.getElementById('vehicleType'),
  vehicleTypeWrap: document.getElementById('vehicleTypeWrap'),
  towMiles: document.getElementById('towMiles'),
  towMilesWrap: document.getElementById('towMilesWrap'),
  distanceStatus: document.getElementById('distanceStatus'),
  winchHours: document.getElementById('winchHours'),
  winchHoursWrap: document.getElementById('winchHoursWrap'),
  afterHours: document.getElementById('afterHours'),
  afterHoursWrap: document.getElementById('afterHoursWrap'),
  serviceQuotePreview: document.getElementById('serviceQuotePreview'),
  serviceAreaDisclaimer: document.getElementById('serviceAreaDisclaimer'),
  pickupLocation: document.getElementById('pickupLocation'),
  pickupSuggestions: document.getElementById('pickupSuggestions'),
  pickupSuggestionStatus: document.getElementById('pickupSuggestionStatus'),
  useGps: document.getElementById('useGps'),
  gpsStatus: document.getElementById('gpsStatus'),
  dropoffLocation: document.getElementById('dropoffLocation'),
  dropoffSuggestions: document.getElementById('dropoffSuggestions'),
  dropoffWrap: document.getElementById('dropoffWrap'),
  dropoffSuggestionStatus: document.getElementById('dropoffSuggestionStatus'),
};

// Initialize event listeners
function init() {
  DOM.serviceType.addEventListener('change', handleServiceChange);
  DOM.vehicleType.addEventListener('change', updatePrice);
  DOM.towMiles.addEventListener('input', handleTowMilesInput);
  DOM.winchHours.addEventListener('input', updatePrice);
  DOM.afterHours.addEventListener('change', updatePrice);
  DOM.useGps.addEventListener('click', handleGpsClick);
  DOM.form.addEventListener('submit', handleSubmit);

  // Initialize visibility
  handleServiceChange();
  updatePrice();
}

// Show/hide fields based on service type
function handleServiceChange() {
  const service = DOM.serviceType.value;

  DOM.vehicleTypeWrap.classList.toggle('is-hidden', service !== 'tireChange');
  DOM.towMilesWrap.classList.toggle('is-hidden', service !== 'towing');
  DOM.winchHoursWrap.classList.toggle('is-hidden', service !== 'winching');
  DOM.afterHoursWrap.classList.toggle('is-hidden', service !== 'towing' && service !== 'winching');
  DOM.dropoffWrap.classList.toggle('is-hidden', service !== 'towing');
  DOM.serviceAreaDisclaimer.classList.toggle('is-hidden', service === 'towing' || service === 'winching');

  // Reset values
  if (service !== 'tireChange') DOM.vehicleType.value = 'car';
  if (service !== 'towing') DOM.towMiles.value = '';
  if (service !== 'winching') DOM.winchHours.value = '1';
  if (service !== 'towing' && service !== 'winching') DOM.afterHours.checked = false;

  updatePrice();
}

// Handle tow miles input
function handleTowMilesInput() {
  let value = parseFloat(DOM.towMiles.value) || 0;

  if (!Number.isInteger(value) && value > 0) {
    value = Math.ceil(value);
    DOM.towMiles.value = value;
    DOM.distanceStatus.textContent = `Rounded up to ${value} miles.`;
  } else {
    DOM.distanceStatus.textContent = '';
  }

  updatePrice();
}

// Calculate and update price
function updatePrice() {
  const service = DOM.serviceType.value;
  let price = 0;

  switch (service) {
    case 'jumpStart':
      price = PRICING.jumpStart;
      break;
    case 'fuelDelivery':
      price = PRICING.fuelDelivery;
      break;
    case 'lockout':
      price = PRICING.lockout;
      break;
    case 'tireChange':
      price = DOM.vehicleType.value === 'suvTruck' ? PRICING.tireChangeSuv : PRICING.tireChange;
      break;
    case 'towing':
      price = calculateTowingPrice();
      break;
    case 'winching':
      price = calculateWinchingPrice();
      break;
  }

  DOM.serviceQuotePreview.textContent = `$${price}`;
}

// Calculate towing price
function calculateTowingPrice() {
  let price = PRICING.towingBase;
  const miles = Math.max(0, parseInt(DOM.towMiles.value) || 0);

  if (miles > PRICING.towingBaseMiles) {
    price += (miles - PRICING.towingBaseMiles) * PRICING.towingPerMile;
  }

  if (DOM.afterHours.checked) {
    price += PRICING.afterHoursFee;
  }

  return price;
}

// Calculate winching price
function calculateWinchingPrice() {
  let price = (parseFloat(DOM.winchHours.value) || 1) * PRICING.winchingPerHour;

  if (DOM.afterHours.checked) {
    price += PRICING.afterHoursFee;
  }

  return Math.round(price);
}

// Handle GPS button click
function handleGpsClick(e) {
  e.preventDefault();

  if (!navigator.geolocation) {
    DOM.gpsStatus.textContent = 'Geolocation is not supported by your browser.';
    return;
  }

  DOM.gpsStatus.textContent = 'Getting your location...';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      DOM.pickupLocation.value = `${lat}, ${lng}`;
      DOM.gpsStatus.textContent = 'Location set. Please confirm or refine the address.';
    },
    () => {
      DOM.gpsStatus.textContent = 'Unable to retrieve your location. Please enter it manually.';
    }
  );
}

// Handle form submission
function handleSubmit(e) {
  e.preventDefault();

  const formData = {
    serviceType: DOM.serviceType.value,
    vehicleType: DOM.vehicleType.value || null,
    towMiles: DOM.towMiles.value ? parseInt(DOM.towMiles.value) : null,
    winchHours: DOM.winchHours.value ? parseFloat(DOM.winchHours.value) : null,
    afterHours: DOM.afterHours.checked,
    pickupLocation: DOM.pickupLocation.value,
    dropoffLocation: DOM.dropoffLocation.value || null,
    quotedPrice: DOM.serviceQuotePreview.textContent,
    timestamp: new Date().toISOString(),
  };

  console.log('Estimate Request:', formData);
  alert('Thank you! Your estimate request has been submitted.');

  // TODO: Connect to booking system, email service, SMS service, CRM, or backend
}

// Start the widget
init();
