# US_00.000 | New Item > Create New item

## TC_00.000.01 | Verify a new item is created via the "New Item" link in the left sidebar
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).

**Steps:**
1. Click on the 'New Item' link in the side menu.
2. Enter an item name into the input field.
3. Select Freestyle project item type;
4. Click on the 'OK' button.
5. Click on the 'Save' button.
6. Verify the Freestyle project was created.




## TC_00.000.02 | Verify a new item is created via the Dashboard dropdown menu
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).

**Steps:**
1. Hover over the dashboard link in the breadcrumbs.
2. Click on the appeared chevron.
3. Click on the '+ New Item' dropdown menu option.
4. Enter an item name into the input field.
5. Select Freestyle project item type;
6. Click on the 'OK' button.
7. Click on the 'Save' button.
8. Verify the Freestyle project was created.




## TC_00.000.03 | Verify item name does not contain any special characters
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).

**Steps:**
1. Click on the 'New Item' link in the side menu.
2. Enter an item name into the input field (e.g. 'Item1').
3. Select the Freestyle project item type.
4. Click the 'OK' button.
5. Click the 'Save' button.
6. Click on the Jenkins home link to return to the dashboard page.
7. Verify the created item's name does not contain any of the following special characters: e.g. !@#$%^&*()+=[]|\\/:;"',.




## TC_00.000.04 | Verify the display of the Error message in case the item name contains special characters
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).

**Steps:**
1. Click on the 'New Item' link in the side menu.
2. Enter an item name into the input field, containing a special character (e.g. 'Item#1').
3. Verify the validation message 'is an unsafe character' appears.