# US_01.002 | FreestyleProject > Rename Project

## TC_01.002.01 | Verify a project can be renamed from the Project page
**Preconditions:**
1. User is logged in.
2. A Freestyle project was created.
3. User is on the Project page.

**Steps:**
1. Click on the 'Rename' link in the side menu.
2. Clear the 'New Name' input field.
3. Enter a new item name.
4. Click on the 'Rename' button.
5. Verify the Freestyle project was renamed.




## TC_01.002.02 | Verify the display of the renamed project on the Dashboard page
**Preconditions:**
1. User is logged in.
2. A Freestyle project was created.
3. User is on the Project page.

**Steps:**
1. Click on the 'Rename' link in the side menu.
2. Clear the 'New Name' input field.
3. Enter a new item name.
4. Click on the 'Rename' button.
5. Click on the Jenkins logo.
6. Verify the renamed project is displayed in the job table on the Dashboard page.




## TC_01.002.03 | Verify the Error display when the new Project name is invalid
**Preconditions:**
1. User is logged in.
2. A Freestyle project was created.
3. User is on the Project page.

**Steps:**
1. Click on the 'Rename' link in the side menu.
2. Clear the 'New Name' input field.
3. Enter an invalid item name (e.g. 'Item#1').
4. Verify the inline validation message 'is an unsafe character' is displayed below the input.