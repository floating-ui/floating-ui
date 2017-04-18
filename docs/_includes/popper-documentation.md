## Classes

<dl>
<dt><a href="#Popper">Popper</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#dataObject">dataObject</a></dt>
<dd><p>The <code>dataObject</code> is an object containing all the informations used by Popper.js
this object get passed to modifiers and to the <code>onCreate</code> and <code>onUpdate</code> callbacks.</p>
</dd>
<dt><a href="#referenceObject">referenceObject</a></dt>
<dd><p>The <code>referenceObject</code> is an object that provides an interface compatible with Popper.js
and lets you use it as replacement of a real DOM node.
You can use this method to position a popper relatively to a set of coordinates
in case you don&#39;t have a DOM node to use as reference.
NB: This feature isn&#39;t supported in Internet Explorer 10</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#modifiers">modifiers</a> : <code>object</code></dt>
<dd><p>Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 9 modifiers to provide all the basic functionalities
needed by the library.</p>
<p>Usually you don&#39;t want to override the <code>order</code>, <code>function</code> and <code>onLoad</code> props.
All the other properties are configurations that could be tweaked.</p>
</dd>
<dt><a href="#defaults">defaults</a> : <code>object</code></dt>
<dd><p>Default options provided to Popper.js constructor.
These can be overriden using the <code>options</code> argument of Popper.js.
To override an option, simply pass as 3rd argument an object with the same
structure of {defaults}, example:</p>
<pre><code>new Popper(ref, pop, {
  modifiers: {
    preventOverflow: { enabled: false }
  }
})
</code></pre></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#onCreateCallback">onCreateCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#onUpdateCallback">onUpdateCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="Popper"></a>

## Popper
**Kind**: global class  

