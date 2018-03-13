import Popper, { Data, Modifiers, PopperOptions } from 'popper.js';


const modifiers: Modifiers = {
  shift: {},
  offset: {
    order: 0,
    offset: 'a string offset'
  },
  preventOverflow: {},
  keepTogether: {
    enabled: true
  },
  arrow: {
    fn(data, options) {
      return { ...data, flipped: false, ...options };
    }
  },
  flip: {
    behavior: 'flip'
  },
  inner: {
    enabled: false,
    order: 1
  },
  hide: {},
  applyStyle: {
    onLoad() {

    },
    gpuAcceleration: true
  },
  computeStyle: {
    gpuAcceleration: false,
    x: 'top',
    y: 'right'
  },
  otherModifier: {
    allowsAnyKey: null
  }
};
// Ensure backwards compatibility with < v1.14 typings, where all the types were part of the Popper namespace
const options: Popper.PopperOptions = {
  positionFixed: true,
  placement: 'auto-start',
  eventsEnabled: false,
  modifiers,
  removeOnDestroy: true,
  onCreate(data) {
    console.log(data);
  },
  onUpdate(data) {
    data.styles.alignContent = 'flex-start';
  }
};

Popper.modifiers.map(mod => mod.name);
Popper.placements.forEach(placement => placement.toLowerCase());
Popper.Defaults.onCreate = function (data: Data) {

};

const popper = new Popper(document.createElement('div'), document.createElement('span'));
const popperWithOptions = new Popper(document.createElement('div'), document.createElement('span'), options);

popper.options.positionFixed = false;
popper.destroy();
popper.update();
popper.scheduleUpdate();
popper.enableEventListeners();
popper.disableEventListeners();
