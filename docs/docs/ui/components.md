# components

All components are styled with tailwindcss and built to easily be edited to fit your projects needs. 

<!-- ## AccountToggle

Used to display the current user and to toggle the secondary navigation for account related links and buttons (account, settings, log out, etc.).

#### Importing AccountToggle
```tsx
import AccountToggle from "root/components/AccountToggle/AccountToggle";
```

#### Using AccountToggle
```tsx
<AccountToggle>
  //
  // Slot
  //
</AccountToggle>
```
<br />
<br /> -->

## AdminBody

Used to apply padding to match with the ```AdminHeader``` Component.

#### Importing AdminBody
```tsx
import AdminBody from "root/components/AdminBody/AdminBody";
```

#### Using AdminBody
```tsx
<AdminBody>
  //
  // Slot
  //
</AdminBody>
```
<br />
<br />

## AdminFooter

Used as a mobile footer navigation. Nest it within the ```AdminMain``` component for proper spacing, and use the ```BtnMobileMenu``` component for matching prestyled buttons.

#### Importing AdminFooter
```tsx
import  from "root/components/AdminFooter/AdminFooter";
```

#### Using AdminFooter
```tsx
<AdminFooter>
  //
  // Slot
  //
</AdminFooter>
```
<br />

#### AdminFooterProps
**hideMenuBtn:** ```boolean``` ```optional``` \
Hide the toggle menu button

<br />
<br />

## AdminHeader

Used as a header within ```AdminMain``` and shares common padding with ```AdminBody```. Other related components are ```AdminHeaderBtnWrap```, ```AdminHeaderTitle```, and ```AdminHeaderSubtitle```.

#### Importing AdminHeader
```tsx
import AdminHeader from "root/components/AdminHeader/AdminHeader";
```

#### Using AdminHeader
```tsx
<AdminHeader
   v-slots={{btns: () => <ExampleComponent />}} // Used for the button slot
>
  //
  // Default slot
  //
</AdminHeader>
```
<br />
<br />

## AdminHeaderBtnWrap

Used to wrap the ```Btn``` component within ```AdminHeader``` (or any variation of ```Btn```, such as ```BtnSmall```).

#### Importing AdminHeaderBtnWrap
```tsx
import AdminHeaderBtnWrap from "root/components/AdminHeaderBtnWrap/AdminHeaderBtnWrap";
```

#### Using AdminHeaderBtnWrap
```tsx
<AdminHeaderBtnWrap>
  //
  // Slot
  //
</AdminHeaderBtnWrap>
```
<br />
<br />

## AdminHeaderSubtitle
Used as a prestyle ```AdminHeader``` subtitle.

#### Importing AdminHeaderSubtitle
```tsx
import AdminHeaderSubtitle from "root/components/AdminHeaderSubtitle/AdminHeaderSubtitle";
```

#### Using AdminHeaderSubtitle
```tsx
<AdminHeaderSubtitle>
  Subtitle Label
</AdminHeaderSubtitle>
```
<br />
<br />

## AdminHeaderTitle
Used as a prestyle ```AdminHeader``` title.

#### Importing AdminHeaderTitle
```tsx
import AdminHeaderTitle from "root/components/AdminHeaderTitle/AdminHeaderTitle";
```

#### Using AdminHeaderTitle
```tsx
<AdminHeaderTitle>
  Title Label
</AdminHeaderTitle>
```
<br />
<br />

## AdminMain
Used to nest ```AdminFooter``` with appropriate spacing for mobile.

#### Importing AdminMain
```tsx
import AdminMain from "root/components/AdminMain/AdminMain";
```

#### Using AdminMain
```tsx
<AdminMain>
  //
  // Slot
  //
</AdminMain>
```
<br />
<br />

## AdminShell
Used as a wrapper component within your ```App.tsx``` file to apply proper layout styling. It's direct children components are ```AdminSidebar``` and ```AdminMain```.

#### Importing AdminShell
```tsx
import AdminShell from "root/components/AdminShell/AdminShell";
```

#### Using AdminShell
```tsx
<AdminShell>
  //
  // Slot
  //
</AdminShell>
```
<br />
<br />

## AdminSidebar
Used as the admin navigation sidebar.

#### Importing AdminSidebar
```tsx
import AdminSidebar from "root/components/AdminSidebar/AdminSidebar";
```

#### Using AdminSidebar
```tsx
<AdminSidebar>
  //
  // Slot
  //
</AdminSidebar>
```
<br />
<br />

## Btn
An unstyled link (or button) component with props to be used as a base for other link components. It can also be used within your project if you want to apply custom styling to an individual link. 

