# US_08.001 | Build history > Start to build a project

## TC_08.001.01 | Verify user can schedule a build from the Dashboard page
**Preconditions:**
1. User is logged in.
2. A FreestyleProject project and a Pipeline were created.
3. User is on the Dashboard page.

**Steps (performed sequentially for both projects: Freestyle project, Pipeline):**
1. Click on the 'Schedule a build' link for the Freestyle project in the job table.
2. Ensure the display of the 'Build scheduled' notification.
3. Click on the 'Build History' link in the side menu.
4. Verify the project build is displayed in the 'Build History of Jenkins' table.
5. Click on the Jenkins logo.




## TC_08.001.02 | Verify user can trigger a project build from the Project page using "Build Now" option
**Preconditions:**
1. User is logged in.
2. A FreestyleProject project and a Pipeline were created.
3. User is on the Dashboard page.

**Steps (performed sequentially for both projects: Freestyle project, Pipeline):**
1. Click on the project link in the job table.
2. Click on the 'Build Now' link in the side menu.
3. Ensure the display of the 'Build scheduled' notification.
4. Verify the project build is displayed in the 'Build History' section.
5. Click on the Jenkins logo.




## TC_08.001.03 | Verify the information about the new build appears on the Build history page
**Preconditions:**
1. User is logged in.
2. A FreestyleProject project and a Pipeline were created.
3. User is on the Dashboard page.

**Steps:**
1. Click on the 'Schedule a build' link for the Freestyle project in the job table.
2. Click on the 'Schedule a build' link for the Pipeline in the job table.
3. Click on the 'Build History' link in the side menu.
4. Verify the project builds are displayed in the 'Build History of Jenkins' table.