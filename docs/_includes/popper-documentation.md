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
and lets you use it as replacement of a real DOM node.<br />
You can use this method to position a popper relatively to a set of coordinates
in case you don&#39;t have a DOM node to use as reference.</p>
<pre><code>new Popper(referenceObject, popperNode);
</code></pre><p>NB: This feature isn&#39;t supported in Internet Explorer 10</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#modifiers">modifiers</a> : <code>object</code></dt>
<dd><p>Modifiers are plugins used to alter the behavior of your poppers.<br />
Popper.js uses a set of 9 modifiers to provide all the basic functionalities
needed by the library.</p>
<p>Usually you don&#39;t want to override the <code>order</code>, <code>fn</code> and <code>onLoad</code> props.
All the other properties are configurations that could be tweaked.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#ModifierFn">ModifierFn(data, options)</a> ⇒ <code><a href="#dataObject">dataObject</a></code></dt>
<dd><p>Modifier function, each modifier can have a function of this type assigned
to its <code>fn</code> property.<br />
These functions will be called on each update, this means that you must
make sure they are performant enough to avoid performance bottlenecks.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#onUpdateCallback">onUpdateCallback</a> : <code>function</code></dt>
<dd></dd>
<dt><a href="#onCreateCallback">onCreateCallback</a> : <code>function</code></dt>
<dd></dd>
</dl>

<a name="Popper"></a>

## Popper
**Kind**: global class  