Depending on which props you use, this component will either be an ```<a>```, a ```<router-link>```, or a ```<button>``` element.

#### Importing Btn
```tsx
import Btn from "root/components/Btn/Btn";
```

#### Using Btn
```tsx
<Btn
  icon={faArrowRight}
  label="Add New"
  reverse={true}
  to={{name: routeNames.edit}}
>
  //
  // Slot
  //
</Btn>
```
<br />

#### BtnProps
**click:** ```function``` ```Optional``` \
Passing down a click function will make this component a ```<button>``` element
<br/>

**disabled:** ```Boolean``` ```Optional``` \
Makes it non-clickable and opaque
<br/>

**icon:** ```FontAwesomeIcon``` ```Object``` ```Optional``` \
A FontAwesomeIcon icon
<br/>

**id:** ```String``` ```Optional``` \
Component Id
<br/>

**label:** ```String``` ```Optional```\
The component text field
<br/>

**reverse:** ```Boolean``` ```Optional```\
Reverse the order or the icon and label 
<br/>

**to:** ```RouteLocationRaw``` ```Optional```\
Passing down a route will make this component a ```<router-link>``` element 
<br/>

**toExternal:** ```String``` ```Optional```\
Passing down an external link will make this an ```<a>``` element that opens a new tab 
<br/>

**type:** ```String``` ```Optional``` \
Type applies to a ```<button>``` element when using the click prop 
<br/>
<br/>

We've created multiple prestyled Btn components to speed up the development process. They all share props with the ```Btn``` Component, although some only utilize a few.

### BtnIcon

A lighter version of the ```Btn``` component that displays only an icon.

#### Importing BtnIcon
```tsx
import BtnIcon from "root/components/Btn/BtnIcon";
```

### BtnLogin

A button that is styled for the ```Login``` component.

#### Importing BtnLogin
```tsx
import BtnLogin from "root/components/Btn/BtnLogin";
```

### BtnMobileMenu

A button that is styled to match the menu toggle button in the ```Menu``` component.

#### Importing BtnMobileMenu
```tsx
import BtnMobileMenu from "root/components/Btn/BtnMobileMenu";
```

### BtnPrimary

A styled button to be used as the primary button.

#### Importing BtnPrimary
```tsx
import BtnPrimary from "root/components/Btn/BtnPrimary";
```

### BtnSecondary

A styled button to be used as the secondary button, in contrast with the primary button.

#### Importing BtnSecondary
```tsx
import BtnSecondary from "root/components/Btn/BtnSecondary";
```

### BtnSmall

A smaller version of ```Btn```.

#### Importing BtnSmall
```tsx
import BtnSmall from "root/components/Btn/BtnSmall";
```

### BtnSmallPrimary

A smaller version of ```BtnPrimary```.

#### Importing BtnSmallPrimary
```tsx
import BtnSmallPrimary from "root/components/Btn/BtnSmallPrimary";
```

### BtnSmallSecondary

A smaller version of ```BtnSecondary```.

#### Importing BtnSmallSecondary
```tsx
import BtnSmallSecondary from "root/components/Btn/BtnSmallSecondary";
```

### BtnSubmit

A submit button to be used with forms.

#### Importing BtnSubmit
```tsx
import BtnSubmit from "root/components/Btn/BtnSubmit";
```

<br />
<br />



<!-- ## Dropdown
A prestyled select element.

#### Importing Dropdown
```tsx
import Dropdown from "root/components/Dropdown/Dropdown";
```

#### Using Dropdown
```tsx
<Dropdown>
  //
  // Slot
  //
</Dropdown>
```
<br />
<br /> -->

## FieldCheckbox
A checkbox component used for forms.

#### Importing FieldCheckbox
```tsx
import FieldCheckbox from "root/components/FieldCheckbox/FieldCheckbox";
```

#### Using FieldCheckbox
```tsx
<FieldCheckbox
  label="Teams"
  name="teams"
  options=[
    {label: "Red", value: "red"},
    {label: "Blue", value: "blue"}
  ]
  val={'red'}
/>
```
<br />

#### FieldCheckboxProps

**label:** ```String``` ```Optional``` \
Checkbox label
<br />

**name:** ```String``` ```Required``` \
Checkbox name
<br />

**options:** ```FieldCheckboxOption``` ```Array``` ```Required``` \
Checkbox options
<br />

**unstyled:** ```Boolean``` ```Optional``` \
Removes component styling 
<br />
<br />

#### FieldCheckboxOption
**label:** ```String``` ```Required``` \
Option label 
<br />

**value:** ```Any``` ```Required``` \
Option value

<br />
<br />

## FieldError
A styled error message for form fields.

