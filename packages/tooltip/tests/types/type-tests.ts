import Tooltip, { TitleFunction , Options as TooltipOptions, Delay} from 'tooltip.js';

const titlefn: TitleFunction = () => 'asdf';

const delay :Delay= {
  show: 5,
  hide: 10
};

const options: TooltipOptions = {
  container: 'container',
  delay,
  html: true,
  placement: 'top',
  template: 'I am the template',
  title: titlefn(),
  trigger: 'any string is valid here',
  boundariesElement: 'scrollParent',
  offset: 'any string is valid here',
  popperOptions: {
    positionFixed: false
  }
};

const tooltip = new Tooltip(document.createElement('div'), options);

tooltip.show();
tooltip.hide();
tooltip.dispose();
tooltip.toggle();
console.log(tooltip._isOpen);
