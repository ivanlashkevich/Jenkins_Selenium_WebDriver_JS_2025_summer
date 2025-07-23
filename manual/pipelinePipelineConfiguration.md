# US_02.004 | Pipeline > Pipeline Configuration

## TC_02.004.01 | Verify a pipeline can be disabled/enabled with the help of Enable/Disable toggle
**Preconditions:**
1. User is logged in.
2. A Pipeline project was created.
3. User is on the Configure page.

**Precondition steps: Creatting a Pipeline project**
1. Click on the 'New Item' link in the side menu.
2. Enter an item name into the input field (e.g. 'Item_1').
3. Select Pipeline item type;
4. Click on the 'OK' button.

**Steps:**
1. Click on the 'Enabled' toggle.
2. Ensure the 'Disabled' toggle is displayed.
3. Click on the 'Save' button.
4. Verify the Pipeline is disabled.
5. Click on the 'Enable' button.
6. Click on the 'Configure' link in the side menu.
7. Verify the 'Enabled' toggle is displayed.




## TC_02.004.02 | Verify the choice of writing the pipeline directly in Jenkins, using the editor
**Preconditions:**
1. User is logged in.
2. A Pipeline project was created.
3. User is on the Configure page.

**Steps:**
1. Click on the 'Pipeline' link in the side menu.
2. Select the 'Pipeline script' option in the 'Definition' dropdown.
3. Select the 'Scripted Pipeline' option in the 'Script' dropdown.
4. Click on the 'Save' button.
5. Click on the 'Configure' link in the side menu.
6. Click on the 'Pipeline' link in the side menu.
7. Verify the 'Pipeline script' option is selected.




## TC_02.004.03 | Verify the choice of linking the pipeline to a Jenkinsfile stored in source control
**Preconditions:**
1. User is logged in.
2. A Pipeline project was created.
3. User is on the Configure page.

**Steps:**
1. Click on the 'Pipeline' link in the side menu.
2. Select the 'Pipeline script from SCM' option in the 'Definition' dropdown.
3. Select the 'Git' option in the 'SCM' dropdown.
4. Enter Git repository URL into the 'Repository URL' input field.
5. Click on the 'Save' button.
6. Click on the 'Configure' link in the side menu.
7. Click on the 'Pipeline' link in the side menu.
8. Verify the 'Pipeline script form SCM' option is selected and the project repository URL is visible.