#### Importing FieldError
```tsx
import FieldError from "root/components/FieldError/FieldError";
```

#### Using FieldError
```tsx
<FieldError>
  //
  // Slot
  //
</FieldError>
```
<br />
<br />

## FieldInput
A styled input component used for forms.

#### Importing FieldInput
```tsx
import FieldInput from "root/components/FieldInput/FieldInput";
```

#### Using FieldInput
```tsx
<FieldInput
  label="Email Address"
  name="email"
  type="email"
/>
```
<br />

#### FieldInputProps
**label:** ```String``` ```Optional``` \
Input label
<br />

**name:** ```String``` ```Required``` \
Input name
<br />

**type:** ```String``` ```Default: "text"``` ```Optional``` \
Input type
<br />

**unstyled:** ```Boolean``` ```Optional``` \
Removes component styling 
<br />

<br />
<br />

## FieldLabel
A label component meant to compliment form fields.

#### Importing FieldLabel
```tsx
import FieldLabel from "root/components/FieldLabel/FieldLabel";
```

#### Using FieldLabel
```tsx
<FieldLabel>
  //
  // Slot
  //
</FieldLabel>
```
<br />
<br />

## FieldRadio
A styled radio component for forms.

#### Importing FieldRadio
```tsx
import FieldRadio from "root/components/FieldRadio/FieldRadio";
```

#### Using FieldRadio
```tsx
<FieldRadio
  label="Teams"
  name="teams"
  options=[
    {label: "Red", value: "red"},
    {label: "Blue", value: "blue"}
  ]
  val={'red'}
/>
```
<br />

#### FieldRadioProps

**label:** ```String``` ```Optional``` \
Radio label
<br />

**name:** ```String``` ```Required``` \
Radio name
<br />

**options:** ```FieldRadioOption``` ```Array``` ```Required``` \
Radio options
<br />

**unstyled:** ```Boolean``` ```Optional``` \
Removes component styling 
<br />
<br />

#### FieldRadioOption
**label:** ```String``` ```Required``` \
Option label 
<br />

**value:** ```Any``` ```Required``` \
Option value


<br />
<br />

## FieldSelect
A styled select component for forms.

#### Importing FieldSelect
```tsx
import FieldSelect from "root/components/FieldSelect/FieldSelect";
```

#### Using FieldSelect
```tsx
<FieldSelect
  label="Experience"
  name="experience"
>
  <select value="1">1 Year</select>
  <select value="2 to 4">2 - 4 Years</select>
  <select value="5+">5 Years +</select>
</FieldSelect>
```
<br />

#### FieldSelectProps

**label:** ```String``` ```Optional``` \
Select label
<br />

**name:** ```String``` ```Required``` \
Select name
<br />

**unstyled:** ```Boolean``` ```Optional``` \
Removes component styling 

<br />
<br />

## FieldTextarea
A styled textarea component for forms.

#### Importing FieldTextarea
```tsx
import FieldTextarea from "root/components/FieldTextarea/FieldTextarea";
```

#### Using FieldTextarea
```tsx
<FieldTextarea 
  label="Comments"
  name="comments"
/>
```
<br />

#### FieldTextareaProps

**label:** ```String``` ```Optional``` \
Textarea label
<br />

**name:** ```String``` ```Required``` \
Textarea name
<br />

**unstyled:** ```Boolean``` ```Optional``` \
Removes component styling 

<br />
<br />

## LoginError
A failed message component.

#### Importing LoginError
```tsx
import LoginError from "root/components/LoginError/LoginError";
```

#### Using LoginError
```tsx
<LoginError />
```
<br />
<br />

## Menu
A menu component for mobile and tablet screen sizes.

The route for the menu page works by default, as does the back button.

#### Importing Menu
```tsx
import Menu from "root/components/Menu/Menu";
```

#### Using 
```tsx
<Menu>
  //
  // Slot
  //
</Menu>
```
<br />
<br />

<!-- ## ModelTable
A table component for your models.

#### Importing ModelTable
```tsx
import ModelTable from "root/components/ModelTable/ModelTable";
```

#### Using ModelTable
```tsx
<ModelTable>
  //
  // Slot
  //
</ModelTable>
```
<br />
<br /> -->

## Pagination
A sticky pagination component for model pages.

#### Importing Pagination
```tsx
import Pagination from "root/components/Pagination/Pagination";
```

#### Using Pagination
```tsx
<Pagination
  count={data...}
  countBefore={data...}
  goToFirst={goToFirst}
  goToLast={goToLast}
  limit={100}
  next={next}
  prev={prev}
/>
```
<br />

#### PaginationProps

**count:** ```Number``` ```Required``` \
The amount of records you currently have loaded
<br />

