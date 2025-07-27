# US_08.002 | Build history > Delete Build

## TC_08.002.01 | Verify the Build info disappears from the Build container block after deleting a build
**Preconditions:**
1. User is logged in.
2. A FreestyleProject project was created.
3. A new build was performed.
4. User is on the Project page.

**Steps:**
1. Click on the project build link in the 'Build History' block.
2. Click on the 'Delete build' link in the side menu.
3. Click on the 'Delete' button.
4. Verify the build is no longer shown in the 'Build History' block.




## TC_08.002.02 | Verify user can delete a build from the Build History page
**Preconditions:**
1. User is logged in.
2. A FreestyleProject project was created.
3. A new build was performed.
4. User is on the Project page.

**Steps:**
1. Hover over the 'Dashboard' link in the breadcrumbs.
2. Click on the appeared chevron.
3. Click on the 'Build History' dropdown option.
4. Hover over the project build link in the 'Build History of Jenkins' table.
5. Click on the appeared chevron next to the build.
6. Click on the 'Delete build' dropdown option.
7. Click on the 'Delete' button.
8. Verify the build is no longer displayed in the 'Build History' block.