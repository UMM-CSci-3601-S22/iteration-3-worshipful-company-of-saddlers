# CSCI 3601 Iteration Template <!-- omit in toc -->

[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S22/it-1-bletchley-park?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S22/it-1-bletchley-park.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S22/it-1-bletchley-park/alerts/)

- [Development](#development)
  - [Common commands](#common-commands)
- [Key Features](#key-features)
- [Deployment](#deployment)
- [Resources](#resources)
- [Contributors](#contributors)

For shoppers who want an organized pantry and shopping experience, Handy Pantry is a home pantry inventory system that tracks consumption and storage. Unlike pen and paper, our product uses your grocery usage information to automatically generate an up-to-date shopping list.

## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

### Common commands

From the `server` directory:

- `./gradlew run` to start the server
- `./gradlew test` to test the server
- `./gradlew checkstyleMain` to run Checkstyle on the server Java code in the `src/main` folder
- `./gradlew checkstyleTest` to run Checkstyle on the server Java code in the `src/test` folder
- `./gradlew check` will run both the tests and Checkstyle in one command

From the `client` directory:

- `ng serve` to run the client
- `ng test` to test the client
  - Or `ng test --no-watch --code-coverage` to run the client tests once and
    also compute the code coverage.
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:

- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## Key Features

This project puts together an Angular frontend, Javalin java back-end, and a MongoDB database. We use 4 different collections to track all of the different objects that we work with. A 'Product' collection, which contains the individual types of different products we track. There's a 'Pantry' collection which tracks all the different instances of a type of product. This reflects the amount that you currently have in your 'Pantry'. There's a 'PantryProduct' collection which is just an aggregated type of 'Pantry' items with a quantity for better UI and usability. Finally, there's a 'ShoppingList' collection which we use to track the generated shopping list that a user would take to the store. The reason that there needs to be a collection for this is because it gives the user the ability to manually edit the list. For all of the different collections, we have ways for users to edit the collections using the front-end UI. 

The shopping list is generated using a Java algorithm which queries the 'Products' collection to find the threshold of different products, and then checks the 'Pantry' for the amounts of those products. If there is a lower quantity of products in the 'Pantry' than is the threshold for that given product, a quantity to reach that threshold is added to the 'ShoppingList'.

This backend 'ShoppingList' generation algorithm could most definitely be improved. Right now it aggregates all of the collections into java arrays and iterates over those arrays. Using interesting and complex mongo queries to problem solve this would be much faster, and would make the project a whole lot more scaleable.

Another feature which is worth mentioning is the ability to search for and filter different collections on the frontend. This exists on multiple different pages in multiple different ways, often just for searching for something, but on pages like the ShoppingList page, to be able to add products directly to the list.

## [Deployment](DEPLOYMENT.md)

Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## Contributors

This contributors to this project can be seen [here](../../graphs/contributors).
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://floogulinc.com/"><img src="https://avatars.githubusercontent.com/u/1300395?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Paul Friederichsen</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Code">💻</a> <a href="#content-floogulinc" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Documentation">📖</a> <a href="#ideas-floogulinc" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-floogulinc" title="Mentoring">🧑‍🏫</a> <a href="#question-floogulinc" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3Afloogulinc" title="Reviewed Pull Requests">👀</a> <a href="#security-floogulinc" title="Security">🛡️</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=floogulinc" title="Tests">⚠️</a> <a href="#a11y-floogulinc" title="Accessibility">️️️️♿️</a> <a href="#infra-floogulinc" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-floogulinc" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/helloworld12321"><img src="https://avatars.githubusercontent.com/u/56209343?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe Moonan Walbran</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/issues?q=author%3Ahelloworld12321" title="Bug reports">🐛</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Code">💻</a> <a href="#content-helloworld12321" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Documentation">📖</a> <a href="#ideas-helloworld12321" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-helloworld12321" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-helloworld12321" title="Maintenance">🚧</a> <a href="#mentoring-helloworld12321" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-helloworld12321" title="Project Management">📆</a> <a href="#question-helloworld12321" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3Ahelloworld12321" title="Reviewed Pull Requests">👀</a> <a href="#tool-helloworld12321" title="Tools">🔧</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=helloworld12321" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kklamberty"><img src="https://avatars.githubusercontent.com/u/2751987?v=4?s=100" width="100px;" alt=""/><br /><sub><b>K.K. Lamberty</b></sub></a><br /><a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Code">💻</a> <a href="#content-kklamberty" title="Content">🖋</a> <a href="#design-kklamberty" title="Design">🎨</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Documentation">📖</a> <a href="#ideas-kklamberty" title="Ideas, Planning, & Feedback">🤔</a> <a href="#mentoring-kklamberty" title="Mentoring">🧑‍🏫</a> <a href="#projectManagement-kklamberty" title="Project Management">📆</a> <a href="#question-kklamberty" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=kklamberty" title="Tests">⚠️</a> <a href="#tutorial-kklamberty" title="Tutorials">✅</a> <a href="#a11y-kklamberty" title="Accessibility">️️️️♿️</a></td>
    <td align="center"><a href="http://www.morris.umn.edu/~mcphee"><img src="https://avatars.githubusercontent.com/u/302297?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nic McPhee</b></sub></a><br /><a href="#infra-NicMcPhee" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Tests">⚠️</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/issues?q=author%3ANicMcPhee" title="Bug reports">🐛</a> <a href="#content-NicMcPhee" title="Content">🖋</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Documentation">📖</a> <a href="#design-NicMcPhee" title="Design">🎨</a> <a href="#maintenance-NicMcPhee" title="Maintenance">🚧</a> <a href="#projectManagement-NicMcPhee" title="Project Management">📆</a> <a href="#question-NicMcPhee" title="Answering Questions">💬</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/pulls?q=is%3Apr+reviewed-by%3ANicMcPhee" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/UMM-CSci-3601/3601-iteration-template/commits?author=NicMcPhee" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
