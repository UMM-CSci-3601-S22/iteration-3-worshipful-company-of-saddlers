# To-Do List <!-- omit in toc -->

- [Known Issues:](#known-issues)
- [Areas for Improvement:](#areas-for-improvement)

## Known Issues:
* Sometimes, pantry items are doubled in the pantry list. The API call returns one of each, but displays two of each.
* Display of 'GENERATE SHOPPING LIST' button is not visually appealing.
* Some mat-snackbars do not disappear after a predetermined amount of time
* Shopping list is not in any predetermined order
* Toolbar is cut-off on mobile screens
* Slow Functions:
  * Adding a item to the pantry
  * Loading pantry and product lists
* Pantry does not update to edited products

## Areas for Improvement:
* Separate the shopping list by store
* Add clear shopping list button
* Add karma tests to increase client-side coverage
* Add Java tests to increase server-side coverage
* Shopping list uses java algorithms, while it would be faster to generate through mongo queries
* Pantry list aggregation uses java algorithms, while it would be faster to generate using mongo queries
  * Pantry list is using two databases
* Changing add and delete functions to allow quantities to be added or removed at once
