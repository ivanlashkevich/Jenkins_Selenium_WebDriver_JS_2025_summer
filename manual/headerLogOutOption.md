# US_14.003 | Header > Log out option

## TC_14.003.01 | Verify the display of the 'log out' link in the application header after the User logs in
**Preconditions:**
User is on the Login page.

**Steps:**
1. Enter a username into the input field.
2. Enter a password.
3. Check the 'Keep me signed in' checkbox.
4. Click on the 'Sign in' button.
5. Verify:
    - the 'log out' link is displayed in the top right;
    - the 'log out' link is enabled.




## TC_14.003.02 | Verify the current session on the server is terminated after the 'log out' link clicked 
**Preconditions:**
1. User is logged in.
2. User is on the Dashboard page.

**Steps:**
1. Click on the 'log out' link in the top right.
2. Attempt to navigate to the Dashboard page.
3. Verify User is redirected to the Login page when accessing the Dashboard page (e.g. http://localhost:8080);