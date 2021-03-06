import {
  pointTypeToPretext,
  PointKind,
  pointKindToTypeMap,
  EditablePoint
} from '../constants';
import {setFirstCharToUpperCase} from './../utils/general';
import {formatDateToString} from '../utils/date';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import './../../node_modules/flatpickr/dist/flatpickr.min.css';

const ButtonText = {
  SAVE: `Save`,
  SAVING: `Saving...`,
  DELETE: `Delete`,
  DELETING: `Deleting...`,
  CANCEL: `Cancel`,
};

const getOffersForCurrentPointType = (offers, pointType) => {
  const currentOffer = offers.find((offer) => offer.type === pointType);

  return currentOffer
    ? currentOffer.offers.map((offer) =>
      Object.assign(
          {},
          offer
      ))
    : [];
};

const defineTextForDeleteButton = (pointData, editablePoint) => {
  if (editablePoint === EditablePoint.NEW) {
    return ButtonText.CANCEL;
  }
  if (pointData.isDeleting) {
    return ButtonText.DELETING;
  }
  return ButtonText.DELETE;
};

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

const createOfferContainerTemplate = (pointData, offers) => {
  return (
    `<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">

      ${createOfferListTemplate(pointData, offers)}

      </div>
    </section>
  </section>`
  );
};

const createOfferListTemplate = (pointData, offers) => {
  return (
    offers.map((offer, index) => {
      return (`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${index}-1" type="checkbox" data-title="${offer.title}" data-price="${offer.price}" name="event-offer-${index}" ${offer.checked ? `checked` : ``} ${pointData.isDisabled ? `disabled` : ``}>
        <label class="event__offer-label" for="event-offer-${index}-1">
          <span class="event__offer-title">${offer.title}</span>
          +
          €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`);
    }).join(``)
  );
};

