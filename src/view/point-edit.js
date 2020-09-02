import {
  pointTypeToPretext,
  GROUP_ACTIVITY_TYPES,
  GROUP_TRANSFER_TYPES,
  OfferList
} from '../constants';
import {setFirstCharToUpperCase} from './../utils/general';
import {dateToString} from '../utils/date';
import SmartView from "./smart";

import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEmptyPoint = () => ({
  type: ``,
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  startTime: new Date(),
  endTime: new Date(),
  offers: [],
  isFavorite: false,
  price: 0,
});

const isOfferCheckedForPoint = (offerName, offers) => offers.find((item) => item.type === offerName);

const createOptionsListTemplate = (destinations) => {
  return destinations
    .map(({name}) => `<option value="${name}"></option>`)
    .join(``);
};

const createPhotoContainerTemplate = (pointData) => {
  return (
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${pointData.destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">

        ${createPhotoListTemplate(pointData)}

      </div>
    </div>
  </section>`
  );
};

const createPhotoListTemplate = (pointData) =>
  pointData.destination.photos.map((photo) =>
    `<img class="event__photo" src="${photo.href}" alt="${photo.description}">`);


const createEventListTemplate = (pointData, pointTypes) => {
  return (
    pointTypes.map((pointType) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointData.type === pointType ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${setFirstCharToUpperCase(pointType)}</label>
        </div>`
      );
    }).join(``)
  );
};

const createOfferContainerTemplate = (pointData) => {
  return (
    `<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${createOfferListTemplate(pointData)}

      </div>
    </section>
  </section>`
  );
};

const createOfferListTemplate = (pointData) => {
  return (
    Object.entries(OfferList).map((key) => {
      return (`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key[0]}-1" type="checkbox" name="event-offer-${key[0]}" ${isOfferCheckedForPoint(key[0], pointData.offers) ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${key[0]}-1">
          <span class="event__offer-title">${key[1].text}</span>
          +
          €&nbsp;<span class="event__offer-price">${key[1].price}</span>
        </label>
      </div>`);
    }).join(``)
  );
};

const createPointFormTemplate = (pointData, destinations) => {
  const optionsListTemplate = createOptionsListTemplate(destinations);

  return (
    `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointData.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${createEventListTemplate(pointData, GROUP_ACTIVITY_TYPES)}

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              ${createEventListTemplate(pointData, GROUP_TRANSFER_TYPES)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointTypeToPretext[pointData.type]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointData.destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${optionsListTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateToString(pointData.startTime)}">
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToString(pointData.endTime)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${pointData.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${pointData.isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      ${pointData.offers.length > 0 ? createOfferContainerTemplate(pointData) : ``}

      ${pointData.destination.photos.length > 0 ? createPhotoContainerTemplate(pointData) : ``}

    </form>
    </li>`
  );
};

export default class PointEdit extends SmartView {
  constructor(point = createEmptyPoint(), destinations = []) {
    super();
    this._startDatePicker = null;
    this._endDatePicker = null;

    this._destinations = destinations;
    this._data = PointEdit.parsePointToData(point);

    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteCheckboxChangeHandler = this._favoriteCheckboxChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._typeListChangeHandler = this._typeListChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  reset(point) {
    this.updateData(
        PointEdit.parsePointToData(point)
    );
  }

  _getTemplate() {
    return createPointFormTemplate(this._data, this._destinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();

    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    const element = this.getElement();

    element.querySelector(`.event__favorite-checkbox`)
      .addEventListener(`change`, this._favoriteCheckboxChangeHandler);
    element.querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);
    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeListChangeHandler);
  }

  _setDatePicker() {
    if (this._startDatePicker !== null) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
    if (this._endDatePicker !== null) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }

    this._startDatePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.startTime || new Date(),
          'maxDate': this._data.endTime,
          'onChange': this._startDateChangeHandler
        }
    );

    this._endDatePicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.endTime || new Date(),
          'minDate': this._data.startTime,
          'onChange': this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      startTime: userDate
    }, true);
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endTime: userDate
    }, true);
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _favoriteCheckboxChangeHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);
    this._callback.favoriteChange(this._data.isFavorite);
  }

  _priceChangeHandler(evt) {
    this.updateData({
      price: evt.target.valueAsNumber,
    }, true);
  }

  _destinationChangeHandler(evt) {
    const destination = this._destinations.find((item) => item.name === evt.target.value);
    if (destination === undefined) {
      evt.target.value = this._data.destination.name;
      return;
    }

    this.updateData({
      destination
    });
  }

  _typeListChangeHandler(evt) {
    this.updateData({
      type: evt.target.value
    });
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._rollupButtonClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteChange = callback;
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point
    );
  }

  static parseDataToPoint(pointData) {
    return Object.assign(
        {},
        pointData
    );
  }
}
