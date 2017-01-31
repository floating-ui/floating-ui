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
</dl>

## Objects

<dl>
<dt><a href="#Modifiers">Modifiers</a> ⇒ <code>Object</code></dt>
<dd><p>Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 7 modifiers to provide all the basic functionalities
needed by the library.</p>
<p>Each modifier is an object containing several properties listed below.</p>
</dd>
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
        * [.Utils](#Popper.Utils) : <code>object</code>
            * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
            * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
            * [.getParentNode(element)](#Popper.Utils.getParentNode) ⇒ <code>Element</code>
            * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
            * [.getOffsetRect(element)](#Popper.Utils.getOffsetRect) ⇒ <code>Object</code>
            * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
            * [.getPosition(element)](#Popper.Utils.getPosition) ⇒ <code>String</code>
            * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
            * [.getOffsetRectRelativeToCustomParent(element, parent)](#Popper.Utils.getOffsetRectRelativeToCustomParent) ⇒ <code>Object</code>
            * [.getBoundaries(data, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
            * [.computeAutoPlacement(data, options)](#Popper.Utils.computeAutoPlacement) ⇒ <code>Object</code>
            * [.debounce(fn)](#Popper.Utils.debounce) ⇒ <code>function</code>
            * [.find(arr, prop, value)](#Popper.Utils.find) ⇒
            * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
            * [.getClientRect(popperOffsets)](#Popper.Utils.getClientRect) ⇒ <code>Object</code>
            * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
            * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>
            * [.getPopperOffsets(position, popper, referenceOffsets, placement)](#Popper.Utils.getPopperOffsets) ⇒ <code>Object</code>
            * [.getReferenceOffsets(state, popper, reference)](#Popper.Utils.getReferenceOffsets) ⇒ <code>Object</code>
            * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
            * [.isFunction(functionToCheck)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
            * [.isModifierEnabled()](#Popper.Utils.isModifierEnabled) ⇒ <code>Boolean</code>
            * [.isModifierRequired(modifiers, requestingName, requestedName)](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
            * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
            * [.isTransformed(element)](#Popper.Utils.isTransformed) ⇒ <code>Boolean</code>
            * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers)
            * [.setAttributes(element, styles)](#Popper.Utils.setAttributes)
            * [.setStyles(element, styles)](#Popper.Utils.setStyles)
            * [.getOppositeVariation(placement)](#Popper.Utils.getOppositeVariation) ⇒ <code>String</code>
        * [.scheduleUpdate()](#Popper.scheduleUpdate)

<a name="new_Popper_new"></a>

### new Popper(reference, popper, options)
Create a new Popper.js instance

**Returns**: <code>Object</code> - instance - The generated Popper.js instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| reference | <code>HTMLElement</code> |  | The reference element used to position the popper |
| popper | <code>HTMLElement</code> |  | The HTML element used as popper. |
| options | <code>Object</code> |  |  |
| options.placement | <code>String</code> | <code>bottom</code> | Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -end),      left(-start, -end)` |
| options.eventsEnabled | <code>Boolean</code> | <code>true</code> | Whether events (resize, scroll) are initially enabled |
| options.gpuAcceleration | <code>Boolean</code> | <code>true</code> | When this property is set to true, the popper position will be applied using CSS3 translate3d, allowing the      browser to use the GPU to accelerate the rendering.      If set to false, the popper will be placed using `top` and `left` properties, not using the GPU. |
| options.removeOnDestroy | <code>Boolean</code> | <code>false</code> | Set to true if you want to automatically remove the popper when you call the `destroy` method. |
| options.modifiers | <code>Object</code> |  | List of functions used to modify the data before they are applied to the popper (see source code for default values) |
| options.modifiers.arrow | <code>Object</code> |  | Arrow modifier configuration |
| options.modifiers.arrow.element | <code>String</code> &#124; <code>HTMLElement</code> | <code>&#x27;[x-arrow]&#x27;</code> | The DOM Node used as arrow for the popper, or a CSS selector used to get the DOM node. It must be child of      its parent Popper. Popper.js will apply to the given element the style required to align the arrow with its      reference element.      By default, it will look for a child node of the popper with the `x-arrow` attribute. |
| options.modifiers.offset | <code>Object</code> |  | Offset modifier configuration |
| options.modifiers.offset.offset | <code>Number</code> | <code>0</code> | Amount of pixels the popper will be shifted (can be negative). |
| options.modifiers.preventOverflow | <code>Object</code> |  | PreventOverflow modifier configuration |
| [options.modifiers.preventOverflow.priority] | <code>Array</code> | <code>[&#x27;left&#x27;, &#x27;right&#x27;, &#x27;top&#x27;, &#x27;bottom&#x27;]</code> | Priority used when Popper.js tries to avoid overflows from the boundaries, they will be checked in order,      this means that the last one will never overflow |
| options.modifiers.preventOverflow.boundariesElement | <code>String</code> &#124; <code>HTMLElement</code> | <code>&#x27;scrollParent&#x27;</code> | Boundaries used by the modifier, can be `scrollParent`, `window`, `viewport` or any DOM element. |
| options.modifiers.preventOverflow.padding | <code>Number</code> | <code>5</code> | Amount of pixel used to define a minimum distance between the boundaries and the popper      this makes sure the popper has always a little padding between the edges of its container. |
| options.modifiers.flip | <code>Object</code> |  | Flip modifier configuration |
| options.modifiers.flip.behavior | <code>String</code> &#124; <code>Array</code> | <code>&#x27;flip&#x27;</code> | The behavior used by the `flip` modifier to change the placement of the popper when the latter is trying to      overlap its reference element. Defining `flip` as value, the placement will be flipped on      its axis (`right - left`, `top - bottom`).      You can even pass an array of placements (eg: `['right', 'left', 'top']` ) to manually specify      how alter the placement when a flip is needed. (eg. in the above example, it would first flip from right to left,      then, if even in its new placement, the popper is overlapping its reference element, it will be moved to top) |
| options.modifiers.flip.boundariesElement | <code>String</code> &#124; <code>HTMLElement</code> | <code>&#x27;viewport&#x27;</code> | The element which will define the boundaries of the popper position, the popper will never be placed outside      of the defined boundaries (except if `keepTogether` is enabled) |
| options.modifiers.inner | <code>Object</code> |  | Inner modifier configuration |
| options.modifiers.inner.enabled | <code>Number</code> | <code>false</code> | Set to `true` to make the popper flow toward the inner of the reference element. |
| options.modifiers.flip.padding | <code>Number</code> | <code>5</code> | Amount of pixel used to define a minimum distance between the boundaries and the popper      this makes sure the popper has always a little padding between the edges of its container. |
| options.onCreate | <code>[createCallback](#createCallback)</code> |  | onCreate callback      Function called after the Popper has been instantiated. |
| options.onUpdate | <code>[updateCallback](#updateCallback)</code> |  | onUpdate callback      Function called on subsequent updates of Popper. |

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
<a name="Popper.Utils"></a>

### Popper.Utils : <code>object</code>
**Kind**: static namespace of <code>[Popper](#Popper)</code>  

* [.Utils](#Popper.Utils) : <code>object</code>
    * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
    * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
    * [.getParentNode(element)](#Popper.Utils.getParentNode) ⇒ <code>Element</code>
    * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
    * [.getOffsetRect(element)](#Popper.Utils.getOffsetRect) ⇒ <code>Object</code>
    * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
    * [.getPosition(element)](#Popper.Utils.getPosition) ⇒ <code>String</code>
    * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
    * [.getOffsetRectRelativeToCustomParent(element, parent)](#Popper.Utils.getOffsetRectRelativeToCustomParent) ⇒ <code>Object</code>
    * [.getBoundaries(data, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
    * [.computeAutoPlacement(data, options)](#Popper.Utils.computeAutoPlacement) ⇒ <code>Object</code>
    * [.debounce(fn)](#Popper.Utils.debounce) ⇒ <code>function</code>
    * [.find(arr, prop, value)](#Popper.Utils.find) ⇒
    * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
    * [.getClientRect(popperOffsets)](#Popper.Utils.getClientRect) ⇒ <code>Object</code>
    * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
    * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>
    * [.getPopperOffsets(position, popper, referenceOffsets, placement)](#Popper.Utils.getPopperOffsets) ⇒ <code>Object</code>
    * [.getReferenceOffsets(state, popper, reference)](#Popper.Utils.getReferenceOffsets) ⇒ <code>Object</code>
    * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
    * [.isFunction(functionToCheck)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
    * [.isModifierEnabled()](#Popper.Utils.isModifierEnabled) ⇒ <code>Boolean</code>
    * [.isModifierRequired(modifiers, requestingName, requestedName)](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
    * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
    * [.isTransformed(element)](#Popper.Utils.isTransformed) ⇒ <code>Boolean</code>
    * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers)
    * [.setAttributes(element, styles)](#Popper.Utils.setAttributes)
    * [.setStyles(element, styles)](#Popper.Utils.setStyles)
    * [.getOppositeVariation(placement)](#Popper.Utils.getOppositeVariation) ⇒ <code>String</code>

<a name="Popper.Utils.getOffsetParent"></a>

#### Utils.getOffsetParent(element) ⇒ <code>Element</code>
Returns the offset parent of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - offset parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getStyleComputedProperty"></a>

#### Utils.getStyleComputedProperty(element, property)
Get CSS computed property of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| element | <code>Eement</code> | 
| property | <code>String</code> | 

<a name="Popper.Utils.getParentNode"></a>

#### Utils.getParentNode(element) ⇒ <code>Element</code>
Returns the parentNode or the host of the element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getScrollParent"></a>

#### Utils.getScrollParent(element) ⇒ <code>Element</code>
Returns the scrolling parent of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - scroll parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getOffsetRect"></a>

#### Utils.getOffsetRect(element) ⇒ <code>Object</code>
Get the position of the given element, relative to its offset parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - position - Coordinates of the element and its `scrollTop`  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.isFixed"></a>

#### Utils.isFixed(element, customContainer) ⇒ <code>Boolean</code>
Check if the given element is fixed or is inside a fixed parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to "isFixed?"  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| customContainer | <code>Element</code> | 

<a name="Popper.Utils.getPosition"></a>

#### Utils.getPosition(element) ⇒ <code>String</code>
Helper used to get the position which will be applied to the popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - position  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | popper element |

<a name="Popper.Utils.getBoundingClientRect"></a>

#### Utils.getBoundingClientRect(element) ⇒ <code>Object</code>
Get bounding client rect of given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - client rect  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Popper.Utils.getOffsetRectRelativeToCustomParent"></a>

#### Utils.getOffsetRectRelativeToCustomParent(element, parent) ⇒ <code>Object</code>
Given an element and one of its parents, return the offset

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - rect  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 
| parent | <code>HTMLElement</code> | 

<a name="Popper.Utils.getBoundaries"></a>

#### Utils.getBoundaries(data, padding, boundariesElement) ⇒ <code>Object</code>
Computed the boundaries limits and return them

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - Coordinates of the boundaries  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Object containing the property "offsets" generated by `_getOffsets` |
| padding | <code>Number</code> | Boundaries padding |
| boundariesElement | <code>Element</code> | Element used to define the boundaries |

<a name="Popper.Utils.computeAutoPlacement"></a>

#### Utils.computeAutoPlacement(data, options) ⇒ <code>Object</code>
Utility used to transform the `auto` placement to the placement with more
available space.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Popper.Utils.debounce"></a>

#### Utils.debounce(fn) ⇒ <code>function</code>
Create a debounced version of a method, that's asynchronously deferred
but called in the minimum time possible.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="Popper.Utils.find"></a>

#### Utils.find(arr, prop, value) ⇒
Mimics the `find` method of Array

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: index or -1  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 
| prop |  | 
| value |  | 

<a name="Popper.Utils.findIndex"></a>

#### Utils.findIndex(arr, prop, value) ⇒
Return the index of the matching object

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: index or -1  

| Param | Type |
| --- | --- |
| arr | <code>Array</code> | 
| prop |  | 
| value |  | 

<a name="Popper.Utils.getClientRect"></a>

#### Utils.getClientRect(popperOffsets) ⇒ <code>Object</code>
Given the popper offsets, generate an output similar to getBoundingClientRect

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - ClientRect like output  

| Param | Type |
| --- | --- |
| popperOffsets | <code>Object</code> | 

<a name="Popper.Utils.getOuterSizes"></a>

#### Utils.getOuterSizes(element) ⇒ <code>Object</code>
Get the outer sizes of the given element (offset size + margins)

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - object containing width and height properties  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.getOppositePlacement"></a>

#### Utils.getOppositePlacement(placement) ⇒ <code>String</code>
Get the opposite placement of the given one/

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - flipped placement  

| Param | Type |
| --- | --- |
| placement | <code>String</code> | 

<a name="Popper.Utils.getPopperOffsets"></a>

#### Utils.getPopperOffsets(position, popper, referenceOffsets, placement) ⇒ <code>Object</code>
Get offsets to the popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - popperOffsets - An object containing the offsets which will be applied to the popper  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Object</code> | CSS position the Popper will get applied |
| popper | <code>HTMLElement</code> | the popper element |
| referenceOffsets | <code>Object</code> | the reference offsets (the popper will be relative to this) |
| placement | <code>String</code> | one of the valid placement options |

<a name="Popper.Utils.getReferenceOffsets"></a>

#### Utils.getReferenceOffsets(state, popper, reference) ⇒ <code>Object</code>
Get offsets to the reference element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - An object containing the offsets which will be applied to the popper  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>Object</code> |  |
| popper | <code>Element</code> | the popper element |
| reference | <code>Element</code> | the reference element (the popper will be relative to this) |

<a name="Popper.Utils.getSupportedPropertyName"></a>

#### Utils.getSupportedPropertyName(property) ⇒ <code>String</code>
Get the prefixed supported property name

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - prefixed property (camelCase)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | (camelCase) |

<a name="Popper.Utils.isFunction"></a>

#### Utils.isFunction(functionToCheck) ⇒ <code>Boolean</code>
Check if the given variable is a function

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to: is a function?  

| Param | Type | Description |
| --- | --- | --- |
| functionToCheck | <code>\*</code> | variable to check |

<a name="Popper.Utils.isModifierEnabled"></a>

#### Utils.isModifierEnabled() ⇒ <code>Boolean</code>
Helper used to know if the given modifier is enabled.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
<a name="Popper.Utils.isModifierRequired"></a>

#### Utils.isModifierRequired(modifiers, requestingName, requestedName) ⇒ <code>Boolean</code>
Helper used to know if the given modifier depends from another one.
It checks if the needed modifier is listed and enabled.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| modifiers | <code>Array</code> | list of modifiers |
| requestingName | <code>String</code> | name of requesting modifier |
| requestedName | <code>String</code> | name of requested modifier |

<a name="Popper.Utils.isNumeric"></a>

#### Utils.isNumeric(input) ⇒ <code>Boolean</code>
Tells if a given input is a number

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>\*</code> | to check |

<a name="Popper.Utils.isTransformed"></a>

#### Utils.isTransformed(element) ⇒ <code>Boolean</code>
Check if the given element has transforms applied to itself or a parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to "isTransformed?"  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.runModifiers"></a>

#### Utils.runModifiers(data, modifiers, ends)
Loop trough the list of modifiers and run them in order, each of them will then edit the data object

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> | 
| modifiers | <code>Array</code> | 
| ends | <code>function</code> | 

<a name="Popper.Utils.setAttributes"></a>

#### Utils.setAttributes(element, styles)
Set the attributes to the given popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to apply the attributes to |
| styles | <code>Object</code> | Object with a list of properties and values which will be applied to the element |

<a name="Popper.Utils.setStyles"></a>

#### Utils.setStyles(element, styles)
Set the style to the given popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to apply the style to |
| styles | <code>Object</code> | Object with a list of properties and values which will be applied to the element |

<a name="Popper.Utils.getOppositeVariation"></a>

#### Utils.getOppositeVariation(placement) ⇒ <code>String</code>
Get the opposite placement variation of the given one/

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - flipped placement variation  

| Param | Type | Description |
| --- | --- | --- |
| placement | <code>String</code> | variation |

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

<a name="Modifiers"></a>

## Modifiers ⇒ <code>Object</code>
Modifiers are plugins used to alter the behavior of your poppers.
Popper.js uses a set of 7 modifiers to provide all the basic functionalities
needed by the library.

Each modifier is an object containing several properties listed below.

**Kind**: global namespace  
**Returns**: <code>Object</code> - data - Each modifier must return the modified `data` object.  

| Param | Type | Description |
| --- | --- | --- |
| modifier | <code>Object</code> | Modifier descriptor |
| modifier.order | <code>Integer</code> | The `order` property defines the execution order of the modifiers.      The built-in modifiers have orders with a gap of 100 units in between,      this allows you to inject additional modifiers between the existing ones      without having to redefine the order of all of them.      The modifiers are executed starting from the one with the lowest order. |
| modifier.enabled | <code>Boolean</code> | When `true`, the modifier will be used. |
| modifier.function | <code>[modifier](#Modifiers..modifier)</code> | Modifier function. |
| modifier.onLoad | <code>Modifiers~onLoad</code> | Function executed on popper initalization |


* [Modifiers](#Modifiers) ⇒ <code>Object</code>
    * _static_
        * [.applyStyle(data, options)](#Modifiers.applyStyle) ⇒ <code>Object</code>
        * [.arrow(data, options)](#Modifiers.arrow) ⇒ <code>Object</code>
        * [.flip(data, options)](#Modifiers.flip) ⇒ <code>Object</code>
        * [.keepTogether(data, options)](#Modifiers.keepTogether) ⇒ <code>Object</code>
        * [.offset(data, options)](#Modifiers.offset) ⇒ <code>Object</code>
        * [.preventOverflow(data, options)](#Modifiers.preventOverflow) ⇒ <code>Object</code>
        * [.shift(data, options)](#Modifiers.shift) ⇒ <code>Object</code>
        * [.hide(data, options)](#Modifiers.hide) ⇒ <code>Object</code>
        * [.inner(data, options)](#Modifiers.inner) ⇒ <code>Object</code>
    * _inner_
        * [~modifier](#Modifiers..modifier) ⇒ <code>[dataObject](#dataObject)</code>

<a name="Modifiers.applyStyle"></a>

### Modifiers.applyStyle(data, options) ⇒ <code>Object</code>
Apply the computed styles to the popper element

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The same data object  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| data.styles | <code>Object</code> | List of style properties - values to apply to popper element |
| data.attributes | <code>Object</code> | List of attribute properties - values to apply to popper element |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.arrow"></a>

### Modifiers.arrow(data, options) ⇒ <code>Object</code>
Modifier used to move the arrowElements on the edge of the popper to make sure them are always between the popper and the reference element
It will use the CSS outer size of the arrowElement element to know how many pixels of conjuction are needed

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.flip"></a>

### Modifiers.flip(data, options) ⇒ <code>Object</code>
Modifier used to flip the placement of the popper when the latter is starting overlapping its reference element.
Requires the `preventOverflow` modifier before it in order to work.
**NOTE:** data.instance modifier will run all its previous modifiers everytime it tries to flip the popper!

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.keepTogether"></a>

### Modifiers.keepTogether(data, options) ⇒ <code>Object</code>
Modifier used to make sure the popper is always near its reference element
It cares only about the first axis, you can still have poppers with margin
between the popper and its reference element.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.offset"></a>

### Modifiers.offset(data, options) ⇒ <code>Object</code>
Modifier used to add an offset to the popper, useful if you more granularity positioning your popper.
The offsets will shift the popper on the side of its reference element.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Object</code> |  | The data object generated by update method |
| options | <code>Object</code> |  | Modifiers configuration and options |
| options.offset | <code>Number</code> &#124; <code>String</code> | <code>0</code> | Basic usage allows a number used to nudge the popper by the given amount of pixels.      You can pass a percentage value as string (eg. `20%`) to nudge by the given percentage (relative to reference element size)      Other supported units are `vh` and `vw` (relative to viewport)      Additionally, you can pass a pair of values (eg. `10 20` or `2vh 20%`) to nudge the popper      on both axis.      A note about percentage values, if you want to refer a percentage to the popper size instead of the reference element size,      use `%p` instead of `%` (eg: `20%p`). To make it clearer, you can replace `%` with `%r` and use eg.`10%p 25%r`.      > **Heads up!** The order of the axis is relative to the popper placement: `bottom` or `top` are `X,Y`, the other are `Y,X` |

<a name="Modifiers.preventOverflow"></a>

### Modifiers.preventOverflow(data, options) ⇒ <code>Object</code>
Modifier used to prevent the popper from being positioned outside the boundary.

An scenario exists where the reference itself is not within the boundaries. We can
say it has "escaped the boundaries" — or just "escaped". In this case we need to
decide whether the popper should either:

- detach from the reference and remain "trapped" in the boundaries, or
- if it should be ignore the boundary and "escape with the reference"

When `escapeWithReference` is `true`, and reference is completely outside the
boundaries, the popper will overflow (or completely leave) the boundaries in order
to remain attached to the edge of the reference.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.shift"></a>

### Modifiers.shift(data, options) ⇒ <code>Object</code>
Modifier used to shift the popper on the start or end of its reference element side

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.hide"></a>

### Modifiers.hide(data, options) ⇒ <code>Object</code>
Modifier used to hide the popper when its reference element is outside of the
popper boundaries. It will set an x-hidden attribute which can be used to hide
the popper when its reference is out of boundaries.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by update method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers.inner"></a>

### Modifiers.inner(data, options) ⇒ <code>Object</code>
Modifier used to make the popper flow toward the inner of the reference element.
By default, when this modifier is disabled, the popper will be placed outside
the reference element.

**Kind**: static method of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>Object</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="Modifiers..modifier"></a>

### Modifiers~modifier ⇒ <code>[dataObject](#dataObject)</code>
Modifiers can edit the `data` object to change the beheavior of the popper.
This object contains all the informations used by Popper.js to compute the
popper position.
The modifier can edit the data as needed, and then `return` it as result.

**Kind**: inner typedef of <code>[Modifiers](#Modifiers)</code>  
**Returns**: <code>[dataObject](#dataObject)</code> - modified data  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="createCallback"></a>

## .createCallback : <code>function</code>
Callback called when the popper is created.
By default, is set to no-op.
Access Popper.js instance with `data.instance`.

**Kind**: static typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="updateCallback"></a>

## .updateCallback : <code>function</code>
Callback called when the popper is updated, this callback is not called
on the initialization/creation of the popper, but only on subsequent
updates.
By default, is set to no-op.
Access Popper.js instance with `data.instance`.

**Kind**: static typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

