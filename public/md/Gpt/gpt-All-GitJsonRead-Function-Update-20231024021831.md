# **<span style="font-size: 35px; font-style: italic;">WebSocket Crypto Data Logic</span>**


- WebSocket Crypto Data Logic  
- 2023년 12월 05일 04시 15분  
- SaaS  
- #article #code #keyword  
- **WebSocketLogic Class:**
   - Constructor: Takes parameters such as keys to retrieve, component name, request call, sorting type, sorting order, and starting position.
   - Initializes various reactive properties using Vue's `ref` for handling WebSocket data, sorting, and filtering.
   - Sets up WebSocket functionality and registers an update function to handle incoming data.
   - Provides methods like `createFall`, `createRise`, and `createPNCnt` to create reactive computed properties for filtering and counting data.
   - Contains functions for counting signed change rates, sorting values, and slicing sorted values.
   - The `updateWsData` method processes incoming WebSocket data, sorts it, and updates the reactive propertie  
- [Github edited](https://github.com/d10000usd/WebDocuments/tree/main/public/md/Gpt "깃허브")
**** 


## Description  

<body class="body-full"><div class="c-custom-card"> <div class="spacing mb-2">  



###  <img src="https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/Team/40-goal.svg" width="50" height="50" />   

  This code defines a class `WebSocketLogic` and a function `useWebSocketLogic` for managing WebSocket data related to cryptocurrency ticker information. Here's a brief explanation:

1. **WebSocketLogic Class:**
   - Constructor: Takes parameters such as keys to retrieve, component name, request call, sorting type, sorting order, and starting position.
   - Initializes various reactive properties using Vue's `ref` for handling WebSocket data, sorting, and filtering.
   - Sets up WebSocket functionality and registers an update function to handle incoming data.
   - Provides methods like `createFall`, `createRise`, and `createPNCnt` to create reactive computed properties for filtering and counting data.
   - Contains functions for counting signed change rates, sorting values, and slicing sorted values.
   - The `updateWsData` method processes incoming WebSocket data, sorts it, and updates the reactive properties.

2. **useWebSocketLogic Function:**
   - Takes parameters similar to the constructor of the `WebSocketLogic` class and creates an instance of it.
   - Returns reactive properties and the `updateWsData` method for external use.

3. **Usage:**
   - The code seems to be part of a larger application that involves real-time updates of cryptocurrency ticker information using WebSocket communication.
   - It provides functionalities to filter, sort, and process the received data for display or further analysis in a Vue.js application.

If you have specific questions or if you need further clarification on any part of the code, feel free to ask.








</div></div></div><body class="body-full"><div class="c-custom-card"> <div class="spacing mb-2">  



###  <img src="https://raw.githubusercontent.com/d10000usd/WebDocuments/main/public/icon/Team/40-goal.svg" width="50" height="50" />   

  This code defines a TypeScript class `WebSocketService` that handles WebSocket communication for fetching and processing cryptocurrency ticker information from the Upbit API. Here's a brief explanation:

1. **CoinData Interface:**
   - Defines the structure of data expected for each coin, including properties like code, highest and lowest prices in the last 52 weeks, current trade price, etc.

2. **WebSocketService Class:**
   - Properties:
     - `ws`: Represents the WebSocket connection.
     - `updateFunctions`: An array of functions to be called when there's an update from the WebSocket.
     - `dataDictionary`: Stores data received from the WebSocket.
     - `coinsData`: Stores processed data for each coin.
     - `tickersRaw`: An array of ticker codes, initially loaded from a JSON file.

   - Constructor:
     - Initializes the `updateFunctions` array with an optional initial update function.

   - Methods:
     - `registerUpdateFunction`: Registers a function to be called on WebSocket updates.
     - `handleWebSocketMessageIn`: Handles incoming WebSocket messages, parses the JSON data, and triggers update functions.
     - `dataSettings`: Processes incoming data for a specific coin, calculates percentage changes, and updates `coinsData`.
     - `setupWebSocket`: Sets up the WebSocket connection to the Upbit API, sends an initial request for ticker data, and handles WebSocket events (open, close, message).

3. **Usage:**
   - The `sharedWebSocketService` constant is an instance of the `WebSocketService` class, representing a shared WebSocket service for the application.
   - The WebSocket is opened to connect to the Upbit API, and appropriate handlers are set for open, close, and message events.
   - When data is received from the WebSocket, it is processed and triggers update functions.

4. **Note:**
   - There's a reconnection mechanism in the `onclose` event, attempting to reconnect after a specified delay.
   - The code uses TypeScript features such as interfaces, types, and async/await for handling asynchronous operations.

If you have specific questions or if you need further clarification on any part of the code, feel free to ask.








</div></div></div><div style="background-color: grey; height: 15px;"></div>

  