const createFavoriteButtonTemplate = (pointData, editablePoint) => {
  if (editablePoint === EditablePoint.OLD) {
    return (
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${pointData.isFavorite ? `checked` : ``} ${pointData.isDisabled ? `disabled` : ``}></input>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </label>`);
  }

  return ``;
};

const createRollupButtonTemplate = (pointData, editablePoint) => {
  if (editablePoint === EditablePoint.OLD) {
    return (
      `<button class="event__rollup-btn" type="button" ${pointData.isDisabled ? `disabled` : ``}>
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  }

  return ``;
};

const createPointFormTemplate = (pointData, destinations, offers, editablePoint) => {
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
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${pointData.isDisabled ? `disabled` : ``}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${createEventListTemplate(pointData, pointKindToTypeMap[PointKind.TRANSFER])}

            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              ${createEventListTemplate(pointData, pointKindToTypeMap[PointKind.ACTIVITY])}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointTypeToPretext[pointData.type]}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointData.destination.name}" list="destination-list-1" ${pointData.isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-1">
            ${optionsListTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateToString(pointData.startTime)}" ${pointData.isDisabled ? `disabled` : ``}>
          —
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateToString(pointData.endTime)}" ${pointData.isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${pointData.price}" ${pointData.isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${pointData.isDisabled ? `disabled` : ``}>${pointData.isSaving ? ButtonText.SAVING : ButtonText.SAVE}</button>
        <button class="event__reset-btn" type="reset" ${pointData.isDisabled ? `disabled` : ``}>${defineTextForDeleteButton(pointData, editablePoint)}</button>

        ${createFavoriteButtonTemplate(pointData, editablePoint)}
        ${createRollupButtonTemplate(pointData, editablePoint)}
      </header>

      ${offers.length > 0 ? createOfferContainerTemplate(pointData, offers) : ``}

      ${pointData.destination.photos.length > 0 ? createPhotoContainerTemplate(pointData) : ``}

    </form>
    </li>`
  );
};

export default class PointEdit extends SmartView {
  constructor(point, destinations, offers, editablePoint) {
    super();
    this._startDatePicker = null;
    this._endDatePicker = null;

    this._data = PointEdit.parsePointToData(point);
    this._destinations = destinations;
    this._offers = offers;
    this._editablePoint = editablePoint;

    this._currentOffers = [];

    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteCheckboxChangeHandler = this._favoriteCheckboxChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._typeListChangeHandler = this._typeListChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._resetButtonClickHandler = this._resetButtonClickHandler.bind(this);
    this._offerListChangeHandler = this._offerListChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);

    this._currentOffers = getOffersForCurrentPointType(this._offers, this._data.type);

    this._setOfferListState();

    this._setInnerHandlers();
    this._setDatePicker();
    this._validateFields();
  }


  /* -------------------------------- Setters ------------------------------- */

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    if (this._editablePoint === EditablePoint.OLD) {
      this.getElement()
        .querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, this._rollupButtonClickHandler);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
      .addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteChange = callback;
  }

  setResetButtonClickHandler(callback) {
    this._callback.resetButtonClick = callback;
  }

  /* -------------------------- Overloaded methods -------------------------- */

  _getTemplate() {
    return createPointFormTemplate(this._data, this._destinations, this._currentOffers, this._editablePoint);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this._validateFields();

    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  removeElement() {
    super.removeElement();

    this._destroyDatePickerIfNeeded();
  }

  /* ----------------------------- Class methods ---------------------------- */

  reset(point) {
    this.updateData(
        PointEdit.parsePointToData(point)
    );
  }


  /* ---------------------------- Private methods --------------------------- */

  _setInnerHandlers() {
    const element = this.getElement();
    const price = element.querySelector(`.event__input--price`);
    const destination = element.querySelector(`.event__input--destination`);
    const offersList = element.querySelector(`.event__available-offers`);

    if (this._editablePoint === EditablePoint.OLD) {
      element.querySelector(`.event__favorite-checkbox`)
        .addEventListener(`change`, this._favoriteCheckboxChangeHandler);
    }

    price.addEventListener(`change`, this._priceChangeHandler);
    price.addEventListener(`input`, this._priceInputHandler);
    destination.addEventListener(`change`, this._destinationChangeHandler);
    destination.addEventListener(`input`, this._destinationInputHandler);
    element.querySelector(`.event__type-list`)
      .addEventListener(`change`, this._typeListChangeHandler);
    element.querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._resetButtonClickHandler);
    if (offersList !== null) {
      offersList.addEventListener(`change`, this._offerListChangeHandler);
    }
  }

  _destroyDatePickerIfNeeded() {
    if (this._startDatePicker !== null) {
      this._startDatePicker.destroy();
      this._startDatePicker = null;
    }
    if (this._endDatePicker !== null) {
      this._endDatePicker.destroy();
      this._endDatePicker = null;
    }
  }

  _setDatePicker() {
    this._destroyDatePickerIfNeeded();

    this._startDatePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          'enableTime': true,
          'time_24hr': true,
          'dateFormat': `d/m/y H:i`,
          'defaultDate': this._data.startTime || new Date(),
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
          'onChange': this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler([userDate]) {
    this.updateData({
      startTime: userDate
    }, true);
    this._validateFields();
  }

  _endDateChangeHandler([userDate]) {
    this.updateData({
      endTime: userDate
    }, true);
    this._validateFields();
  }

  _setOfferListState() {
    this._data.offers.forEach((offer) => {
      const currentOffer = this._currentOffers.find((current) =>
        offer.title === current.title && offer.price === current.price
      );

      if (currentOffer !== undefined) {
        currentOffer.checked = true;
      } else {
        this._currentOffers.push(offer);
      }
    });
  }

  _getOfferListState() {
    this._currentOffers = [];
    const checkedOffers = [];
    const offerCheckBoxes = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offerCheckBoxes.forEach((offer) => {
      this._currentOffers.push({
        title: offer.dataset.title,
        price: offer.dataset.price,
        checked: offer.checked
      });

      if (offer.checked) {
        checkedOffers.push({
          title: offer.dataset.title,
          price: Number(offer.dataset.price)
        });
      }
    });

    return checkedOffers;
  }

  _validateFields() {
    const element = this.getElement();
    const destination = element.querySelector(`.event__input--destination`).value;
    const price = element.querySelector(`.event__input--price`).valueAsNumber;
    const saveButton = element.querySelector(`.event__save-btn`);

    // save button must be disabled if 'destination' empty, or not in list;
    // or price = 0; and if not isDisabled - need remove disable status bcs it's
    // maybe our last change state for Save button
    if (
      !this._destinations.some((item) => item.name === destination)
      || price === 0
      || isNaN(price)
      || this._data.startTime > this._data.endTime) {
      saveButton.disabled = true;
      return;
    }

    if (!this._data.isDisabled) {
      saveButton.disabled = false;
    }
  }


  /* ---------------------------- Events handlers --------------------------- */

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _rollupButtonClickHandler() {
    this._callback.rollupButtonClick();
  }

  _favoriteCheckboxChangeHandler() {
    this.updateData({
      isFavorite: !this._data.isFavorite
    }, true);

    // Для новой точки вызывать обработчик не будем
    if (typeof this._callback.favoriteChange === `function`) {
      this._callback.favoriteChange(this._data.isFavorite);
    }
  }

  _typeListChangeHandler(evt) {
    this._currentOffers = getOffersForCurrentPointType(this._offers, evt.target.value);

    this.updateData({
      type: evt.target.value,
    });
  }

  _destinationChangeHandler(evt) {
    const destination = this._destinations.find((item) => item.name === evt.target.value);
    if (destination === undefined) {
      evt.target.value = this._data.destination.name;
      this._validateFields();
      return;
    }

    this.updateData({
      destination
    });
  }

  _destinationInputHandler() {
    this._validateFields();
  }

  _priceChangeHandler(evt) {
    this.updateData({
      price: evt.target.valueAsNumber,
    }, true);
  }

  _priceInputHandler() {
    this._validateFields();
  }

  _resetButtonClickHandler() {
    this._callback.resetButtonClick();
  }

  _offerListChangeHandler() {
    this._data.offers = this._getOfferListState();

    this.updateData({
      offers: this._data.offers,
    });
  }


  /* ---------------------------- Static methods ---------------------------- */

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        }
    );
  }

  static parseDataToPoint(pointData) {
    delete pointData.isDisabled;
    delete pointData.isSaving;
    delete pointData.isDeleting;

    return Object.assign(
        {},
        pointData
    );
  }
}