**countBefore:** ```Number``` ```Required``` \
The amount of records prior to loading the current record set
<br />

**goToFirst:** ```Function``` ```Required``` \
Go to the first page of the records
<br />

**goToLast:** ```Function``` ```Required``` \
Go to the last page of the records
<br />

**limit:** ```Number``` ```Required``` \
How many records to show per page
<br />

**next:** ```Function``` ```Required``` \
Go to the next page of records
<br />

**prev:** ```Function``` ```Required``` \
Go to the previous page of records

> You can use the [usePagination](/api/ui.html#pagination-2) hooks for premade functions as props, rather than having to make your own.

<br />
<br />

## Pill
An active filter pill component.

#### Importing Pill
```tsx
import Pill from "root/components/Pill/Pill";
```

#### Using Pill
```tsx
<Pill 
  icon={faTag}
  label="To do"
  remove={() => {}}
>
  //
  // Slot
  //  
</Pill>
```
<br />

#### PillProps

**icon:** ```FontAwesomeIcon``` ```Object``` ```Optional``` \
A FontAwesomeIcon icon
<br/>

**iconColor:** ```String``` ```Optional``` \
A custom icon color
<br/>

**label:** ```String``` ```Optional``` \
The component text field
<br/>

**remove:** ```Function``` ```Optional``` \
A function that actives the X icon, and removes the pill components

<br />
<br />

## Search
A search bar component.

#### Importing Search
```tsx
import Search from "root/components/Search/Search";
```

#### Using Search
```tsx
<Search 
  change={() => {}}
  focusOnMount={false}
  placeholder="Search..."
  val={''}
/>
```
<br />

#### SearchProps

**change:** ```Function``` ```Required``` \
The action that happens when a search value is input
<br/>

**focusOnMount:** ```Boolean`` ```Required``` \
Focuses the search input on page load
<br/>

**placeholder:** ```String``` ```Optional``` \
Search bar placeholder text
<br/>

**val:** ```Function``` ```Required``` \
Default search value

<br />
<br />

## SidebarNavItem
A navigation item component. We use this by default in our themes in the ```AdminSidebar``` and ```Menu``` components. The component can be rendered as a ```<button>``` or a ```<router-link>``` depending on the props passed to it.

#### Importing SidebarNavItem
```tsx
import SidebarNavItem from "root/components/SidebarNavItem/SidebarNavItem";
```

#### Using SidebarNavItem
```tsx
<SidebarNavItem>
  //
  // Slot
  //
</SidebarNavItem>
```
<br />

#### SidebarNavItemProps

**click:** ```Function``` ```Optional``` \
The action that happens on click, and this makes the component a ```<button>```
<br/>

**icon:** ```FontAwesomeIcon``` ```Object``` ```Optional``` \
A FontAwesomeIcon icon
<br/>

**id:** ```String``` ```Optional``` \
The component Id
<br/>

**isChild:** ```Boolean``` ```Optional``` \
Styles the component as a sub-nav item
<br/>

**label:** ```String``` ```Optional``` \
The component text field
<br/>

**notification:** ```Number``` ```Optional``` \
An option to pass down notifications
<br/>

**to:** ```RouteLocationRaw``` ```Optional``` \
The route the component should link to, and this makes the component a ```<router-link>```

<br />
<br />

## StateEmpty
An empty state component, to be paired with the ```ModelTable``` component when there are no search results. If no props are passed down, the component will use it's default icon and label.

#### Importing StateEmpty
```tsx
import StateEmpty from "root/components/StateEmpty/StateEmpty";
```

#### Using StateEmpty
```tsx
<StateEmpty />
```
<br/>

**icon:** ```FontAwesomeIcon``` ```Object``` ```Optional``` \
A FontAwesomeIcon icon
<br/>

**label:** ```String``` ```Optional``` \
The component text field

<br />
<br />

## StateLoading
An loading component.

#### Importing StateLoading
```tsx
import StateLoading from "root/components/StateLoading/StateLoading";
```

#### Using StateLoading
```tsx
<StateLoading />
```
<br />
<br />

<!-- ## Tabs
A tab list component.

#### Importing Tabs
```tsx
import Tabs from "root/components/Tabs/Tabs";
```

#### Using Tabs
```tsx
<Tabs>
  //
  // Slot
  //
</Tabs>
```
<br />
<br /> -->

## Wrapper
A wrapper component for consistent horizontal padding.

#### Importing Wrapper
```tsx
import Wrapper from "root/components/Wrapper/Wrapper";
```

#### Using Wrapper
```tsx
<Wrapper>
  //
  // Slot
  //
</Wrapper>
```