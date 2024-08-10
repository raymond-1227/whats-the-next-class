# what's the next class
What's the next class? Stop asking me, just take a glance!

## About
I made this project since I have been really annoyed by the school class table website, although according to the software it is being kept up-to-date, but the developer of the system didn't even try to bother making the UI/UX better but rather keeping the 90s web design look.

This is just one thing, the main reason is still the fact that class table completely changes on every new semester, meaning I would have to look at the horribly-designed school class table, especially that the text would be around 1px on phone since... like I said, they never updated the design, therefore RWD is never implemented. Also it takes too much time to find the specific class for the day, so instead, I made my own version that only displays your current/previous and next class at once.

## How To Use
### Use the Template
The template file is `data-example.json` for English users, you can modify the text into your own language, then rename it to `data.json` for the script to fetch data from.
### Import your Time Schedule
Go to `data.json` and modify the time for each day **in the exact order**, including the start and the end of your class time. For example, if your class starts `08:00` and ends `08:50`, put them in the order like this:
```js
const timeSchedule = [ 08:00, 08:50, 09:00, 09:50, "... etc" ]
```
### Import your Class Table
Go to `data.json` and modify the class names for each day **in the exact order**.