* [Popper](#Popper)
    * [new Popper(reference, popper, options)](#new_Popper_new)
    * _instance_
        * [.update()](#Popper+update)
        * [.destroy()](#Popper+destroy)
        * [.enableEventListeners()](#Popper+enableEventListeners)
        * [.disableEventListeners()](#Popper+disableEventListeners)
    * _static_
        * [.scheduleUpdate()](#Popper.scheduleUpdate)

<a name="new_Popper_new"></a>

### new Popper(reference, popper, options)
Create a new Popper.js instance

**Returns**: <code>Object</code> - instance - The generated Popper.js instance  

| Param | Type | Description |
| --- | --- | --- |
| reference | <code>HTMLElement</code> \| <code>[referenceObject](#referenceObject)</code> | The reference element used to position the popper |
| popper | <code>HTMLElement</code> | The HTML element used as popper. |
| options | <code>Object</code> | Your custom options to override the ones defined in [DEFAULTS](#defaults) |

<a name="Popper+update"></a>

### popper.update()
Updates the position of the popper, computing the new offsets and applying the new style
Prefer `scheduleUpdate` over `update` because of performance reasons

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+destroy"></a>

### popper.destroy()
Destroy the popper

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+enableEventListeners"></a>

### popper.enableEventListeners()
it will add resize/scroll events and start recalculating
position of the popper element when they are triggered

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper+disableEventListeners"></a>

### popper.disableEventListeners()
it will remove resize/scroll events and won't recalculate
popper position when they are triggered. It also won't trigger onUpdate callback anymore,
unless you call 'update' method manually.

**Kind**: instance method of <code>[Popper](#Popper)</code>  
<a name="Popper.scheduleUpdate"></a>

### Popper.scheduleUpdate()
Schedule an update, it will run on the next UI update available

**Kind**: static method of <code>[Popper](#Popper)</code>  
<a name="dataObject"></a>

## dataObject
The `dataObject` is an object containing all the informations used by Popper.js
this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.

**Kind**: global variable  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data.instance | <code>Object</code> | The Popper.js instance |
| data.placement | <code>String</code> | Placement applied to popper |
| data.originalPlacement | <code>String</code> | Placement originally defined on init |
| data.flipped | <code>Boolean</code> | True if popper has been flipped by flip modifier |
| data.hide | <code>Boolean</code> | True if the reference element is out of boundaries, useful to know when to hide the popper. |
| data.arrowElement | <code>HTMLElement</code> | Node used as arrow by arrow modifier |
| data.styles | <code>Object</code> | Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`) |
| data.boundaries | <code>Object</code> | Offsets of the popper boundaries |
| data.offsets | <code>Object</code> | The measurements of popper, reference and arrow elements. |
| data.offsets.popper | <code>Object</code> | `top`, `left`, `width`, `height` values |
| data.offsets.reference | <code>Object</code> | `top`, `left`, `width`, `height` values |
| data.offsets.arro | <code>Object</code> | `top` and `left` offsets, only one of them will be different from 0 |

<a name="referenceObject"></a>

## referenceObject
The `referenceObject` is an object that provides an interface compatible with Popper.js
and lets you use it as replacement of a real DOM node.
You can use this method to position a popper relatively to a set of coordinates
in case you don't have a DOM node to use as reference.
NB: This feature isn't supported in Internet Explorer 10

**Kind**: global variable  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data.getBoundingClientRect | <code>function</code> | A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method. |
| data.clientWidth | <code>Number</code> | An ES6 getter that will return the width of the virtual reference element. |
| data.clientHeight | <code>Number</code> | An ES6 getter that will return the height of the virtual reference element. |

<a name="modifiers"></a>

## modifiers : <code>object</code>
Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 9 modifiers to provide all the basic functionalities
needed by the library.

Usually you don't want to override the `order`, `function` and `onLoad` props.
All the other properties are configurations that could be tweaked.

**Kind**: global namespace  

* [modifiers](#modifiers) : <code>object</code>
    * [~shift](#modifiers..shift)
        * [.order](#modifiers..shift.order)
        * [.enabled](#modifiers..shift.enabled)
        * [.function](#modifiers..shift.function)
    * [~offset](#modifiers..offset)
        * [.order](#modifiers..offset.order)
        * [.enabled](#modifiers..offset.enabled)
        * [.function](#modifiers..offset.function)
        * [.offset](#modifiers..offset.offset)
    * [~preventOverflow](#modifiers..preventOverflow)
        * [.order](#modifiers..preventOverflow.order)
        * [.enabled](#modifiers..preventOverflow.enabled)
        * [.function](#modifiers..preventOverflow.function)
        * [.priority](#modifiers..preventOverflow.priority)
        * [.padding](#modifiers..preventOverflow.padding)
        * [.boundariesElement](#modifiers..preventOverflow.boundariesElement)
    * [~keepTogether](#modifiers..keepTogether)
        * [.order](#modifiers..keepTogether.order)
        * [.enabled](#modifiers..keepTogether.enabled)
        * [.function](#modifiers..keepTogether.function)
    * [~arrow](#modifiers..arrow)
        * [.order](#modifiers..arrow.order)
        * [.enabled](#modifiers..arrow.enabled)
        * [.function](#modifiers..arrow.function)
        * [.element](#modifiers..arrow.element)
    * [~flip](#modifiers..flip)
        * [.order](#modifiers..flip.order)
        * [.enabled](#modifiers..flip.enabled)
        * [.function](#modifiers..flip.function)
        * [.behavior](#modifiers..flip.behavior)
        * [.padding](#modifiers..flip.padding)
        * [.boundariesElement](#modifiers..flip.boundariesElement)
    * [~inner](#modifiers..inner)
        * [.order](#modifiers..inner.order)
        * [.enabled](#modifiers..inner.enabled)
        * [.function](#modifiers..inner.function)
    * [~hide](#modifiers..hide)
        * [.order](#modifiers..hide.order)
        * [.enabled](#modifiers..hide.enabled)
        * [.function](#modifiers..hide.function)
    * [~applyStyle](#modifiers..applyStyle)
        * [.order](#modifiers..applyStyle.order)
        * [.enabled](#modifiers..applyStyle.enabled)
        * [.function](#modifiers..applyStyle.function)
        * [.onLoad](#modifiers..applyStyle.onLoad)
        * [.gpuAcceleration](#modifiers..applyStyle.gpuAcceleration)

<a name="modifiers..shift"></a>

### modifiers~shift
Modifier used to shift the popper on the start or end of its reference element side

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~shift](#modifiers..shift)
    * [.order](#modifiers..shift.order)
    * [.enabled](#modifiers..shift.enabled)
    * [.function](#modifiers..shift.function)

<a name="modifiers..shift.order"></a>

#### shift.order
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>100</code> | Index used to define the order of execution |

<a name="modifiers..shift.enabled"></a>

#### shift.enabled
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..shift.function"></a>

#### shift.function
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..offset"></a>

### modifiers~offset
Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
The offsets will shift the popper on the side of its reference element.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~offset](#modifiers..offset)
    * [.order](#modifiers..offset.order)
    * [.enabled](#modifiers..offset.enabled)
    * [.function](#modifiers..offset.function)
    * [.offset](#modifiers..offset.offset)

<a name="modifiers..offset.order"></a>

#### offset.order
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>200</code> | Index used to define the order of execution |

<a name="modifiers..offset.enabled"></a>

#### offset.enabled
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..offset.function"></a>

#### offset.function
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..offset.offset"></a>

#### offset.offset
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| offset | <code>Number</code> \| <code>String</code> | <code>0</code> | Basic usage allows a number used to nudge the popper by the given amount of pixels. You can pass a percentage value as string (eg. `20%`) to nudge by the given percentage (relative to reference element size) Other supported units are `vh` and `vw` (relative to viewport) Additionally, you can pass a pair of values (eg. `10 20` or `2vh 20%`) to nudge the popper on both axis. A note about percentage values, if you want to refer a percentage to the popper size instead of the reference element size, use `%p` instead of `%` (eg: `20%p`). To make it clearer, you can replace `%` with `%r` and use eg.`10%p 25%r`. **Heads up!** The order of the axis is relative to the popper placement: `bottom` or `top` are `X,Y`, the other are `Y,X` |

<a name="modifiers..preventOverflow"></a>

### modifiers~preventOverflow
Modifier used to prevent the popper from being positioned outside the boundary.

A scenario exists where the reference itself is not within the boundaries. We can
say it has "escaped the boundaries" — or just "escaped". In this case we need to
decide whether the popper should either:

- detach from the reference and remain "trapped" in the boundaries, or
- if it should be ignore the boundary and "escape with the reference"

When `escapeWithReference` is `true`, and reference is completely outside the
boundaries, the popper will overflow (or completely leave) the boundaries in order
to remain attached to the edge of the reference.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~preventOverflow](#modifiers..preventOverflow)
    * [.order](#modifiers..preventOverflow.order)
    * [.enabled](#modifiers..preventOverflow.enabled)
    * [.function](#modifiers..preventOverflow.function)
    * [.priority](#modifiers..preventOverflow.priority)
    * [.padding](#modifiers..preventOverflow.padding)
    * [.boundariesElement](#modifiers..preventOverflow.boundariesElement)

<a name="modifiers..preventOverflow.order"></a>

#### preventOverflow.order
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>300</code> | Index used to define the order of execution |

<a name="modifiers..preventOverflow.enabled"></a>

#### preventOverflow.enabled
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..preventOverflow.function"></a>

#### preventOverflow.function
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..preventOverflow.priority"></a>

#### preventOverflow.priority
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| priority | <code>Array</code> | <code>[&#x27;left&#x27;,</code> | 'right', 'top', 'bottom'] Popper will try to prevent overflow following these priorities by default, then, it could overflow on the left and on top of the `boundariesElement` |

<a name="modifiers..preventOverflow.padding"></a>

#### preventOverflow.padding
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| padding | <code>Number</code> | <code>5</code> | Amount of pixel used to define a minimum distance between the boundaries and the popper this makes sure the popper has always a little padding between the edges of its container |

<a name="modifiers..preventOverflow.boundariesElement"></a>

#### preventOverflow.boundariesElement
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| boundariesElement | <code>String</code> \| <code>HTMLElement</code> | <code>&#x27;scrollParent&#x27;</code> | Boundaries used by the modifier, can be `scrollParent`, `window`, `viewport` or any DOM element. |

<a name="modifiers..keepTogether"></a>

### modifiers~keepTogether
Modifier used to make sure the reference and its popper stay near eachothers
without leaving any gap between the two. Expecially useful when the arrow is
enabled and you want to assure it to point to its reference element.
It cares only about the first axis, you can still have poppers with margin
between the popper and its reference element.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~keepTogether](#modifiers..keepTogether)
    * [.order](#modifiers..keepTogether.order)
    * [.enabled](#modifiers..keepTogether.enabled)
    * [.function](#modifiers..keepTogether.function)

<a name="modifiers..keepTogether.order"></a>

#### keepTogether.order
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>400</code> | Index used to define the order of execution |

<a name="modifiers..keepTogether.enabled"></a>

#### keepTogether.enabled
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..keepTogether.function"></a>

#### keepTogether.function
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..arrow"></a>

### modifiers~arrow
Modifier used to move the `arrowElement` on the edge of the popper to make
sure it's always between the popper and its reference element.
It will use the CSS outer size of the `arrowElement` element to know how
many pixels of conjuction are needed.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~arrow](#modifiers..arrow)
    * [.order](#modifiers..arrow.order)
    * [.enabled](#modifiers..arrow.enabled)
    * [.function](#modifiers..arrow.function)
    * [.element](#modifiers..arrow.element)

<a name="modifiers..arrow.order"></a>

#### arrow.order
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>500</code> | Index used to define the order of execution |

<a name="modifiers..arrow.enabled"></a>

#### arrow.enabled
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..arrow.function"></a>

#### arrow.function
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..arrow.element"></a>

#### arrow.element
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>String</code> \| <code>HTMLElement</code> | <code>&#x27;[x-arrow]&#x27;</code> | Selector or node used as arrow |

<a name="modifiers..flip"></a>

### modifiers~flip
Modifier used to flip the placement of the popper when the latter starts
overlapping its reference element.
Requires the `preventOverflow` modifier before it in order to work.
**NOTE:** this modifier will run all its previous modifiers everytime it
tries to flip the popper!

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~flip](#modifiers..flip)
    * [.order](#modifiers..flip.order)
    * [.enabled](#modifiers..flip.enabled)
    * [.function](#modifiers..flip.function)
    * [.behavior](#modifiers..flip.behavior)
    * [.padding](#modifiers..flip.padding)
    * [.boundariesElement](#modifiers..flip.boundariesElement)

<a name="modifiers..flip.order"></a>

#### flip.order
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>600</code> | Index used to define the order of execution |

<a name="modifiers..flip.enabled"></a>

#### flip.enabled
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..flip.function"></a>

#### flip.function
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..flip.behavior"></a>

#### flip.behavior
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| behavior | <code>String</code> \| <code>Array</code> | <code>&#x27;flip&#x27;</code> | The behavior used to change the popper's placement. It can be one of `flip`, `clockwise`, `counterclockwise` or an array with a list of valid placements (with optional variations). |

<a name="modifiers..flip.padding"></a>

#### flip.padding
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| padding | <code>Number</code> | <code>5</code> | The popper will flip if it hits the edges of the `boundariesElement` |

<a name="modifiers..flip.boundariesElement"></a>

#### flip.boundariesElement
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| boundariesElement | <code>String</code> \| <code>HTMLElement</code> | <code>&#x27;viewport&#x27;</code> | The element which will define the boundaries of the popper position, the popper will never be placed outside of the defined boundaries (except if keepTogether is enabled) |

<a name="modifiers..inner"></a>

### modifiers~inner
Modifier used to make the popper flow toward the inner of the reference element.
By default, when this modifier is disabled, the popper will be placed outside
the reference element.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~inner](#modifiers..inner)
    * [.order](#modifiers..inner.order)
    * [.enabled](#modifiers..inner.enabled)
    * [.function](#modifiers..inner.function)

<a name="modifiers..inner.order"></a>

#### inner.order
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>700</code> | Index used to define the order of execution |

<a name="modifiers..inner.enabled"></a>

#### inner.enabled
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>false</code> | Whether the modifier is enabled or not |

<a name="modifiers..inner.function"></a>

#### inner.function
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..hide"></a>

### modifiers~hide
Modifier used to hide the popper when its reference element is outside of the
popper boundaries. It will set an x-hidden attribute which can be used to hide
the popper when its reference is out of boundaries.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~hide](#modifiers..hide)
    * [.order](#modifiers..hide.order)
    * [.enabled](#modifiers..hide.enabled)
    * [.function](#modifiers..hide.function)

<a name="modifiers..hide.order"></a>

#### hide.order
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>800</code> | Index used to define the order of execution |

<a name="modifiers..hide.enabled"></a>

#### hide.enabled
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..hide.function"></a>

#### hide.function
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..applyStyle"></a>

### modifiers~applyStyle
Applies the computed styles to the popper element, disabling this modifier,
no DOM changes will be performed by Popper.js. You may want to disble it
while working with view librararies like React.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~applyStyle](#modifiers..applyStyle)
    * [.order](#modifiers..applyStyle.order)
    * [.enabled](#modifiers..applyStyle.enabled)
    * [.function](#modifiers..applyStyle.function)
    * [.onLoad](#modifiers..applyStyle.onLoad)
    * [.gpuAcceleration](#modifiers..applyStyle.gpuAcceleration)

<a name="modifiers..applyStyle.order"></a>

#### applyStyle.order
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>Number</code> | <code>900</code> | Index used to define the order of execution |

<a name="modifiers..applyStyle.enabled"></a>

#### applyStyle.enabled
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..applyStyle.function"></a>

#### applyStyle.function
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..applyStyle.onLoad"></a>

#### applyStyle.onLoad
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="modifiers..applyStyle.gpuAcceleration"></a>

#### applyStyle.gpuAcceleration
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| gpuAcceleration | <code>Boolean</code> | <code>true</code> | If true, it uses the CSS 3d transformation to position the popper. Otherwise, it will use the `top` and `left` properties. |

<a name="defaults"></a>

## defaults : <code>object</code>
Default options provided to Popper.js constructor.
These can be overriden using the `options` argument of Popper.js.
To override an option, simply pass as 3rd argument an object with the same
structure of {defaults}, example:
```
new Popper(ref, pop, {
  modifiers: {
    preventOverflow: { enabled: false }
  }
})
```

**Kind**: global namespace  

* [defaults](#defaults) : <code>object</code>
    * [.placement](#defaults.placement)
    * [.eventsEnabled](#defaults.eventsEnabled)
    * [.removeOnDestroy](#defaults.removeOnDestroy)
    * [.modifiers](#defaults.modifiers)
    * [.onCreate()](#defaults.onCreate)
    * [.onUpdate()](#defaults.onUpdate)

<a name="defaults.placement"></a>

### defaults.placement
Popper's placement

**Kind**: static property of <code>[defaults](#defaults)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| placement | <code>String</code> | <code>&#x27;bottom&#x27;</code> | 

<a name="defaults.eventsEnabled"></a>

### defaults.eventsEnabled
Whether events (resize, scroll) are initially enabled

**Kind**: static property of <code>[defaults](#defaults)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| eventsEnabled | <code>Boolean</code> | <code>true</code> | 

<a name="defaults.removeOnDestroy"></a>

### defaults.removeOnDestroy
Set to true if you want to automatically remove the popper when
you call the `destroy` method.

**Kind**: static property of <code>[defaults](#defaults)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| removeOnDestroy | <code>Boolean</code> | <code>false</code> | 

<a name="defaults.modifiers"></a>

### defaults.modifiers
List of modifiers used to modify the offsets before they are applied to the popper.
They provide most of the functionalities of Popper.js

**Kind**: static property of <code>[defaults](#defaults)</code>  
**Properties**

| Type |
| --- |
| <code>[modifiers](#modifiers)</code> | 

<a name="defaults.onCreate"></a>

### defaults.onCreate()
Callback called when the popper is created.
By default, is set to no-op.
Access Popper.js instance with `data.instance`.

**Kind**: static method of <code>[defaults](#defaults)</code>  
**Properties**

| Type |
| --- |
| <code>[onCreateCallback](#onCreateCallback)</code> | 

<a name="defaults.onUpdate"></a>

### defaults.onUpdate()
Callback called when the popper is updated, this callback is not called
on the initialization/creation of the popper, but only on subsequent
updates.
By default, is set to no-op.
Access Popper.js instance with `data.instance`.

**Kind**: static method of <code>[defaults](#defaults)</code>  
**Properties**

| Type |
| --- |
| <code>[onUpdateCallback](#onUpdateCallback)</code> | 

<a name="onCreateCallback"></a>

## onCreateCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="onUpdateCallback"></a>

## onUpdateCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

