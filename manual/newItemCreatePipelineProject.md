# US_00.002 | New Item > Create Pipeline Project

## TC_00.002.01 | Verify the new pipeline is created if providing a unique name
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).

**Steps:**
1. Click on the 'New Item' link in the side menu.
2. Enter an item name into the input field (e.g. 'Item_1').
3. Select Pipeline item type;
4. Click on the 'OK' button.
5. Click on the 'Save' button.
6. Verify the Pipeline was created.
   - Assert that the pipeline name in the header matches `pipeline_name`
   - Assert that the URL contains `/job/${pipeline_name}/`




## TC_00.002.02 | Verify the display of the error message if item name already exists 
**Preconditions:**
1. User is logged in.
2. User is on main page (dashboard).
3. A Freestyle project with a unique name was created (e.g. 'Item_1).

**Precondition steps: 'Creating a Freestyle project'**
1. Click on the 'New Item' link.
2. Enter an item name into the input field (e.g. 'Item_1').
3. Select the Freestyle project item type;
4. Click on the 'OK' button.
5. Click on the 'Save' button.

**Steps:**
1. Click on the 'New Item' link in the side menu.
2. Enter the previously used item name into the input field (e.g. 'Item_1').
3. Verify the display of the error message: '» A job already exists with the name'.