* [Popper](#Popper)
    * [new Popper(reference, popper, options)](#new_Popper_new)
    * [.DEFAULTS](#Popper.DEFAULTS) : <code>Object</code>
        * [.placement](#Popper.DEFAULTS.placement)
        * [.eventsEnabled](#Popper.DEFAULTS.eventsEnabled)
        * [.removeOnDestroy](#Popper.DEFAULTS.removeOnDestroy)
        * [.modifiers](#Popper.DEFAULTS.modifiers)
        * [.onCreate()](#Popper.DEFAULTS.onCreate)
        * [.onUpdate()](#Popper.DEFAULTS.onUpdate)
    * ~~[.Utils](#Popper.Utils) : <code>Object</code>~~
        * [.isNative(fn)](#Popper.Utils.isNative) ⇒ <code>Boolean</code>
        * [.debounce(fn)](#Popper.Utils.debounce) ⇒ <code>function</code>
        * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
        * [.setStyles(element, styles)](#Popper.Utils.setStyles)
        * [.isFunction(functionToCheck)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
        * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
        * [.getParentNode(element)](#Popper.Utils.getParentNode) ⇒ <code>Element</code>
        * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
        * [.getRoot(node)](#Popper.Utils.getRoot) ⇒ <code>Element</code>
        * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
        * [.findCommonOffsetParent(element1, element2)](#Popper.Utils.findCommonOffsetParent) ⇒ <code>Element</code>
        * [.getScroll(element, side)](#Popper.Utils.getScroll) ⇒ <code>number</code>
        * [.getClientRect(offsets)](#Popper.Utils.getClientRect) ⇒ <code>Object</code>
        * [.isIE10()](#Popper.Utils.isIE10) ⇒ <code>Boolean</code>
        * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
        * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
        * [.getBoundaries(popper, reference, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
        * [.computeAutoPlacement(data, options)](#Popper.Utils.computeAutoPlacement) ⇒ <code>Object</code>
        * [.getReferenceOffsets(state, popper, reference)](#Popper.Utils.getReferenceOffsets) ⇒ <code>Object</code>
        * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
        * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>
        * [.getPopperOffsets(position, popper, referenceOffsets, placement)](#Popper.Utils.getPopperOffsets) ⇒ <code>Object</code>
        * [.find(arr, prop, value)](#Popper.Utils.find) ⇒
        * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
        * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers) ⇒ <code>[dataObject](#dataObject)</code>
        * [.isModifierEnabled()](#Popper.Utils.isModifierEnabled) ⇒ <code>Boolean</code>
        * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
        * [.setAttributes(element, styles)](#Popper.Utils.setAttributes)
        * [.isModifierRequired(modifiers, requestingName, requestedName)](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
        * [.getOppositeVariation(placement)](#Popper.Utils.getOppositeVariation) ⇒ <code>String</code>
        * [.clockwise(placement, counter)](#Popper.Utils.clockwise) ⇒ <code>Array</code>
    * [.placements](#Popper.placements) : <code>enum</code>
    * [.update()](#Popper.update)
    * [.destroy()](#Popper.destroy)
    * [.enableEventListeners()](#Popper.enableEventListeners)
    * [.disableEventListeners()](#Popper.disableEventListeners)
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

<a name="Popper.DEFAULTS"></a>

### Popper.DEFAULTS : <code>Object</code>
Default options provided to Popper.js constructor.<br />
These can be overriden using the `options` argument of Popper.js.<br />
To override an option, simply pass as 3rd argument an object with the same
structure of this object, example:
```
new Popper(ref, pop, {
  modifiers: {
    preventOverflow: { enabled: false }
  }
})
```

**Kind**: static property of <code>[Popper](#Popper)</code>  

* [.DEFAULTS](#Popper.DEFAULTS) : <code>Object</code>
    * [.placement](#Popper.DEFAULTS.placement)
    * [.eventsEnabled](#Popper.DEFAULTS.eventsEnabled)
    * [.removeOnDestroy](#Popper.DEFAULTS.removeOnDestroy)
    * [.modifiers](#Popper.DEFAULTS.modifiers)
    * [.onCreate()](#Popper.DEFAULTS.onCreate)
    * [.onUpdate()](#Popper.DEFAULTS.onUpdate)

<a name="Popper.DEFAULTS.placement"></a>

#### DEFAULTS.placement
Popper's placement

**Kind**: static property of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| placement | <code>[placements](#Popper.placements)</code> | <code>&#x27;bottom&#x27;</code> | 

<a name="Popper.DEFAULTS.eventsEnabled"></a>

#### DEFAULTS.eventsEnabled
Whether events (resize, scroll) are initially enabled

**Kind**: static property of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| eventsEnabled | <code>Boolean</code> | <code>true</code> | 

<a name="Popper.DEFAULTS.removeOnDestroy"></a>

#### DEFAULTS.removeOnDestroy
Set to true if you want to automatically remove the popper when
you call the `destroy` method.

**Kind**: static property of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| removeOnDestroy | <code>Boolean</code> | <code>false</code> | 

<a name="Popper.DEFAULTS.modifiers"></a>

#### DEFAULTS.modifiers
List of modifiers used to modify the offsets before they are applied to the popper.
They provide most of the functionalities of Popper.js

**Kind**: static property of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Type |
| --- |
| <code>[modifiers](#modifiers)</code> | 

<a name="Popper.DEFAULTS.onCreate"></a>

#### DEFAULTS.onCreate()
Callback called when the popper is created.<br />
By default, is set to no-op.<br />
Access Popper.js instance with `data.instance`.

**Kind**: static method of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Type |
| --- |
| <code>[onCreateCallback](#onCreateCallback)</code> | 

<a name="Popper.DEFAULTS.onUpdate"></a>

#### DEFAULTS.onUpdate()
Callback called when the popper is updated, this callback is not called
on the initialization/creation of the popper, but only on subsequent
updates.<br />
By default, is set to no-op.<br />
Access Popper.js instance with `data.instance`.

**Kind**: static method of <code>[DEFAULTS](#Popper.DEFAULTS)</code>  
**Properties**

| Type |
| --- |
| <code>[onUpdateCallback](#onUpdateCallback)</code> | 

<a name="Popper.Utils"></a>

### ~~Popper.Utils : <code>Object</code>~~
***Deprecated***

Collection of utilities useful when writing custom modifiers.
Starting from version 1.7, this method is available only if you
include `popper-utils.js` before `popper.js`.

**DEPRECATION**: This way to access PopperUtils is deprecated
and will be removed in v2! Use the PopperUtils module directly instead.

**Kind**: static property of <code>[Popper](#Popper)</code>  

* ~~[.Utils](#Popper.Utils) : <code>Object</code>~~
    * [.isNative(fn)](#Popper.Utils.isNative) ⇒ <code>Boolean</code>
    * [.debounce(fn)](#Popper.Utils.debounce) ⇒ <code>function</code>
    * [.isNumeric(input)](#Popper.Utils.isNumeric) ⇒ <code>Boolean</code>
    * [.setStyles(element, styles)](#Popper.Utils.setStyles)
    * [.isFunction(functionToCheck)](#Popper.Utils.isFunction) ⇒ <code>Boolean</code>
    * [.getStyleComputedProperty(element, property)](#Popper.Utils.getStyleComputedProperty)
    * [.getParentNode(element)](#Popper.Utils.getParentNode) ⇒ <code>Element</code>
    * [.getScrollParent(element)](#Popper.Utils.getScrollParent) ⇒ <code>Element</code>
    * [.getRoot(node)](#Popper.Utils.getRoot) ⇒ <code>Element</code>
    * [.getOffsetParent(element)](#Popper.Utils.getOffsetParent) ⇒ <code>Element</code>
    * [.findCommonOffsetParent(element1, element2)](#Popper.Utils.findCommonOffsetParent) ⇒ <code>Element</code>
    * [.getScroll(element, side)](#Popper.Utils.getScroll) ⇒ <code>number</code>
    * [.getClientRect(offsets)](#Popper.Utils.getClientRect) ⇒ <code>Object</code>
    * [.isIE10()](#Popper.Utils.isIE10) ⇒ <code>Boolean</code>
    * [.getBoundingClientRect(element)](#Popper.Utils.getBoundingClientRect) ⇒ <code>Object</code>
    * [.isFixed(element, customContainer)](#Popper.Utils.isFixed) ⇒ <code>Boolean</code>
    * [.getBoundaries(popper, reference, padding, boundariesElement)](#Popper.Utils.getBoundaries) ⇒ <code>Object</code>
    * [.computeAutoPlacement(data, options)](#Popper.Utils.computeAutoPlacement) ⇒ <code>Object</code>
    * [.getReferenceOffsets(state, popper, reference)](#Popper.Utils.getReferenceOffsets) ⇒ <code>Object</code>
    * [.getOuterSizes(element)](#Popper.Utils.getOuterSizes) ⇒ <code>Object</code>
    * [.getOppositePlacement(placement)](#Popper.Utils.getOppositePlacement) ⇒ <code>String</code>
    * [.getPopperOffsets(position, popper, referenceOffsets, placement)](#Popper.Utils.getPopperOffsets) ⇒ <code>Object</code>
    * [.find(arr, prop, value)](#Popper.Utils.find) ⇒
    * [.findIndex(arr, prop, value)](#Popper.Utils.findIndex) ⇒
    * [.runModifiers(data, modifiers, ends)](#Popper.Utils.runModifiers) ⇒ <code>[dataObject](#dataObject)</code>
    * [.isModifierEnabled()](#Popper.Utils.isModifierEnabled) ⇒ <code>Boolean</code>
    * [.getSupportedPropertyName(property)](#Popper.Utils.getSupportedPropertyName) ⇒ <code>String</code>
    * [.setAttributes(element, styles)](#Popper.Utils.setAttributes)
    * [.isModifierRequired(modifiers, requestingName, requestedName)](#Popper.Utils.isModifierRequired) ⇒ <code>Boolean</code>
    * [.getOppositeVariation(placement)](#Popper.Utils.getOppositeVariation) ⇒ <code>String</code>
    * [.clockwise(placement, counter)](#Popper.Utils.clockwise) ⇒ <code>Array</code>

<a name="Popper.Utils.isNative"></a>

#### Utils.isNative(fn) ⇒ <code>Boolean</code>
Determine if a function is implemented natively (as opposed to a polyfill).

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> \| <code>undefined</code> | the function to check |

<a name="Popper.Utils.debounce"></a>

#### Utils.debounce(fn) ⇒ <code>function</code>
Create a debounced version of a method, that's asynchronously deferred
but called in the minimum time possible.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="Popper.Utils.isNumeric"></a>

#### Utils.isNumeric(input) ⇒ <code>Boolean</code>
Tells if a given input is a number

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>\*</code> | to check |

<a name="Popper.Utils.setStyles"></a>

#### Utils.setStyles(element, styles)
Set the style to the given popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to apply the style to |
| styles | <code>Object</code> | Object with a list of properties and values which will be applied to the element |

<a name="Popper.Utils.isFunction"></a>

#### Utils.isFunction(functionToCheck) ⇒ <code>Boolean</code>
Check if the given variable is a function

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to: is a function?  

| Param | Type | Description |
| --- | --- | --- |
| functionToCheck | <code>Any</code> | variable to check |

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

<a name="Popper.Utils.getRoot"></a>

#### Utils.getRoot(node) ⇒ <code>Element</code>
Finds the root node (document, shadowDOM root) of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - root node  

| Param | Type |
| --- | --- |
| node | <code>Element</code> | 

<a name="Popper.Utils.getOffsetParent"></a>

#### Utils.getOffsetParent(element) ⇒ <code>Element</code>
Returns the offset parent of the given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - offset parent  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 

<a name="Popper.Utils.findCommonOffsetParent"></a>

#### Utils.findCommonOffsetParent(element1, element2) ⇒ <code>Element</code>
Finds the offset parent common to the two provided nodes

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Element</code> - common offset parent  

| Param | Type |
| --- | --- |
| element1 | <code>Element</code> | 
| element2 | <code>Element</code> | 

<a name="Popper.Utils.getScroll"></a>

#### Utils.getScroll(element, side) ⇒ <code>number</code>
Gets the scroll value of the given element in the given side (top and left)

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>number</code> - amount of scrolled pixels  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>Element</code> |  |  |
| side | <code>String</code> | <code>top</code> | `top` or `left` |

<a name="Popper.Utils.getClientRect"></a>

#### Utils.getClientRect(offsets) ⇒ <code>Object</code>
Given element offsets, generate an output similar to getBoundingClientRect

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - ClientRect like output  

| Param | Type |
| --- | --- |
| offsets | <code>Object</code> | 

<a name="Popper.Utils.isIE10"></a>

#### Utils.isIE10() ⇒ <code>Boolean</code>
Tells if you are running Internet Explorer 10

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - isIE10  
<a name="Popper.Utils.getBoundingClientRect"></a>

#### Utils.getBoundingClientRect(element) ⇒ <code>Object</code>
Get bounding client rect of given element

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - client rect  

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 

<a name="Popper.Utils.isFixed"></a>

#### Utils.isFixed(element, customContainer) ⇒ <code>Boolean</code>
Check if the given element is fixed or is inside a fixed parent

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Boolean</code> - answer to "isFixed?"  

| Param | Type |
| --- | --- |
| element | <code>Element</code> | 
| customContainer | <code>Element</code> | 

<a name="Popper.Utils.getBoundaries"></a>

#### Utils.getBoundaries(popper, reference, padding, boundariesElement) ⇒ <code>Object</code>
Computed the boundaries limits and return them

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Object</code> - Coordinates of the boundaries  

| Param | Type | Description |
| --- | --- | --- |
| popper | <code>HTMLElement</code> |  |
| reference | <code>HTMLElement</code> |  |
| padding | <code>number</code> |  |
| boundariesElement | <code>HTMLElement</code> | Element used to define the boundaries |

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
Get the opposite placement of the given one

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

<a name="Popper.Utils.runModifiers"></a>

#### Utils.runModifiers(data, modifiers, ends) ⇒ <code>[dataObject](#dataObject)</code>
Loop trough the list of modifiers and run them in order,
each of them will then edit the data object.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>[dataObject](#dataObject)</code> |  |
| modifiers | <code>Array</code> |  |
| ends | <code>String</code> | Optional modifier name used as stopper |

<a name="Popper.Utils.isModifierEnabled"></a>

#### Utils.isModifierEnabled() ⇒ <code>Boolean</code>
Helper used to know if the given modifier is enabled.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
<a name="Popper.Utils.getSupportedPropertyName"></a>

#### Utils.getSupportedPropertyName(property) ⇒ <code>String</code>
Get the prefixed supported property name

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - prefixed property (camelCase)  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>String</code> | (camelCase) |

<a name="Popper.Utils.setAttributes"></a>

#### Utils.setAttributes(element, styles)
Set the attributes to the given popper

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to apply the attributes to |
| styles | <code>Object</code> | Object with a list of properties and values which will be applied to the element |

<a name="Popper.Utils.isModifierRequired"></a>

#### Utils.isModifierRequired(modifiers, requestingName, requestedName) ⇒ <code>Boolean</code>
Helper used to know if the given modifier depends from another one.<br />
It checks if the needed modifier is listed and enabled.

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  

| Param | Type | Description |
| --- | --- | --- |
| modifiers | <code>Array</code> | list of modifiers |
| requestingName | <code>String</code> | name of requesting modifier |
| requestedName | <code>String</code> | name of requested modifier |

<a name="Popper.Utils.getOppositeVariation"></a>

#### Utils.getOppositeVariation(placement) ⇒ <code>String</code>
Get the opposite placement variation of the given one

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>String</code> - flipped placement variation  

| Param | Type | Description |
| --- | --- | --- |
| placement | <code>String</code> | variation |

<a name="Popper.Utils.clockwise"></a>

#### Utils.clockwise(placement, counter) ⇒ <code>Array</code>
Given an initial placement, returns all the subsequent placements
clockwise (or counter-clockwise).

**Kind**: static method of <code>[Utils](#Popper.Utils)</code>  
**Returns**: <code>Array</code> - placements including their variations  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| placement | <code>String</code> |  | A valid placement (it accepts variations) |
| counter | <code>Boolean</code> | <code>false</code> | Set to true to walk the placements counterclockwise |

<a name="Popper.placements"></a>

### Popper.placements : <code>enum</code>
List of accepted placements to use as values of the `placement` option.<br />
Valid placements are:
- `auto`
- `top`
- `right`
- `bottom`
- `left`

Each placement can have a variation from this list:
- `-start`
- `-end`

Variations are interpreted easily if you think of them as the left to right
written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
is right.<br />
Vertically (`left` and `right`), `start` is top and `end` is bottom.

Some valid examples are:
- `top-end` (on top of reference, right aligned)
- `right-start` (on right of reference, top aligned)
- `bottom` (on bottom, centered)
- `auto-right` (on the side with more space available, alignment depends by placement)

**Kind**: static enum of <code>[Popper](#Popper)</code>  
**Read only**: true  
<a name="Popper.update"></a>

### Popper.update()
Updates the position of the popper, computing the new offsets and applying
the new style.<br />
Prefer `scheduleUpdate` over `update` because of performance reasons.

**Kind**: static method of <code>[Popper](#Popper)</code>  
<a name="Popper.destroy"></a>

### Popper.destroy()
Destroy the popper

**Kind**: static method of <code>[Popper](#Popper)</code>  
<a name="Popper.enableEventListeners"></a>

### Popper.enableEventListeners()
It will add resize/scroll events and start recalculating
position of the popper element when they are triggered.

**Kind**: static method of <code>[Popper](#Popper)</code>  
<a name="Popper.disableEventListeners"></a>

### Popper.disableEventListeners()
It will remove resize/scroll events and won't recalculate popper position
when they are triggered. It also won't trigger onUpdate callback anymore,
unless you call `update` method manually.

**Kind**: static method of <code>[Popper](#Popper)</code>  
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
| data.offsets.arrow | <code>Object</code> | `top` and `left` offsets, only one of them will be different from 0 |

<a name="referenceObject"></a>

## referenceObject
The `referenceObject` is an object that provides an interface compatible with Popper.js
and lets you use it as replacement of a real DOM node.<br />
You can use this method to position a popper relatively to a set of coordinates
in case you don't have a DOM node to use as reference.

```
new Popper(referenceObject, popperNode);
```

NB: This feature isn't supported in Internet Explorer 10

**Kind**: global variable  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data.getBoundingClientRect | <code>function</code> | A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method. |
| data.clientWidth | <code>number</code> | An ES6 getter that will return the width of the virtual reference element. |
| data.clientHeight | <code>number</code> | An ES6 getter that will return the height of the virtual reference element. |

<a name="modifiers"></a>

## modifiers : <code>object</code>
Modifiers are plugins used to alter the behavior of your poppers.<br />
Popper.js uses a set of 9 modifiers to provide all the basic functionalities
needed by the library.

Usually you don't want to override the `order`, `fn` and `onLoad` props.
All the other properties are configurations that could be tweaked.

**Kind**: global namespace  

* [modifiers](#modifiers) : <code>object</code>
    * [~shift](#modifiers..shift)
        * [.order](#modifiers..shift.order)
        * [.enabled](#modifiers..shift.enabled)
        * [.fn](#modifiers..shift.fn)
    * [~offset](#modifiers..offset)
        * [.order](#modifiers..offset.order)
        * [.enabled](#modifiers..offset.enabled)
        * [.fn](#modifiers..offset.fn)
        * [.offset](#modifiers..offset.offset)
    * [~preventOverflow](#modifiers..preventOverflow)
        * [.order](#modifiers..preventOverflow.order)
        * [.enabled](#modifiers..preventOverflow.enabled)
        * [.fn](#modifiers..preventOverflow.fn)
        * [.priority](#modifiers..preventOverflow.priority)
        * [.padding](#modifiers..preventOverflow.padding)
        * [.boundariesElement](#modifiers..preventOverflow.boundariesElement)
    * [~keepTogether](#modifiers..keepTogether)
        * [.order](#modifiers..keepTogether.order)
        * [.enabled](#modifiers..keepTogether.enabled)
        * [.fn](#modifiers..keepTogether.fn)
    * [~arrow](#modifiers..arrow)
        * [.order](#modifiers..arrow.order)
        * [.enabled](#modifiers..arrow.enabled)
        * [.fn](#modifiers..arrow.fn)
        * [.element](#modifiers..arrow.element)
    * [~flip](#modifiers..flip)
        * [.order](#modifiers..flip.order)
        * [.enabled](#modifiers..flip.enabled)
        * [.fn](#modifiers..flip.fn)
        * [.behavior](#modifiers..flip.behavior)
        * [.padding](#modifiers..flip.padding)
        * [.boundariesElement](#modifiers..flip.boundariesElement)
    * [~inner](#modifiers..inner)
        * [.order](#modifiers..inner.order)
        * [.enabled](#modifiers..inner.enabled)
        * [.fn](#modifiers..inner.fn)
    * [~hide](#modifiers..hide)
        * [.order](#modifiers..hide.order)
        * [.enabled](#modifiers..hide.enabled)
        * [.fn](#modifiers..hide.fn)
    * [~applyStyle](#modifiers..applyStyle)
        * [.order](#modifiers..applyStyle.order)
        * [.enabled](#modifiers..applyStyle.enabled)
        * [.fn](#modifiers..applyStyle.fn)
        * [.onLoad](#modifiers..applyStyle.onLoad)
        * [.gpuAcceleration](#modifiers..applyStyle.gpuAcceleration)

<a name="modifiers..shift"></a>

### modifiers~shift
Modifier used to shift the popper on the start or end of its reference
element.<br />
It will read the variation of the `placement` property.<br />
It can be one either `-end` or `-start`.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~shift](#modifiers..shift)
    * [.order](#modifiers..shift.order)
    * [.enabled](#modifiers..shift.enabled)
    * [.fn](#modifiers..shift.fn)

<a name="modifiers..shift.order"></a>

#### shift.order
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>100</code> | Index used to define the order of execution |

<a name="modifiers..shift.enabled"></a>

#### shift.enabled
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..shift.fn"></a>

#### shift.fn
**Kind**: static property of <code>[shift](#modifiers..shift)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..offset"></a>

### modifiers~offset
The `offset` modifier can shift your popper on both its axis.

It accepts the following units:
- `px` or unitless, interpreted as pixels
- `%` or `%r`, percentage relative to the length of the reference element
- `%p`, percentage relative to the length of the popper element
- `vw`, CSS viewport width unit
- `vh`, CSS viewport height unit

For length is intended the main axis relative to the placement of the popper.<br />
This means that if the placement is `top` or `bottom`, the length will be the
`width`. In case of `left` or `right`, it will be the height.

You can provide a single value (as `Number` or `String`), or a pair of values
as `String` divided by a comma or one (or more) white spaces.<br />
The latter is a deprecated method because it leads to confusion and will be
removed in v2.<br />
Additionally, it accepts additions and subtractions between different units.
Note that multiplications and divisions aren't supported.

Valid examples are:
```
10
'10%'
'10, 10'
'10%, 10'
'10 + 10%'
'10 - 5vh + 3%'
'-10px + 5vh, 5px - 6%'
```

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~offset](#modifiers..offset)
    * [.order](#modifiers..offset.order)
    * [.enabled](#modifiers..offset.enabled)
    * [.fn](#modifiers..offset.fn)
    * [.offset](#modifiers..offset.offset)

<a name="modifiers..offset.order"></a>

#### offset.order
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>200</code> | Index used to define the order of execution |

<a name="modifiers..offset.enabled"></a>

#### offset.enabled
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..offset.fn"></a>

#### offset.fn
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..offset.offset"></a>

#### offset.offset
**Kind**: static property of <code>[offset](#modifiers..offset)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| offset | <code>Number</code> \| <code>String</code> | <code>0</code> | The offset value as described in the modifier description |

<a name="modifiers..preventOverflow"></a>

### modifiers~preventOverflow
Modifier used to prevent the popper from being positioned outside the boundary.

An scenario exists where the reference itself is not within the boundaries.<br />
We can say it has "escaped the boundaries" — or just "escaped".<br />
In this case we need to decide whether the popper should either:

- detach from the reference and remain "trapped" in the boundaries, or
- if it should ignore the boundary and "escape with its reference"

When `escapeWithReference` is set to`true` and reference is completely
outside its boundaries, the popper will overflow (or completely leave)
the boundaries in order to remain attached to the edge of the reference.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~preventOverflow](#modifiers..preventOverflow)
    * [.order](#modifiers..preventOverflow.order)
    * [.enabled](#modifiers..preventOverflow.enabled)
    * [.fn](#modifiers..preventOverflow.fn)
    * [.priority](#modifiers..preventOverflow.priority)
    * [.padding](#modifiers..preventOverflow.padding)
    * [.boundariesElement](#modifiers..preventOverflow.boundariesElement)

<a name="modifiers..preventOverflow.order"></a>

#### preventOverflow.order
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>300</code> | Index used to define the order of execution |

<a name="modifiers..preventOverflow.enabled"></a>

#### preventOverflow.enabled
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..preventOverflow.fn"></a>

#### preventOverflow.fn
**Kind**: static property of <code>[preventOverflow](#modifiers..preventOverflow)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

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
| padding | <code>number</code> | <code>5</code> | Amount of pixel used to define a minimum distance between the boundaries and the popper this makes sure the popper has always a little padding between the edges of its container |

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
    * [.fn](#modifiers..keepTogether.fn)

<a name="modifiers..keepTogether.order"></a>

#### keepTogether.order
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>400</code> | Index used to define the order of execution |

<a name="modifiers..keepTogether.enabled"></a>

#### keepTogether.enabled
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..keepTogether.fn"></a>

#### keepTogether.fn
**Kind**: static property of <code>[keepTogether](#modifiers..keepTogether)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..arrow"></a>

### modifiers~arrow
This modifier is used to move the `arrowElement` of the popper to make
sure it is positioned between the reference element and its popper element.
It will read the outer size of the `arrowElement` node to detect how many
pixels of conjuction are needed.

It has no effect if no `arrowElement` is provided.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~arrow](#modifiers..arrow)
    * [.order](#modifiers..arrow.order)
    * [.enabled](#modifiers..arrow.enabled)
    * [.fn](#modifiers..arrow.fn)
    * [.element](#modifiers..arrow.element)

<a name="modifiers..arrow.order"></a>

#### arrow.order
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>500</code> | Index used to define the order of execution |

<a name="modifiers..arrow.enabled"></a>

#### arrow.enabled
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..arrow.fn"></a>

#### arrow.fn
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..arrow.element"></a>

#### arrow.element
**Kind**: static property of <code>[arrow](#modifiers..arrow)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>String</code> \| <code>HTMLElement</code> | <code>&#x27;[x-arrow]&#x27;</code> | Selector or node used as arrow |

<a name="modifiers..flip"></a>

### modifiers~flip
Modifier used to flip the popper's placement when it starts to overlap its
reference element.

Requires the `preventOverflow` modifier before it in order to work.

**NOTE:** this modifier will interrupt the current update cycle and will
restart it if it detects the need to flip the placement.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~flip](#modifiers..flip)
    * [.order](#modifiers..flip.order)
    * [.enabled](#modifiers..flip.enabled)
    * [.fn](#modifiers..flip.fn)
    * [.behavior](#modifiers..flip.behavior)
    * [.padding](#modifiers..flip.padding)
    * [.boundariesElement](#modifiers..flip.boundariesElement)

<a name="modifiers..flip.order"></a>

#### flip.order
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>600</code> | Index used to define the order of execution |

<a name="modifiers..flip.enabled"></a>

#### flip.enabled
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..flip.fn"></a>

#### flip.fn
**Kind**: static property of <code>[flip](#modifiers..flip)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

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
| padding | <code>number</code> | <code>5</code> | The popper will flip if it hits the edges of the `boundariesElement` |

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
    * [.fn](#modifiers..inner.fn)

<a name="modifiers..inner.order"></a>

#### inner.order
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>700</code> | Index used to define the order of execution |

<a name="modifiers..inner.enabled"></a>

#### inner.enabled
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>false</code> | Whether the modifier is enabled or not |

<a name="modifiers..inner.fn"></a>

#### inner.fn
**Kind**: static property of <code>[inner](#modifiers..inner)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..hide"></a>

### modifiers~hide
Modifier used to hide the popper when its reference element is outside of the
popper boundaries. It will set a `x-out-of-boundaries` attribute which can
be used to hide with a CSS selector the popper when its reference is
out of boundaries.

Requires the `preventOverflow` modifier before it in order to work.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~hide](#modifiers..hide)
    * [.order](#modifiers..hide.order)
    * [.enabled](#modifiers..hide.enabled)
    * [.fn](#modifiers..hide.fn)

<a name="modifiers..hide.order"></a>

#### hide.order
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>800</code> | Index used to define the order of execution |

<a name="modifiers..hide.enabled"></a>

#### hide.enabled
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..hide.fn"></a>

#### hide.fn
**Kind**: static property of <code>[hide](#modifiers..hide)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

<a name="modifiers..applyStyle"></a>

### modifiers~applyStyle
Applies the computed styles to the popper element.

All the DOM manipulations are limited to this modifier. This is useful in case
you want to integrate Popper.js inside a framework or view library and you
want to delegate all the DOM manipulations to it.

Just disable this modifier and define you own to achieve the desired effect.

**Kind**: inner property of <code>[modifiers](#modifiers)</code>  

* [~applyStyle](#modifiers..applyStyle)
    * [.order](#modifiers..applyStyle.order)
    * [.enabled](#modifiers..applyStyle.enabled)
    * [.fn](#modifiers..applyStyle.fn)
    * [.onLoad](#modifiers..applyStyle.onLoad)
    * [.gpuAcceleration](#modifiers..applyStyle.gpuAcceleration)

<a name="modifiers..applyStyle.order"></a>

#### applyStyle.order
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| order | <code>number</code> | <code>900</code> | Index used to define the order of execution |

<a name="modifiers..applyStyle.enabled"></a>

#### applyStyle.enabled
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| enabled | <code>Boolean</code> | <code>true</code> | Whether the modifier is enabled or not |

<a name="modifiers..applyStyle.fn"></a>

#### applyStyle.fn
**Kind**: static property of <code>[applyStyle](#modifiers..applyStyle)</code>  
**Properties**

| Type |
| --- |
| <code>[ModifierFn](#ModifierFn)</code> | 

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

<a name="ModifierFn"></a>

## ModifierFn(data, options) ⇒ <code>[dataObject](#dataObject)</code>
Modifier function, each modifier can have a function of this type assigned
to its `fn` property.<br />
These functions will be called on each update, this means that you must
make sure they are performant enough to avoid performance bottlenecks.

**Kind**: global function  
**Returns**: <code>[dataObject](#dataObject)</code> - The data object, properly modified  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>[dataObject](#dataObject)</code> | The data object generated by `update` method |
| options | <code>Object</code> | Modifiers configuration and options |

<a name="onUpdateCallback"></a>

## onUpdateCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

<a name="onCreateCallback"></a>

## onCreateCallback : <code>function</code>
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| data | <code>[dataObject](#dataObject)</code> | 

