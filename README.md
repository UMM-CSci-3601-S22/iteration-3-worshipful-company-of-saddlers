# CSCI 3601 Iteration Template <!-- omit in toc -->

[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S22/it-1-bletchley-park?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S22/it-1-bletchley-park.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S22/it-1-bletchley-park/alerts/)

- [Key Features](#key-features)
- [Development](#development)
- [Deployment](#deployment)
- [Resources](#resources)
- [Known Issues](#known-issues)
- [Contributors](#contributors)

For shoppers who want an organized pantry and shopping experience, Handy Pantry is a home pantry inventory system that tracks consumption and storage. Unlike pen and paper, our product uses your grocery usage information to automatically generate an up-to-date shopping list.

## Key Features

This project puts together an Angular frontend, Javalin java back-end, and a MongoDB database. We use 4 different collections to track all of the different objects that we work with. A 'Product' collection, which contains the individual types of different products we track. There's a 'Pantry' collection which tracks all the different instances of a type of product. This reflects the amount that you currently have in your 'Pantry'. There's a 'PantryProduct' collection which is just an aggregated type of 'Pantry' items with a quantity for better UI and usability. Finally, there's a 'ShoppingList' collection which we use to track the generated shopping list that a user would take to the store. The reason that there needs to be a collection for this is because it gives the user the ability to manually edit the list. For all of the different collections, we have ways for users to edit the collections using the front-end UI. 

The shopping list is generated using a Java algorithm which queries the 'Products' collection to find the threshold of different products, and then checks the 'Pantry' for the amounts of those products. If there is a lower quantity of products in the 'Pantry' than is the threshold for that given product, a quantity to reach that threshold is added to the 'ShoppingList'.

This backend 'ShoppingList' generation algorithm could most definitely be improved. Right now it aggregates all of the collections into java arrays and iterates over those arrays. Using interesting and complex mongo queries to problem solve this would be much faster, and would make the project a whole lot more scaleable.

Another feature which is worth mentioning is the ability to search for and filter different collections on the frontend. This exists on multiple different pages in multiple different ways, often just for searching for something, but on pages like the ShoppingList page, to be able to add products directly to the list.

## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

## [Deployment](DEPLOYMENT.md)

Instructions on how to create a DigitalOcean Droplet and setup your project are in [the deployment guide](DEPLOYMENT.md).

## [Resources](RESOURCES.md)

Additional resources on tooling and techniques are in [the resources list](RESOURCES.md).

## [Known Issues](TO-DO-LIST.md)

Additional resources on known issues are in [the TO-DO-LIST](TO-DO-LIST.md).

## Contributors

This contributors to this project can be seen [here](../../graphs/contributors).
